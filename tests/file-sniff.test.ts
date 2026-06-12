import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  assertAllowedFileContent,
  detectMimeFromBuffer,
} from '@/shared/lib/file-sniff';

describe('file-sniff', () => {
  it('detects PDF', () => {
    const buf = Buffer.from('%PDF-1.4\n');
    assert.equal(detectMimeFromBuffer(buf), 'application/pdf');
  });

  it('detects PNG', () => {
    const buf = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]);
    assert.equal(detectMimeFromBuffer(buf), 'image/png');
  });

  it('detects JPEG', () => {
    const buf = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);
    assert.equal(detectMimeFromBuffer(buf), 'image/jpeg');
  });

  it('rejects spoofed MIME when content does not match', () => {
    const buf = Buffer.from('%PDF-1.4\n');
    assert.throws(
      () => assertAllowedFileContent(buf, 'image/png', 'evil.pdf'),
      /не соответствует/,
    );
  });

  it('accepts matching PDF content', () => {
    const buf = Buffer.from('%PDF-1.4\n');
    assert.equal(
      assertAllowedFileContent(buf, 'application/pdf', 'doc.pdf'),
      'application/pdf',
    );
  });
});
