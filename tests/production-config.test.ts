import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { assertProductionSecurityConfig } from '@/shared/lib/production-config';

describe('assertProductionSecurityConfig', () => {
  it('no-op outside production', () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    assert.doesNotThrow(() => assertProductionSecurityConfig());
    process.env.NODE_ENV = prev;
  });

  it('requires ENFORCE_HTTPS and https AUTH_URL in production', () => {
    const prev = {
      nodeEnv: process.env.NODE_ENV,
      enforce: process.env.ENFORCE_HTTPS,
      authUrl: process.env.AUTH_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL,
    };

    process.env.NODE_ENV = 'production';
    delete process.env.AUTH_URL;
    delete process.env.NEXTAUTH_URL;
    delete process.env.ENFORCE_HTTPS;

    assert.throws(
      () => assertProductionSecurityConfig(),
      /ENFORCE_HTTPS/,
    );

    process.env.ENFORCE_HTTPS = 'true';
    assert.throws(
      () => assertProductionSecurityConfig(),
      /AUTH_URL is required/,
    );

    process.env.AUTH_URL = 'http://insecure.example';
    assert.throws(
      () => assertProductionSecurityConfig(),
      /must use https/,
    );

    process.env.AUTH_URL = 'https://app.example';
    assert.doesNotThrow(() => assertProductionSecurityConfig());

    process.env.NODE_ENV = prev.nodeEnv;
    process.env.ENFORCE_HTTPS = prev.enforce;
    process.env.AUTH_URL = prev.authUrl;
    process.env.NEXTAUTH_URL = prev.nextAuthUrl;
  });
});
