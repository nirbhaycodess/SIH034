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
export type AuditStatus = 'PASS' | 'FAIL' | 'Inconclusive';
export type AuditRuleStatus = 'Compliant' | 'Non-Compliant' | 'Missing';
export type AuditRuleColor = 'green' | 'red' | 'yellow';
export interface AuditRuleSummary {
  rule: string;
  status: AuditRuleStatus;
  color: AuditRuleColor;
  detail: string;
}
export interface AuditLabelResponse {
  status: AuditStatus;
  confidence: number;
  reasons: string[];
  rules_summary: AuditRuleSummary[];
  extracted_text: string;
  audit_id: string;
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
  auditStatus?: AuditStatus;
  auditConfidence?: number;
  auditReasons?: string[];
  rulesSummary?: AuditRuleSummary[];
  extractedText?: string;
  auditId?: string;
}
export interface Report {
  id: string;
  product: string;
  date: string;
  status: Status;
  inspector: string;
}
