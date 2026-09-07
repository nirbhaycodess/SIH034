import { Inspection } from '../types';
import { mockInspections } from '../data/mockInspections';

const API_BASE_URL = 'https://80-225-241-2.sslip.io';

export async function analyzeAuditLabel(
  file: File,
  onProgress?: (percent: number, statusText: string) => void
): Promise<Inspection> {
  const formData = new FormData();
  formData.append('file', file);

  // Store local object URL so BoundingBoxViewer in InspectionResult can render it
  const localPreviewUrl = URL.createObjectURL(file);

  onProgress?.(15, 'Enhancing image contrast & running Tesseract OCR...');

  const progressInterval = setInterval(() => {
    onProgress?.(55, 'Evaluating declarations against Legal Metrology Rules, 2011...');
  }, 1200);

  try {
    const res = await fetch(`${API_BASE_URL}/api/audit-label`, {
      method: 'POST',
      body: formData,
    });

    clearInterval(progressInterval);

    if (!res.ok) {
      throw new Error(`Audit API responded with status ${res.status}`);
    }

    onProgress?.(90, 'Formatting compliance matrices and statutory report...');
    const data = await res.json();

    const inspection: Inspection = {
      id: data.id || `INS-${Date.now()}`,
      product: data.product || file.name.replace(/\.[^/.]+$/, ''),
      category: data.category || 'General Commodity',
      manufacturer: data.manufacturer || 'Domestic Packer',
      date: data.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      inspector: data.inspector || 'Officer Priya Sharma',
      score: typeof data.score === 'number' ? data.score : 80,
      status: data.status || 'NEEDS REVIEW',
      imageUrl: localPreviewUrl,
      declarations: data.declarations || [],
      checks: data.checks || [],
      violations: data.violations || [],
      auditStatus: data.auditStatus || 'PASS',
      auditConfidence: data.auditConfidence || 90,
      auditReasons: data.auditReasons || [],
      rulesSummary: data.rulesSummary || [],
      extractedText: data.extractedText || '',
      auditId: data.auditId || data.id,
    };

    // Cache the inspection in the browser so InspectionResult.tsx can load it
    sessionStorage.setItem(`inspection_${inspection.id}`, JSON.stringify(inspection));

    return inspection;
  } catch (error) {
    clearInterval(progressInterval);
    throw error;
  }
}

export async function getInspectionById(id: string): Promise<Inspection | undefined> {
  // Look up the inspection in browser storage (stateless UI architecture)
  const cached = sessionStorage.getItem(`inspection_${id}`);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // Fall through to mock if parsing fails
    }
  }

  // Fallback for SIH demo dashboard data
  return mockInspections.find((x) => x.id === id);
}

export async function analyzePackage(
  file: File | null,
  sampleId?: string
): Promise<Inspection> {
  // Simulates sample processing if user clicked a quick demo card
  const found = mockInspections.find((x) => x.id === sampleId) || mockInspections[0];
  return found;
}