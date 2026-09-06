export type Status = 'COMPLIANT' | 'NEEDS REVIEW' | 'VIOLATION' | 'DRAFT';
export type CheckStatus = 'PASS' | 'WARNING' | 'FAIL' | 'REVIEW';
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}
export interface Product {
  id: string;
  name: string;
  brand: string;
  manufacturer: string;
  category: string;
  image?: string;
  lastInspection: string;
  status: Status;
  violations: number;
}
export interface Declaration {
  label: string;
  value: string;
  confidence: number;
}
export interface ComplianceCheck {
  requirement: string;
  detectedValue: string;
  status: CheckStatus;
  explanation: string;
}
export interface Violation {
  id: string;
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  rule: string;
}
export interface Inspection {
  id: string;
  product: string;
  manufacturer: string;
  date: string;
  score: number;
  status: Status;
  inspector: string;
  category: string;
  declarations: Declaration[];
  checks: ComplianceCheck[];
  violations: Violation[];
  imageUrl?: string;
}
export interface Report {
  id: string;
  product: string;
  date: string;
  status: Status;
  inspector: string;
}
