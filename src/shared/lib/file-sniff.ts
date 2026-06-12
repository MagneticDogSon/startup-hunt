import { ALLOWED_MIME_TYPES } from '@/shared/lib/upload';

/** Detect MIME from magic bytes; returns null if unknown or disallowed. */
export function detectMimeFromBuffer(buffer: Buffer): string | null {
  if (buffer.length < 4) return null;

  if (buffer.subarray(0, 4).toString('ascii') === '%PDF') {
    return 'application/pdf';
  }

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return 'image/png';
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  if (buffer[0] === 0x50 && buffer[1] === 0x4b) {
    const head = buffer
      .subarray(0, Math.min(buffer.length, 8192))
      .toString('latin1');
    if (head.includes('[Content_Types].xml') || head.includes('word/')) {
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
    return null;
  }

  return null;
}

export function assertAllowedFileContent(
  buffer: Buffer,
  declaredType: string,
  fileName: string,
): string {
  const detected = detectMimeFromBuffer(buffer);
  if (!detected) {
    throw new Error(`Не удалось определить тип файла ${fileName}`);
  }
  if (!ALLOWED_MIME_TYPES.has(detected)) {
    throw new Error(`Тип файла ${fileName} не поддерживается`);
  }

  const declaredOk = declaredType === detected;

  if (!declaredOk && declaredType !== '' && declaredType !== 'application/octet-stream') {
    throw new Error(
      `Содержимое файла ${fileName} не соответствует заявленному типу`,
    );
  }

  return detected;
}
