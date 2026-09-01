import type { Product } from '../types';
import { mockInspections } from './mockInspections';
export const mockProducts: Product[] = mockInspections.map((x, i) => ({
  id: `PRD-${i + 1}`,
  name: x.product,
  brand: x.product.split(' ')[0],
  manufacturer: x.manufacturer,
  category: x.category,
  lastInspection: x.date,
  status: x.status,
  violations: x.violations.length,
}));
