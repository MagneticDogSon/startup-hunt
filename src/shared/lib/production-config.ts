/**
 * Fail fast in production when TLS / Auth.js URL is misconfigured.
 * Next.js does not terminate TLS — the reverse proxy does.
 */
export function assertProductionSecurityConfig(): void {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  if (process.env.ENFORCE_HTTPS !== 'true') {
    throw new Error(
      'ENFORCE_HTTPS must be "true" in production (HTTP→HTTPS redirect, HSTS, Secure cookies).',
    );
  }

  const authUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
  if (!authUrl) {
    throw new Error(
      'AUTH_URL is required in production (public https origin, e.g. https://app.example.com).',
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(authUrl);
  } catch {
    throw new Error(`AUTH_URL is not a valid URL: ${authUrl}`);
  }

  if (parsed.protocol !== 'https:') {
    throw new Error('AUTH_URL must use https:// in production.');
  }
}
