import { mkdir, rm, unlink, writeFile } from 'fs/promises';
import path from 'path';

import {
  getSupabaseAdmin,
  isSupabaseStorageConfigured,
  STORAGE_BUCKET,
} from '@/shared/lib/supabase';
import { resolveStorageObjectKey } from '@/shared/lib/path-safe';

function localUploadPath(startupId: string, filename: string): string {
  return path.join(process.cwd(), 'uploads', startupId, filename);
}

async function putFile(
  startupId: string,
  filename: string,
  buffer: Buffer,
  mimeType: string,
) {
  const objectKey = resolveStorageObjectKey(startupId, filename);
  if (!objectKey) {
    throw new Error('Некорректное имя файла');
  }

  if (isSupabaseStorageConfigured()) {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(objectKey, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      throw new Error(error.message);
    }
    return;
  }

  const filePath = localUploadPath(startupId, filename);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, buffer);
}

async function removeFile(startupId: string, filename: string) {
  const objectKey = resolveStorageObjectKey(startupId, filename);
  if (!objectKey) return;

  if (isSupabaseStorageConfigured()) {
    const supabase = getSupabaseAdmin();
    await supabase.storage.from(STORAGE_BUCKET).remove([objectKey]);
    return;
  }

  try {
    await unlink(localUploadPath(startupId, filename));
  } catch {
    // Already removed.
  }
}

export async function readStartupFile(
  startupId: string,
  filename: string,
): Promise<Buffer | null> {
  const objectKey = resolveStorageObjectKey(startupId, filename);
  if (!objectKey) return null;

  if (isSupabaseStorageConfigured()) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(objectKey);

    if (error || !data) return null;
    return Buffer.from(await data.arrayBuffer());
  }

  try {
    const { readFile } = await import('fs/promises');
    return await readFile(localUploadPath(startupId, filename));
  } catch {
    return null;
  }
}

export async function removeStartupStoragePrefix(startupId: string) {
  if (!startupId || startupId.includes('..')) return;

  if (isSupabaseStorageConfigured()) {
    const supabase = getSupabaseAdmin();
    const prefix = `${startupId}/`;
    const toRemove: string[] = [];
    let offset = 0;

    for (;;) {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list(startupId, { limit: 100, offset });

      if (error || !data || data.length === 0) break;

      for (const item of data) {
        if (item.name) toRemove.push(`${prefix}${item.name}`);
      }

      if (data.length < 100) break;
      offset += data.length;
    }

    if (toRemove.length > 0) {
      await supabase.storage.from(STORAGE_BUCKET).remove(toRemove);
    }
    return;
  }

  const uploadDir = path.join(process.cwd(), 'uploads', startupId);
  try {
    await rm(uploadDir, { recursive: true, force: true });
  } catch {
    // Directory may not exist.
  }
}

export { putFile, removeFile };
