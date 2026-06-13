import assert from 'node:assert/strict';
import path from 'node:path';
import { describe, it } from 'node:test';
import {
  resolveStorageObjectKey,
  resolveUploadFilePath,
} from '@/shared/lib/path-safe';

describe('resolveStorageObjectKey', () => {
  it('rejects path traversal in filename', () => {
    assert.equal(resolveStorageObjectKey('startup1', '../secret.txt'), null);
    assert.equal(resolveStorageObjectKey('startup1', '..\\secret.txt'), null);
    assert.equal(resolveStorageObjectKey('startup1', 'nested/file.pdf'), null);
  });

  it('returns bucket object key for safe paths', () => {
    assert.equal(resolveStorageObjectKey('startup1', 'file.pdf'), 'startup1/file.pdf');
  });
});

describe('resolveUploadFilePath', () => {
  it('rejects path traversal in filename', () => {
    assert.equal(resolveUploadFilePath('startup1', '../secret.txt'), null);
  });

  it('resolves safe paths inside upload dir', () => {
    const result = resolveUploadFilePath('startup1', 'file.pdf');
    assert.ok(result);
    assert.ok(
      result!.startsWith(path.resolve(process.cwd(), 'uploads', 'startup1')),
    );
  });
});
