/**
 * PackSure AI — Frontend API client
 *
 * When VITE_API_BASE_URL is set, real backend calls are made.
 * When not set, falls back to local mock/localStorage mode.
 */
import { mockInspections } from '../data/mockInspections';
import { mockProducts } from '../data/mockProducts';
import type { Inspection, Product } from '../types';

// ── Backend base URL (set in .env as VITE_API_BASE_URL) ────────────────────
const configuredApiBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
const API_BASE = configuredApiBase
  ? `${configuredApiBase.replace(/\/$/, '')}${configuredApiBase.endsWith('/api/v1') ? '' : '/api/v1'}`
  : import.meta.env.DEV
    ? 'http://localhost:8000/api/v1'
    : undefined;

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
  if (file) {
    if (!API_BASE) {
      throw new Error('Backend analysis is not configured. Set VITE_API_BASE_URL before uploading an image.');
    }

    onProgress?.(15, 'Uploading image for PaddleOCR and Gemini analysis…');
    const form = new FormData();
    form.append('file', file);
    const backendResult = await apiFetch<{
      data: {
        status: string;
        compliance_score: number;
        declarations: Record<string, { value?: string | null; confidence?: number }>;
        ocr_text?: string;
        ocr_engine?: string;
        compliance_checks: Array<{
          field_name: string;
          status: string;
          detected_value?: string | null;
          explanation: string;
        }>;
        summary: { label: string };
        image_url?: string;
      };
    }>('/analysis/quick-analyze', { method: 'POST', body: form });

    onProgress?.(90, 'Building compliance report…');
    const data = backendResult.data;
    const declarations = Object.entries(data.declarations)
      .filter(([, field]) => field.value != null && field.value !== '')
      .map(([label, field]) => ({
        label: label.replace(/_/g, ' '),
        value: String(field.value),
        confidence: Math.round((field.confidence ?? 0) * 100),
      }));
    const checks = data.compliance_checks.map((check) => ({
      requirement: check.field_name.replace(/_/g, ' '),
      detectedValue: check.detected_value ?? 'Not detected',
      status: check.status === 'PASS' ? 'PASS' : check.status === 'FAIL' ? 'FAIL' : 'WARNING',
      explanation: check.explanation,
    })) as Inspection['checks'];
    const inspection: Inspection = {
      id: `INS-${Date.now()}`,
      product: declarations.find((item) => item.label === 'product name')?.value ?? file.name,
      manufacturer: declarations.find((item) => item.label === 'manufacturer')?.value ?? 'Not detected',
      date: new Date().toLocaleDateString('en-IN'),
      score: data.compliance_score,
      status: data.status === 'COMPLIANT' ? 'COMPLIANT' : data.status === 'NON_COMPLIANT' ? 'VIOLATION' : 'NEEDS REVIEW',
      inspector: 'Gemini AI Analysis',
      category: 'Packaged Commodity',
      declarations,
      checks,
      violations: checks
        .filter((check) => check.status === 'FAIL')
        .map((check, index) => ({
          id: `V-${Date.now()}-${index}`,
          rule: check.requirement,
          title: `${check.requirement} requires attention`,
          severity: 'High' as const,
          description: check.explanation,
        })),
      imageUrl: data.image_url,
    };
    saveNewInspection(inspection);
    onProgress?.(100, `${data.ocr_engine ?? 'PaddleOCR'} text and Gemini compliance report ready.`);
    return inspection;
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
