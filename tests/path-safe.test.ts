import assert from 'node:assert/strict';
import path from 'node:path';
import { describe, it } from 'node:test';
import { resolveUploadFilePath } from '@/shared/lib/path-safe';

describe('resolveUploadFilePath', () => {
  it('rejects path traversal in filename', () => {
    assert.equal(resolveUploadFilePath('startup1', '../secret.txt'), null);
    assert.equal(resolveUploadFilePath('startup1', '..\\secret.txt'), null);
  });

  it('resolves safe paths inside upload dir', () => {
    const result = resolveUploadFilePath('startup1', 'file.pdf');
    assert.ok(result);
    assert.ok(
      result!.startsWith(path.resolve(process.cwd(), 'uploads', 'startup1')),
    );
  });
});
