import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { Role, type Role as RoleType } from '@/modules/auth/lib/roles';
import { authConfig } from '@/modules/auth/lib/auth.config';
import { canManageRoles, canViewStartups } from '@/shared/lib/permissions';
import { rateLimit } from '@/shared/lib/rate-limit';
import {
  applySecurityHeaders,
  getClientIp,
  httpsRedirectUrl,
  isHttpsRequest,
  isProtectedApiPath,
  isPublicPath,
  shouldEnforceHttps,
} from '@/shared/lib/security';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  if (shouldEnforceHttps() && !isHttpsRequest(req)) {
    return applySecurityHeaders(
      NextResponse.redirect(httpsRedirectUrl(req), 308),
    );
  }

  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/auth')) {
    const ip = getClientIp(req);
    const limited = rateLimit(`auth-endpoint:${ip}`, 30, 60_000);
    if (!limited.ok) {
      return applySecurityHeaders(
        NextResponse.json(
          { error: 'Слишком много попыток. Подождите.' },
          { status: 429, headers: { 'Retry-After': String(limited.retryAfterSec) } },
        ),
      );
    }
  }

  if (!req.auth?.user) {
    if (isProtectedApiPath(pathname)) {
      return applySecurityHeaders(
        NextResponse.json({ error: 'Не авторизован' }, { status: 401 }),
      );
    }
    if (!isPublicPath(pathname)) {
      const login = new URL('/login', req.url);
      login.searchParams.set('callbackUrl', pathname);
      return applySecurityHeaders(NextResponse.redirect(login));
    }
    return applySecurityHeaders(NextResponse.next());
  }

  const role = req.auth.user.role as RoleType;

  if (role === Role.PENDING && pathname !== '/pending') {
    return applySecurityHeaders(
      NextResponse.redirect(new URL('/pending', req.url)),
    );
  }

  if (pathname.startsWith('/admin') && !canManageRoles(role)) {
    return applySecurityHeaders(
      NextResponse.redirect(new URL('/startups', req.url)),
    );
  }

  if (pathname === '/') {
    return applySecurityHeaders(
      NextResponse.redirect(new URL('/startups', req.url)),
    );
  }

  if (
    pathname.startsWith('/startups') &&
    role !== Role.PENDING &&
    !canViewStartups(role) &&
    !pathname.includes('/new') &&
    !pathname.includes('/edit')
  ) {
    return applySecurityHeaders(
      NextResponse.redirect(new URL('/pending', req.url)),
    );
  }

  return applySecurityHeaders(NextResponse.next());
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
