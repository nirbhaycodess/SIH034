import type { Violation } from '../types';
export const mockViolations: Violation[] = [
  {
    id: 'V-01',
    title: 'Customer care details missing',
    severity: 'High',
    description: 'No consumer care phone number or email could be identified on the label.',
    rule: 'Rule 6(1)(l)',
  },
  {
    id: 'V-02',
    title: 'MRP declaration requires review',
    severity: 'Medium',
    description: 'MRP was detected but the inclusive-tax declaration is unclear.',
    rule: 'Rule 6(1)(e)',
  },
  {
    id: 'V-03',
    title: 'Country of origin incomplete',
    severity: 'Low',
    description: 'Origin marking is partially obscured in the supplied image.',
    rule: 'Rule 6(1)(d)',
  },
];
