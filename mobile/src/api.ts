export type ExtractedField = { value: string | null; confidence: number };
export type Analysis = {
  filename: string;
  fields: Record<string, ExtractedField>;
  ocr_status: string;
  ocr_error: string | null;
};

export async function analyzeImage(apiUrl: string, uri: string, filename: string): Promise<Analysis> {
  const form = new FormData();
  form.append('file', { uri, name: filename, type: 'image/jpeg' } as unknown as Blob);
  const response = await fetch(`${apiUrl}/api/v1/uploads/images`, {
    method: 'POST',
    body: form,
  });
  if (!response.ok) {
    throw new Error(`Analysis failed (${response.status})`);
  }
  return response.json() as Promise<Analysis>;
}
