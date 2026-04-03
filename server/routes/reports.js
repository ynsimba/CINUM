const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const { body, validationResult } = require('express-validator');
const reportService = require('../services/reportService');
const { ABUSE_TYPES, IDENTITY_DOC_TYPES } = require('../constants/reports');
const { upload } = require('../middleware/upload');
const { sendReportEmails } = require('../services/mail');

const router = express.Router();

const STATUS_PUBLIC_FR = {
  pending: 'En attente de traitement',
  reviewed: 'Examiné par le service',
  forwarded_arptc: 'Transmis à l’ARPTC (selon procédure en vigueur)',
  closed: 'Dossier clos',
};

function requireIdentityFile(req, res, next) {
  if (!req.file) {
    return res.status(400).json({
      errors: [{ msg: 'Une copie de pièce d’identité est requise.', path: 'identityDocument' }],
    });
  }
  next();
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
  res.json({ abuseTypes: ABUSE_TYPES, identityDocTypes: IDENTITY_DOC_TYPES });
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
      const report = await reportService.findByReferenceForLookup(reference);
      if (!report || !report.lookupSecretHash) {
        return res.status(404).json({ error: 'Signalement introuvable ou code incorrect.' });
      }
      const ok = await bcrypt.compare(req.body.secret.trim(), report.lookupSecretHash);
      if (!ok) {
        return res.status(404).json({ error: 'Signalement introuvable ou code incorrect.' });
      }
      const raw = Array.isArray(report.attachments) ? report.attachments : [];
      const attachments = raw.map((a) => ({
        url: `/uploads/${encodeURIComponent(a.path)}`,
        originalName: a.originalName || a.path,
      }));

      return res.json({
        reference: report.reference,
        status: report.status,
        statusLabel: STATUS_PUBLIC_FR[report.status] || report.status,
        abuseType: report.abuseType,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        appointmentAt: report.appointmentAt,
        appointmentNote: report.appointmentNote || '',
        descriptionPreview:
          report.description.length > 220
            ? `${report.description.slice(0, 220)}…`
            : report.description,
        attachments,
        _id: report.id,
      });
    } catch {
      return res.status(500).json({ error: 'Erreur lors de la consultation.' });
    }
  }
);

router.post(
  '/',
  upload.single('identityDocument'),
  requireIdentityFile,
  [
    body('lastName').trim().isLength({ min: 2, max: 120 }).withMessage('Nom requis (2 à 120 caractères).'),
    body('postName').trim().isLength({ min: 1, max: 120 }).withMessage('Postnom requis (ou « N/A »).'),
    body('firstName').trim().isLength({ min: 2, max: 120 }).withMessage('Prénom requis (2 à 120 caractères).'),
    body('birthPlace').trim().isLength({ min: 2, max: 200 }).withMessage('Lieu de naissance requis.'),
    body('birthDate')
      .trim()
      .notEmpty()
      .withMessage('Date de naissance requise.')
      .custom((v) => {
        const d = new Date(v);
        if (Number.isNaN(d.getTime())) throw new Error('Date de naissance invalide.');
        return true;
      }),
    body('maritalStatus').trim().isLength({ min: 2, max: 80 }).withMessage('État civil requis.'),
    body('address').trim().isLength({ min: 5, max: 4000 }).withMessage('Adresse requise (5 à 4000 caractères).'),
    body('identityDocType')
      .isIn(IDENTITY_DOC_TYPES)
      .withMessage('Type de pièce d’identité invalide.'),
    body('abuseType').isIn(ABUSE_TYPES).withMessage("Type d'abus invalide."),
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
      const reference = await reportService.generateUniqueReference();
      if (!reference) {
        return res.status(500).json({ error: 'Impossible de créer une référence de dossier. Réessayez.' });
      }
      const accessSecret = generateAccessSecret();
      const lookupSecretHash = await bcrypt.hash(accessSecret, 10);

      const phoneParsed = parsePhoneNumberFromString(String(req.body.contactPhone).trim());
      const birthDate = new Date(req.body.birthDate);
      if (Number.isNaN(birthDate.getTime())) {
        return res.status(400).json({ errors: [{ msg: 'Date de naissance invalide.', path: 'birthDate' }] });
      }

      const report = await reportService.create({
        lastName: req.body.lastName.trim(),
        postName: req.body.postName.trim(),
        firstName: req.body.firstName.trim(),
        birthPlace: req.body.birthPlace.trim(),
        birthDate,
        maritalStatus: req.body.maritalStatus.trim(),
        address: req.body.address.trim(),
        identityDocType: req.body.identityDocType,
        identityDocPath: req.file.filename,
        identityDocOriginalName: req.file.originalname || '',
        abuseType: req.body.abuseType,
        description: req.body.description,
        contactEmail: req.body.contactEmail || '',
        contactPhone: phoneParsed ? phoneParsed.format('E.164') : '',
        reference,
        lookupSecretHash,
        attachments: [],
      });

      sendReportEmails({
        userEmail: report.contactEmail,
        reference: report.reference,
        accessSecret,
        abuseType: report.abuseType,
        siteUrl: process.env.PUBLIC_SITE_URL || '',
      }).catch(() => {});

      return res.status(201).json({
        id: report.id,
        _id: report.id,
        reference: report.reference,
        accessSecret,
        message:
          'Votre signalement a été enregistré. Conservez la référence et le code secret pour consulter l’état du dossier.',
      });
    } catch (e) {
      if (e.code === 'P2002') {
        return res.status(409).json({ error: 'Conflit de référence. Réessayez dans un instant.' });
      }
      return res.status(500).json({ error: 'Erreur lors de l’enregistrement du signalement.' });
    }
  }
);

module.exports = router;
