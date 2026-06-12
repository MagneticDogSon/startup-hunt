import path from 'path';

export function resolveUploadFilePath(startupId: string, filename: string): string | null {
  if (
    !startupId ||
    !filename ||
    filename.includes('..') ||
    path.isAbsolute(filename)
  ) {
    return null;
  }

  const uploadDir = path.resolve(process.cwd(), 'uploads', startupId);
  const filePath = path.resolve(uploadDir, filename);

  if (filePath !== uploadDir && !filePath.startsWith(uploadDir + path.sep)) {
    return null;
  }

  return filePath;
}
