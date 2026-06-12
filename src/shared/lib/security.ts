/** Enable in production behind a TLS terminator (Caddy, nginx, load balancer). */
export function shouldEnforceHttps(): boolean {
  return process.env.ENFORCE_HTTPS === 'true';
}

const PUBLIC_PATH_PREFIXES = ['/', '/login', '/register', '/api/auth'];

export function isPublicPath(pathname: string): boolean {
  if (pathname === '/') return true;
  return PUBLIC_PATH_PREFIXES.some(
    (p) => p !== '/' && (pathname === p || pathname.startsWith(`${p}/`)),
  );
}

export function isProtectedApiPath(pathname: string): boolean {
  return pathname.startsWith('/api/') && !pathname.startsWith('/api/auth');
}

/** Extract client IP for rate limiting (Request in middleware, Headers in server actions). */
export function getClientIp(source: Request | Headers, fallback = 'unknown'): string {
  const headers = source instanceof Headers ? source : source.headers;

  if (!(source instanceof Headers) && 'ip' in source) {
    const ip = (source as Request & { ip?: string }).ip;
    if (typeof ip === 'string' && ip.length > 0) {
      return ip;
    }
  }

  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || fallback;
  }

  const realIp = headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;

  const cfIp = headers.get('cf-connecting-ip')?.trim();
  if (cfIp) return cfIp;

  return fallback;
}

export function isHttpsRequest(request: Request): boolean {
  const forwarded = request.headers.get('x-forwarded-proto');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim().toLowerCase() === 'https';
  }
  return new URL(request.url).protocol === 'https:';
}

export function httpsRedirectUrl(request: Request): URL {
  const host =
    request.headers.get('x-forwarded-host')?.split(',')[0]?.trim() ??
    request.headers.get('host') ??
    'localhost';

  const path = new URL(request.url).pathname + new URL(request.url).search;
  return new URL(path, `https://${host}`);
}

export function contentSecurityPolicy(): string {
  const scriptSrc =
    process.env.NODE_ENV === 'production'
      ? "script-src 'self' 'unsafe-inline'"
      : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
}

export function securityHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'X-DNS-Prefetch-Control': 'off',
    'Content-Security-Policy': contentSecurityPolicy(),
  };

  if (shouldEnforceHttps()) {
    headers['Strict-Transport-Security'] =
      'max-age=63072000; includeSubDomains; preload';
  }

  return headers;
}

export function applySecurityHeaders<T extends Response>(response: T): T {
  for (const [key, value] of Object.entries(securityHeaders())) {
    response.headers.set(key, value);
  }
  return response;
}

/** Safe filename for Content-Disposition (ASCII fallback + RFC 5987). */
export function contentDispositionFilename(originalName: string): string {
  const ascii = originalName
    .replace(/[^\x20-\x7E]/g, '_')
    .replace(/["\\]/g, '_')
    .slice(0, 200) || 'download';
  const encoded = encodeURIComponent(originalName.slice(0, 200));
  return `filename="${ascii}"; filename*=UTF-8''${encoded}`;
}
