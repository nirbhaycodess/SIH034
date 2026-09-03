/**
 * PackSure AI — Frontend API client
 *
 * When VITE_API_BASE_URL is set, real backend calls are made.
 * When not set, falls back to local mock/localStorage mode.
 */
import { mockInspections } from '../data/mockInspections';
import { mockProducts } from '../data/mockProducts';
import type { Inspection, Product } from '../types';
import { analyzeRealLabelImage } from './realLabelAnalyzer';

// ── Backend base URL (set in .env as VITE_API_BASE_URL) ────────────────────
const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

// ── Token storage ─────────────────────────────────────────────────────────
const TOKEN_KEY = 'packsure_access_token';
const REFRESH_KEY = 'packsure_refresh_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setTokens(access: string, refresh: string): void {
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// ── Generic fetch helper ───────────────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const base = API_BASE?.replace(/\/$/, '') ?? '';
  const url = `${base}${path}`;

  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }

  return res.json();
}

// ── Local storage helpers (offline/mock mode) ─────────────────────────────
const LOCAL_STORAGE_KEY = 'packsure_inspections_store';

function getStoredInspections(): Inspection[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return [...parsed, ...mockInspections];
      }
    }
  } catch {
    // fallback
  }
  return [...mockInspections];
}

let dynamicInspections: Inspection[] = getStoredInspections();

export const pause = (ms = 650) => new Promise((resolve) => setTimeout(resolve, ms));

// ── Auth ──────────────────────────────────────────────────────────────────
export async function login(email?: string, password?: string) {
  if (API_BASE && email && password) {
    const res = await apiFetch<{
      access_token: string;
      refresh_token: string;
      token_type: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setTokens(res.access_token, res.refresh_token);

    const me = await apiFetch<{ data: { id: string; name: string; email: string; role: string } }>('/auth/me');
    return { id: me.data.id, name: me.data.name, email: me.data.email, role: me.data.role };
  }

  // Mock fallback
  await pause();
  return { id: 'USR-1', name: 'Priya Sharma', email: 'priya.sharma@gov.in', role: 'Enforcement Officer' };
}

export async function logout() {
  if (API_BASE && getToken()) {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch { /* best-effort */ }
  }
  clearTokens();
}

// ── Image upload ──────────────────────────────────────────────────────────
export async function uploadInspectionImage(file: File, inspectionId?: string) {
  if (API_BASE) {
    const form = new FormData();
    form.append('file', file);
    if (inspectionId) form.append('inspection_id', inspectionId);
    const res = await apiFetch<{ data: { file_path: string; file_name: string } }>('/uploads/image', {
      method: 'POST',
      body: form,
    });
    return { name: res.data.file_name, url: `${API_BASE}/uploads/${res.data.file_name}` };
  }

  await pause(300);
  return { name: file.name, url: URL.createObjectURL(file) };
}

// ── Analysis ──────────────────────────────────────────────────────────────
export async function analyzePackage(
  file?: File | null,
  sampleId?: string,
  onProgress?: (pct: number, status: string) => void,
  languageMode: 'eng+hin' | 'eng' | 'hin' = 'eng+hin'
): Promise<Inspection> {
  // Real uploaded image — use client-side OCR + compliance pipeline
  if (file) {
    const result = await analyzeRealLabelImage(file, languageMode, onProgress);
    saveNewInspection(result.inspection);

    // If backend is configured, also POST to backend for persistence
    if (API_BASE) {
      try {
        const form = new FormData();
        form.append('file', file);
        await apiFetch('/analysis/quick-analyze', { method: 'POST', body: form });
      } catch {
        // Non-fatal — client-side result is authoritative for UX
      }
    }

    return result.inspection;
  }

  // Sample package selected
  if (sampleId) {
    if (sampleId === 'sample-1') return mockInspections[0];
    if (sampleId === 'sample-2') return mockInspections[1];
    if (sampleId === 'sample-3') return mockInspections[2];
    if (sampleId === 'sample-4') return mockInspections[3];
  }

  await pause(1000);
  return dynamicInspections[0];
}

export function saveNewInspection(inspection: Inspection) {
  dynamicInspections = [inspection, ...dynamicInspections.filter((x) => x.id !== inspection.id)];
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([inspection]));
  } catch {
    // ignore
  }
}

// ── Inspections ───────────────────────────────────────────────────────────
export async function getInspections(): Promise<Inspection[]> {
  if (API_BASE) {
    try {
      const res = await apiFetch<{ data: { items: Inspection[] } }>('/inspections?page=1&page_size=50');
      // Merge backend items with client-side dynamic ones
      const backendIds = new Set((res.data.items ?? []).map((i) => i.id));
      const localOnly = dynamicInspections.filter((i) => !backendIds.has(i.id));
      return [...localOnly, ...(res.data.items ?? [])];
    } catch {
      // Fall through to local
    }
  }
  await pause(200);
  return dynamicInspections;
}

export async function getInspectionById(id: string): Promise<Inspection> {
  if (API_BASE) {
    try {
      const res = await apiFetch<{ data: Inspection }>(`/inspections/${id}`);
      return res.data;
    } catch {
      // Fall through to local
    }
  }
  await pause(200);
  const found = dynamicInspections.find((x) => x.id === id);
  if (found) return found;
  const mockFound = mockInspections.find((x) => x.id === id);
  if (mockFound) return mockFound;
  return dynamicInspections[0];
}

// ── Products ──────────────────────────────────────────────────────────────
export async function getProducts(): Promise<Product[]> {
  if (API_BASE) {
    try {
      const res = await apiFetch<{ data: { items: any[] } }>('/products?page=1&page_size=50');
      return (res.data.items ?? []).map((p: any) => ({
        id: p.id,
        name: p.product_name,
        brand: p.brand,
        manufacturer: p.manufacturer,
        category: p.category,
        lastInspection: p.updated_at,
        status: 'COMPLIANT',
        violations: 0,
      }));
    } catch {
      // Fall through to local
    }
  }
  await pause(200);
  return dynamicInspections.map((x, i) => ({
    id: `PRD-${i + 1}`,
    name: x.product,
    brand: x.product.split(' ')[0],
    manufacturer: x.manufacturer,
    category: x.category,
    lastInspection: x.date,
    status: x.status,
    violations: x.violations.length,
  }));
}

// ── Reports ───────────────────────────────────────────────────────────────
export async function generateReport(inspectionId?: string): Promise<{ url: string; generated: boolean }> {
  if (API_BASE && inspectionId) {
    try {
      const res = await apiFetch<{ data: { download_url: string } }>(`/reports/generate/${inspectionId}`, {
        method: 'POST',
      });
      return {
        url: `${API_BASE}${res.data.download_url}`,
        generated: true,
      };
    } catch {
      // Fall through
    }
  }
  await pause();
  return { url: '#', generated: true };
}

// ── Analytics ─────────────────────────────────────────────────────────────
export async function getDashboardAnalytics() {
  if (API_BASE) {
    try {
      const res = await apiFetch<{ data: any }>('/analytics/dashboard');
      return res.data;
    } catch { /* ignore */ }
  }
  return null;
}
