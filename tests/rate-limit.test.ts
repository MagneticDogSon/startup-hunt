import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { rateLimit } from '@/shared/lib/rate-limit';

describe('rateLimit', () => {
  it('allows requests under the limit', () => {
    const key = `test-allow-${Date.now()}`;
    assert.equal(rateLimit(key, 3, 60_000).ok, true);
    assert.equal(rateLimit(key, 3, 60_000).ok, true);
    assert.equal(rateLimit(key, 3, 60_000).ok, true);
  });

  it('blocks requests over the limit', () => {
    const key = `test-block-${Date.now()}`;
    for (let i = 0; i < 2; i++) {
      assert.equal(rateLimit(key, 2, 60_000).ok, true);
    }
    const blocked = rateLimit(key, 2, 60_000);
    assert.equal(blocked.ok, false);
    if (!blocked.ok) {
      assert.ok(blocked.retryAfterSec >= 1);
    }
  });
});
