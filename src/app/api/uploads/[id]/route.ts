import { NextResponse } from 'next/server';

import { authWithFreshRole } from '@/modules/auth/lib/session';

import { prisma } from '@/shared/lib/prisma';

import { canViewStartups } from '@/shared/lib/permissions';

import { resolveStorageObjectKey } from '@/shared/lib/path-safe';

import { readStartupFile } from '@/shared/lib/storage';

import { applySecurityHeaders, contentDispositionFilename } from '@/shared/lib/security';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await authWithFreshRole();
  if (!session?.user || !canViewStartups(session.user.role)) {
    return applySecurityHeaders(
      NextResponse.json({ error: 'Нет доступа' }, { status: 403 }),
    );
  }

  const { id } = await params;
  const file = await prisma.startupFile.findUnique({ where: { id } });
  if (!file) {
    return applySecurityHeaders(
      NextResponse.json({ error: 'Файл не найден' }, { status: 404 }),
    );
  }

  if (!resolveStorageObjectKey(file.startupId, file.filename)) {
    return applySecurityHeaders(
      NextResponse.json({ error: 'Файл не найден' }, { status: 404 }),
    );
  }

  const buffer = await readStartupFile(file.startupId, file.filename);
  if (!buffer) {
    return applySecurityHeaders(
      NextResponse.json({ error: 'Файл не найден в хранилище' }, { status: 404 }),
    );
  }

  const inline = new URL(request.url).searchParams.get('inline') === '1';
  const disposition = inline ? 'inline' : 'attachment';
  const safeName = contentDispositionFilename(file.originalName);

  return applySecurityHeaders(
    new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': file.mimeType,
        'Content-Disposition': `${disposition}; ${safeName}`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    }),
  );
}
