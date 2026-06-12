export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_FILES_PER_STARTUP = 20;
export const MAX_TOTAL_FILES_SIZE = 50 * 1024 * 1024;

export const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

export function isAllowedMimeType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.has(mimeType);
}

export function isImageMime(mimeType: string): boolean {
  return mimeType === 'image/png' || mimeType === 'image/jpeg';
}

export function isPdfMime(mimeType: string): boolean {
  return mimeType === 'application/pdf';
}
