import { mockInspections } from '../data/mockInspections';
import type { AuditLabelResponse, Inspection, Product } from '../types';

const AUDIT_LABEL_API =
  (import.meta.env.VITE_AUDIT_LABEL_API_URL as string | undefined) ??
  'http://80.225.241.2:8000/api/audit-label';
const LOCAL_STORAGE_KEY = 'packsure_inspections_store';

function getStoredInspections(): Inspection[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? [...parsed, ...mockInspections] : [...mockInspections];
  } catch {
    return [...mockInspections];
  }
}

let dynamicInspections = getStoredInspections();

export const pause = (ms = 650) => new Promise((resolve) => setTimeout(resolve, ms));

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as JsonRecord)
    : {};
}

function asText(value: unknown, fallback = ''): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : fallback;
}

function getNumber(record: JsonRecord, keys: string[], fallback: number): number {
  for (const key of keys) {
    const value = record[key];
    const parsed = typeof value === 'number' ? value : Number.parseFloat(asText(value));
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function normalizeAuditResponse(response: unknown, file: File): Inspection {
  const data = response as AuditLabelResponse;
  const declarations: Inspection['declarations'] = data.rules_summary.map((rule) => ({
    label: rule.rule,
    value: rule.detail,
    confidence: data.confidence,
  }));
  const checks: Inspection['checks'] = data.rules_summary.map((rule) => ({
    requirement: rule.rule,
    detectedValue: rule.detail,
    status: rule.status === 'Compliant' ? 'PASS' : rule.status === 'Non-Compliant' ? 'FAIL' : 'WARNING',
    explanation: rule.detail,
  }));
  const status = data.status === 'PASS' ? 'COMPLIANT' : data.status === 'FAIL' ? 'VIOLATION' : 'NEEDS REVIEW';
  const product = data.extracted_text.split(/\r?\n/)[0]?.slice(0, 80) || file.name;
  const manufacturer = 'Extracted from audit-label OCR';

  return {
    id: `INS-${Date.now()}`,
    product,
    manufacturer,
    date: new Date().toLocaleDateString('en-IN'),
    score: data.confidence,
    status,
    inspector: 'Audit Label API',
    category: 'Packaged Commodity',
    declarations,
    checks,
    violations: checks.filter((check) => check.status === 'FAIL').map((check, index) => ({
      id: `V-${Date.now()}-${index}`,
      rule: check.requirement,
      title: `${check.requirement} requires attention`,
      severity: 'High' as const,
      description: check.explanation,
    })),
    auditStatus: data.status,
    auditConfidence: data.confidence,
    auditReasons: data.reasons,
    rulesSummary: data.rules_summary,
    extractedText: data.extracted_text,
    auditId: data.audit_id,
  };
}

export async function analyzeAuditLabel(
  file: File,
  onProgress?: (pct: number, status: string) => void,
): Promise<Inspection> {
  onProgress?.(15, 'Uploading image to the audit-label service…');
  const form = new FormData();
  form.append('file', file);
  const response = await fetch(AUDIT_LABEL_API, { method: 'POST', body: form });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `${response.status} ${response.statusText}`);
  }
  onProgress?.(90, 'Building compliance report from audit labels…');
  const payload = await response.json() as AuditLabelResponse;
  const inspection = normalizeAuditResponse(payload, file);
  saveNewInspection(inspection);
  onProgress?.(100, 'Audit label analysis complete.');
  return inspection;
}

export async function analyzePackage(
  file?: File | null,
  sampleId?: string,
  onProgress?: (pct: number, status: string) => void,
): Promise<Inspection> {
  if (file) return analyzeAuditLabel(file, onProgress);
  if (sampleId) {
    const sampleIndex = Number(sampleId.replace('sample-', '')) - 1;
    if (sampleIndex >= 0 && sampleIndex < mockInspections.length) return mockInspections[sampleIndex];
  }
  await pause(1000);
  return dynamicInspections[0];
}

export function saveNewInspection(inspection: Inspection): void {
  dynamicInspections = [inspection, ...dynamicInspections.filter((item) => item.id !== inspection.id)];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([inspection]));
}

export async function getInspections(): Promise<Inspection[]> {
  await pause(200);
  return dynamicInspections;
}

export async function getInspectionById(id: string): Promise<Inspection> {
  await pause(200);
  return dynamicInspections.find((item) => item.id === id) ??
    mockInspections.find((item) => item.id === id) ??
    dynamicInspections[0];
}

export async function getProducts(): Promise<Product[]> {
  await pause(200);
  return dynamicInspections.map((item, index) => ({
    id: `PRD-${index + 1}`,
    name: item.product,
    brand: item.product.split(' ')[0],
    manufacturer: item.manufacturer,
    category: item.category,
    lastInspection: item.date,
    status: item.status,
    violations: item.violations.length,
  }));
}

export async function generateReport(_inspectionId?: string): Promise<{ url: string; generated: boolean }> {
  await pause();
  return { url: '#', generated: true };
}

export async function getDashboardAnalytics() {
  return null;
}
