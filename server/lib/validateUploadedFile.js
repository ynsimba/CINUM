const fs = require('fs');
const fsp = require('fs').promises;

const OLE_MAGIC = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);

function readHeadSync(filePath, len = 4100) {
  const fd = fs.openSync(filePath, 'r');
  try {
    const buf = Buffer.alloc(len);
    const n = fs.readSync(fd, buf, 0, len, 0);
    return buf.subarray(0, n);
  } finally {
    fs.closeSync(fd);
  }
}

/**
 * Détection minimale si file-type ne renvoie rien (fichier tronqué, cas limites).
 */
function manualMimeFromBuffer(buf) {
  if (!buf || buf.length < 4) return null;
  if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) return 'application/pdf';
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'image/png';
  if (buf.length >= 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    return 'image/webp';
  }
  if (buf.length >= 6) {
    const g = buf.toString('ascii', 0, 6);
    if (g === 'GIF87a' || g === 'GIF89a') return 'image/gif';
  }
  if (buf.length >= 8 && buf.subarray(0, 8).equals(OLE_MAGIC)) return 'application/msword';
  return null;
}

function mimeMatchesAllowed(detected, allowedSet) {
  if (allowedSet.has(detected)) return true;
  if (detected === 'audio/mpeg' && allowedSet.has('audio/mp3')) return true;
  if (detected === 'video/mp4' && allowedSet.has('video/quicktime')) return true;
  if (detected === 'application/x-cfb' && allowedSet.has('application/msword')) return true;
  if (
    detected === 'application/ogg' &&
    (allowedSet.has('video/ogg') || allowedSet.has('audio/ogg'))
  ) {
    return true;
  }
  return false;
}

/**
 * Vérifie le contenu réel (magic bytes) par rapport aux types autorisés.
 * En cas d’échec, supprime le fichier sur disque.
 * @param {string} filePath
 * @param {Set<string>} allowedSet
 * @returns {Promise<{ ok: true } | { ok: false, reason: string }>}
 */
async function validateUploadedFileOrRemove(filePath, allowedSet) {
  let detected = null;
  try {
    const { fileTypeFromFile } = await import('file-type');
    const ft = await fileTypeFromFile(filePath);
    if (ft) detected = ft.mime;
  } catch {
    // ignore
  }
  if (!detected) {
    try {
      const buf = readHeadSync(filePath);
      detected = manualMimeFromBuffer(buf);
    } catch {
      detected = null;
    }
  }
  if (!detected || !mimeMatchesAllowed(detected, allowedSet)) {
    try {
      await fsp.unlink(filePath);
    } catch {
      // ignore
    }
    return { ok: false, reason: detected ? 'mime' : 'unknown' };
  }
  return { ok: true };
}

module.exports = {
  validateUploadedFileOrRemove,
  manualMimeFromBuffer,
  mimeMatchesAllowed,
};
