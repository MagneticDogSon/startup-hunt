import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  contentDispositionFilename,
  getClientIp,
  isHttpsRequest,
  isProtectedApiPath,
  isPublicPath,
  securityHeaders,
  shouldEnforceHttps,
} from '@/shared/lib/security';

describe('security', () => {
  it('shouldEnforceHttps is false by default', () => {
    const prev = process.env.ENFORCE_HTTPS;
    delete process.env.ENFORCE_HTTPS;
    assert.equal(shouldEnforceHttps(), false);
    process.env.ENFORCE_HTTPS = prev;
  });

  it('shouldEnforceHttps when ENFORCE_HTTPS=true', () => {
    const prev = process.env.ENFORCE_HTTPS;
    process.env.ENFORCE_HTTPS = 'true';
    assert.equal(shouldEnforceHttps(), true);
    process.env.ENFORCE_HTTPS = prev;
  });

  it('isHttpsRequest respects x-forwarded-proto', () => {
    const req = new Request('http://internal/startups', {
      headers: { 'x-forwarded-proto': 'https' },
    });
    assert.equal(isHttpsRequest(req), true);
  });

  it('isPublicPath allows landing and auth routes', () => {
    assert.equal(isPublicPath('/'), true);
    assert.equal(isPublicPath('/login'), true);
    assert.equal(isPublicPath('/register'), true);
    assert.equal(isPublicPath('/startups'), false);
  });

  it('isProtectedApiPath matches app APIs only', () => {
    assert.equal(isProtectedApiPath('/api/votes'), true);
    assert.equal(isProtectedApiPath('/api/auth/signin'), false);
  });

  it('adds HSTS and CSP when HTTPS is enforced', () => {
    const prev = process.env.ENFORCE_HTTPS;
    process.env.ENFORCE_HTTPS = 'true';
    const headers = securityHeaders();
    assert.ok(headers['Strict-Transport-Security']?.includes('max-age'));
    assert.ok(headers['Content-Security-Policy']?.includes("default-src 'self'"));
    process.env.ENFORCE_HTTPS = prev;
  });

  it('contentDispositionFilename strips unsafe characters', () => {
    const header = contentDispositionFilename('evil"\r\n.pdf');
    assert.ok(!header.includes('\r'));
    assert.ok(!header.includes('\n'));
    assert.ok(header.includes('filename*='));
  });

  it('getClientIp reads forwarded headers without ENFORCE_HTTPS', () => {
    const prev = process.env.ENFORCE_HTTPS;
    delete process.env.ENFORCE_HTTPS;
    const headers = new Headers({ 'x-forwarded-for': '203.0.113.10, 10.0.0.1' });
    assert.equal(getClientIp(headers), '203.0.113.10');
    process.env.ENFORCE_HTTPS = prev;
  });

  it('getClientIp prefers request.ip when present', () => {
    const req = new Request('http://localhost/login') as Request & { ip: string };
    req.ip = '192.0.2.44';
    assert.equal(getClientIp(req), '192.0.2.44');
  });

  it('CSP omits unsafe-eval in production', () => {
    const prevNodeEnv = process.env.NODE_ENV;
    const prevHttps = process.env.ENFORCE_HTTPS;
    process.env.NODE_ENV = 'production';
    delete process.env.ENFORCE_HTTPS;
    const csp = securityHeaders()['Content-Security-Policy'];
    assert.ok(csp?.includes("script-src 'self' 'unsafe-inline'"));
    assert.ok(!csp?.includes('unsafe-eval'));
    process.env.NODE_ENV = prevNodeEnv;
    process.env.ENFORCE_HTTPS = prevHttps;
  });
});
