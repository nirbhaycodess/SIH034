import { mockInspections } from '../data/mockInspections';
import { mockProducts } from '../data/mockProducts';
export const pause = (ms = 650) => new Promise((resolve) => setTimeout(resolve, ms));
export async function login() {
  await pause();
  return { id: 'USR-1', name: 'Priya Sharma', email: 'priya.sharma@gov.in', role: 'Enforcement Officer' };
}
export async function uploadInspectionImage(file: File) {
  await pause();
  return { name: file.name, url: URL.createObjectURL(file) };
}
export async function analyzePackage() {
  await pause(1400);
  return mockInspections[0];
}
export async function getInspections() {
  await pause();
  return mockInspections;
}
export async function getInspectionById(id: string) {
  await pause();
  return mockInspections.find((x) => x.id === id) ?? mockInspections[0];
}
export async function getProducts() {
  await pause();
  return mockProducts;
}
export async function generateReport() {
  await pause();
  return { url: '#', generated: true };
}
