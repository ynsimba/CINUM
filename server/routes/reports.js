const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const { body, validationResult } = require('express-validator');
const { Report, ABUSE_TYPES } = require('../models/Report');
const { upload } = require('../middleware/upload');
const { sendReportEmails } = require('../services/mail');

const router = express.Router();

const STATUS_PUBLIC_FR = {
  pending: 'En attente de traitement',
  reviewed: 'Examiné par le service',
  forwarded_arptc: 'Transmis à l’ARPTC (selon procédure en vigueur)',
  closed: 'Dossier clos',
};

function requireAtLeastOneAttachment(req, res, next) {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      errors: [{ msg: 'Au moins une pièce jointe est requise.', path: 'attachments' }],
    });
  }
  next();
}

async function generateUniqueReference() {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const reference = `CIN-${year}-${suffix}`;
    const exists = await Report.exists({ reference });
    if (!exists) return reference;
  }
  return null;
}

function generateAccessSecret() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const buf = crypto.randomBytes(12);
  let s = '';
  for (let i = 0; i < 10; i += 1) {
    s += chars[buf[i] % chars.length];
  }
  return s;
}

router.get('/meta', (_req, res) => {
  res.json({ abuseTypes: ABUSE_TYPES });
});

router.post(
  '/suivi',
  [
    body('reference')
      .trim()
      .notEmpty()
      .matches(/^CIN-\d{4}-[A-F0-9]{6}$/i)
      .withMessage('Référence invalide.'),
    body('secret').trim().isLength({ min: 8, max: 36 }).withMessage('Code secret invalide.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const reference = req.body.reference.trim().toUpperCase();
    try {
      const report = await Report.findOne({ reference }).select('+lookupSecretHash');
      if (!report || !report.lookupSecretHash) {
        return res.status(404).json({ error: 'Signalement introuvable ou code incorrect.' });
      }
      const ok = await bcrypt.compare(req.body.secret.trim(), report.lookupSecretHash);
      if (!ok) {
        return res.status(404).json({ error: 'Signalement introuvable ou code incorrect.' });
      }
      return res.json({
        reference: report.reference,
        status: report.status,
        statusLabel: STATUS_PUBLIC_FR[report.status] || report.status,
        abuseType: report.abuseType,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        descriptionPreview:
          report.description.length > 220
            ? `${report.description.slice(0, 220)}…`
            : report.description,
      });
    } catch {
      return res.status(500).json({ error: 'Erreur lors de la consultation.' });
    }
  }
);

router.post(
  '/',
  upload.array('attachments', 5),
  requireAtLeastOneAttachment,
  [
    body('abuseType').isIn(ABUSE_TYPES).withMessage('Type d\'abus invalide.'),
    body('description')
      .trim()
      .isLength({ min: 20, max: 600 })
      .withMessage('Description requise (20 à 600 caractères).'),
    body('contactEmail').trim().notEmpty().withMessage('Email requis.').isEmail().normalizeEmail(),
    body('contactPhone')
      .trim()
      .notEmpty()
      .withMessage('Téléphone requis.')
      .custom((value) => {
        const p = parsePhoneNumberFromString(value);
        if (!p || !p.isValid()) {
          throw new Error('Numéro de téléphone invalide.');
        }
        return true;
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const reference = await generateUniqueReference();
      if (!reference) {
        return res.status(500).json({ error: 'Impossible de créer une référence de dossier. Réessayez.' });
      }
      const accessSecret = generateAccessSecret();
      const lookupSecretHash = await bcrypt.hash(accessSecret, 10);

      const attachments = (req.files || []).map((f) => ({
        path: f.filename,
        originalName: f.originalname,
      }));
      const phoneParsed = parsePhoneNumberFromString(String(req.body.contactPhone).trim());
      const report = await Report.create({
        abuseType: req.body.abuseType,
        description: req.body.description,
        contactEmail: req.body.contactEmail || '',
        contactPhone: phoneParsed ? phoneParsed.format('E.164') : '',
        reference,
        lookupSecretHash,
        attachments,
      });

      sendReportEmails({
        userEmail: report.contactEmail,
        reference: report.reference,
        accessSecret,
        abuseType: report.abuseType,
        siteUrl: process.env.PUBLIC_SITE_URL || '',
      }).catch(() => {});

      return res.status(201).json({
        id: report._id,
        reference: report.reference,
        accessSecret,
        message:
          'Votre signalement a été enregistré. Conservez la référence et le code secret pour consulter l’état du dossier.',
      });
    } catch (e) {
      if (e.code === 11000) {
        return res.status(409).json({ error: 'Conflit de référence. Réessayez dans un instant.' });
      }
      return res.status(500).json({ error: 'Erreur lors de l’enregistrement du signalement.' });
    }
  }
);

module.exports = router;
