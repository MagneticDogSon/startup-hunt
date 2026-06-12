import { isImageMime, isPdfMime } from '@/shared/lib/upload';

export type StartupFileRecord = {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  isPrimary: boolean;
};

export function fileUrl(id: string, inline = true) {
  return `/api/uploads/${id}${inline ? '?inline=1' : ''}`;
}

export function partitionFiles(files: StartupFileRecord[]) {
  const primary =
    files.find((f) => f.isPrimary && isPdfMime(f.mimeType)) ??
    files.find((f) => isPdfMime(f.mimeType));
  const images = files.filter((f) => isImageMime(f.mimeType));
  const attachments = files.filter(
    (f) => f.id !== primary?.id && !isImageMime(f.mimeType),
  );
  return { primary, images, attachments };
}

/** Flat gallery order for fullscreen navigation. */
export function orderedGalleryFiles(files: StartupFileRecord[]): StartupFileRecord[] {
  const { primary, images, attachments } = partitionFiles(files);
  return [...(primary ? [primary] : []), ...images, ...attachments];
}

export function getFileKind(
  file: StartupFileRecord,
): 'pdf' | 'image' | 'download' {
  if (isPdfMime(file.mimeType)) return 'pdf';
  if (isImageMime(file.mimeType)) return 'image';
  return 'download';
}

export function galleryIndexForFile(
  files: StartupFileRecord[],
  fileId: string,
): number {
  const ordered = orderedGalleryFiles(files);
  const idx = ordered.findIndex((f) => f.id === fileId);
  return idx >= 0 ? idx : 0;
}
