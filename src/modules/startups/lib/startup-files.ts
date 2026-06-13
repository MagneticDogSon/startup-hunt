import { prisma } from '@/shared/lib/prisma';
import { assertAllowedFileContent } from '@/shared/lib/file-sniff';
import {
  isAllowedMimeType,
  isPdfMime,
  MAX_FILES_PER_STARTUP,
  MAX_FILE_SIZE,
  MAX_TOTAL_FILES_SIZE,
} from '@/shared/lib/upload';
import { putFile, removeFile, removeStartupStoragePrefix } from '@/shared/lib/storage';

export async function deleteStartupFiles(startupId: string, fileIds: string[]) {
  if (fileIds.length === 0) return;

  const files = await prisma.startupFile.findMany({
    where: { startupId, id: { in: fileIds } },
  });

  for (const file of files) {
    await removeFile(startupId, file.filename);
  }

  await prisma.startupFile.deleteMany({
    where: { startupId, id: { in: files.map((f) => f.id) } },
  });
}

export async function deleteStartupUploadDir(startupId: string) {
  await removeStartupStoragePrefix(startupId);
}

export async function setStartupPrimaryFile(startupId: string, fileId: string) {
  const file = await prisma.startupFile.findFirst({
    where: { id: fileId, startupId },
  });

  if (!file) {
    throw new Error('Файл не найден');
  }
  if (!isPdfMime(file.mimeType)) {
    throw new Error('Главной презентацией может быть только PDF');
  }

  await prisma.startupFile.updateMany({
    where: { startupId },
    data: { isPrimary: false },
  });
  await prisma.startupFile.update({
    where: { id: fileId },
    data: { isPrimary: true },
  });
}

async function assertStartupFileQuota(startupId: string, incoming: File[]) {
  const existing = await prisma.startupFile.findMany({
    where: { startupId },
    select: { size: true },
  });

  const existingCount = existing.length;
  const existingSize = existing.reduce((sum, f) => sum + f.size, 0);
  const incomingSize = incoming.reduce((sum, f) => sum + f.size, 0);

  if (existingCount + incoming.length > MAX_FILES_PER_STARTUP) {
    throw new Error(
      `Не более ${MAX_FILES_PER_STARTUP} файлов на стартап`,
    );
  }
  if (existingSize + incomingSize > MAX_TOTAL_FILES_SIZE) {
    throw new Error('Общий размер файлов стартапа превышает 50 MB');
  }
}

export async function saveStartupFiles(
  startupId: string,
  files: File[],
  options?: {
    primaryFileIndex?: number;
    replacePrimary?: boolean;
  },
) {
  const validFiles = files.filter((f) => f.size > 0);
  if (validFiles.length === 0) return [];

  await assertStartupFileQuota(startupId, validFiles);

  const existingPrimary = await prisma.startupFile.findFirst({
    where: { startupId, isPrimary: true },
  });
  let primarySet = !!existingPrimary && !options?.replacePrimary;

  const requestedPrimary = options?.primaryFileIndex ?? -1;
  const fallbackPrimary = validFiles.findIndex((f) => isPdfMime(f.type));
  const primaryIndex =
    requestedPrimary >= 0 && requestedPrimary < validFiles.length
      ? requestedPrimary
      : fallbackPrimary;

  const createdOnStorage: string[] = [];
  const createdIds: string[] = [];

  try {
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`Файл ${file.name} превышает 10 MB`);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const mimeType = assertAllowedFileContent(buffer, file.type, file.name);

      if (!isAllowedMimeType(mimeType)) {
        throw new Error(`Тип файла ${file.name} не поддерживается`);
      }

      const filename = `${Date.now()}-${i}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await putFile(startupId, filename, buffer, mimeType);
      createdOnStorage.push(filename);

      const shouldBePrimary =
        isPdfMime(mimeType) &&
        i === primaryIndex &&
        (!primarySet || options?.replacePrimary);

      if (shouldBePrimary) {
        await prisma.startupFile.updateMany({
          where: { startupId },
          data: { isPrimary: false },
        });
        primarySet = true;
      }

      const created = await prisma.startupFile.create({
        data: {
          startupId,
          filename,
          originalName: file.name,
          mimeType,
          size: file.size,
          isPrimary: shouldBePrimary,
        },
      });
      createdIds.push(created.id);
    }

    return createdIds;
  } catch (err) {
    for (const filename of createdOnStorage) {
      await removeFile(startupId, filename);
    }
    if (createdIds.length > 0) {
      await prisma.startupFile.deleteMany({
        where: { id: { in: createdIds } },
      });
    }
    throw err;
  }
}
