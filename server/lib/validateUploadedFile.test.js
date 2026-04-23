const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { manualMimeFromBuffer, mimeMatchesAllowed } = require('./validateUploadedFile');

test('manualMimeFromBuffer détecte PDF et JPEG', () => {
  const pdf = Buffer.from('%PDF-1.4\n');
  assert.strictEqual(manualMimeFromBuffer(pdf), 'application/pdf');
  const jpg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00]);
  assert.strictEqual(manualMimeFromBuffer(jpg), 'image/jpeg');
});

test('mimeMatchesAllowed accepte alias audio/mpeg ↔ audio/mp3', () => {
  const s = new Set(['audio/mp3']);
  assert.strictEqual(mimeMatchesAllowed('audio/mpeg', s), true);
});

test('mimeMatchesAllowed refuse un type non listé', () => {
  const s = new Set(['image/png']);
  assert.strictEqual(mimeMatchesAllowed('application/x-msdownload', s), false);
});

test('validateUploadedFileOrRemove accepte un PNG réel', async () => {
  const { validateUploadedFileOrRemove } = require('./validateUploadedFile');
  const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'vup-'));
  const fp = path.join(dir, 'x.png');
  const png = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  ]);
  await fs.promises.writeFile(fp, png);
  const allowed = new Set(['image/png']);
  const r = await validateUploadedFileOrRemove(fp, allowed);
  assert.strictEqual(r.ok, true);
  assert.strictEqual(fs.existsSync(fp), true);
  await fs.promises.rm(dir, { recursive: true });
});
