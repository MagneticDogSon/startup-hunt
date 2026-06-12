import { readFile } from 'fs/promises';

import { NextResponse } from 'next/server';

import { authWithFreshRole } from '@/modules/auth/lib/session';

import { prisma } from '@/shared/lib/prisma';

import { canViewStartups } from '@/shared/lib/permissions';

import { resolveUploadFilePath } from '@/shared/lib/path-safe';

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



  const filePath = resolveUploadFilePath(file.startupId, file.filename);

  if (!filePath) {

    return applySecurityHeaders(

      NextResponse.json({ error: 'Файл не найден' }, { status: 404 }),

    );

  }



  try {

    const buffer = await readFile(filePath);

    const inline = new URL(request.url).searchParams.get('inline') === '1';

    const disposition = inline ? 'inline' : 'attachment';

    const safeName = contentDispositionFilename(file.originalName);



    return applySecurityHeaders(

      new NextResponse(buffer, {

        headers: {

          'Content-Type': file.mimeType,

          'Content-Disposition': `${disposition}; ${safeName}`,

          'Cache-Control': 'private, no-store',

          'X-Content-Type-Options': 'nosniff',

        },

      }),

    );

  } catch {

    return applySecurityHeaders(

      NextResponse.json({ error: 'Файл не найден на диске' }, { status: 404 }),

    );

  }

}


