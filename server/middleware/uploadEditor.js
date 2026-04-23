const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { UPLOAD_DIR } = require('./upload');

const ALLOWED_EDITOR_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/webm',
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
]);

function fileFilter(_req, file, cb) {
  if (ALLOWED_EDITOR_MIMES.has(file.mimetype)) cb(null, true);
  else cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Type de fichier non autorisé pour l’éditeur.'));
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const safe = `editor-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, safe);
  },
});

const uploadEditor = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024, files: 1 },
  fileFilter,
});

module.exports = { uploadEditor, ALLOWED_EDITOR_MIMES };
