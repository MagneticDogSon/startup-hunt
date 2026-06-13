import path from 'path';

/** Validates filename and returns Supabase/local storage key `{startupId}/{filename}`. */
export function resolveStorageObjectKey(
  startupId: string,
  filename: string,
): string | null {
  if (
    !startupId ||
    !filename ||
    startupId.includes('..') ||
    filename.includes('..') ||
    path.isAbsolute(filename) ||
    filename.includes('/') ||
    filename.includes('\\')
  ) {
    return null;
  }

  return `${startupId}/${filename}`;
}

/** @deprecated Use resolveStorageObjectKey */
export function resolveUploadFilePath(
  startupId: string,
  filename: string,
): string | null {
  const key = resolveStorageObjectKey(startupId, filename);
  if (!key) return null;

  const uploadDir = path.resolve(process.cwd(), 'uploads', startupId);
  const filePath = path.resolve(uploadDir, filename);

  if (filePath !== uploadDir && !filePath.startsWith(uploadDir + path.sep)) {
    return null;
  }

  return filePath;
}
