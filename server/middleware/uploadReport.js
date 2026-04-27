const path = require('path');
const multer = require('multer');
const { UPLOAD_DIR, ALLOWED_UPLOAD_MIMES } = require('./upload');
const { ALLOWED_EDITOR_MIMES } = require('./uploadEditor');

const ALLOWED_REPORT_EVIDENCE_MIMES = new Set([...ALLOWED_UPLOAD_MIMES, ...ALLOWED_EDITOR_MIMES]);

function reportFileFilter(_req, file, cb) {
  if (file.fieldname === 'identityDocument') {
    if (ALLOWED_UPLOAD_MIMES.has(file.mimetype)) return cb(null, true);
    return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', "Type de fichier non autorisé pour la pièce d'identité."));
  }
  if (file.fieldname === 'evidenceFiles') {
    if (ALLOWED_REPORT_EVIDENCE_MIMES.has(file.mimetype)) return cb(null, true);
    return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Type de fichier non autorisé pour les preuves.'));
  }
  return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Champ de fichier non autorisé.'));
}

const reportStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    cb(null, `report-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const uploadReport = multer({
  storage: reportStorage,
  limits: { fileSize: 50 * 1024 * 1024, files: 9 },
  fileFilter: reportFileFilter,
});

module.exports = { uploadReport, ALLOWED_REPORT_EVIDENCE_MIMES };
