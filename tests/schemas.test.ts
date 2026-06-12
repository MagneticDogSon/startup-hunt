import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { VoteSchema } from '@/shared/lib/schemas';

describe('VoteSchema', () => {
  it('accepts +1 and -1', () => {
    assert.equal(
      VoteSchema.safeParse({ startupId: 'abc', value: 1 }).success,
      true,
    );
    assert.equal(
      VoteSchema.safeParse({ startupId: 'abc', value: -1 }).success,
      true,
    );
  });

  it('rejects other vote values', () => {
    assert.equal(
      VoteSchema.safeParse({ startupId: 'abc', value: 0 }).success,
      false,
    );
    assert.equal(
      VoteSchema.safeParse({ startupId: 'abc', value: 2 }).success,
      false,
    );
  });
});
