const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const { body, validationResult } = require('express-validator');
const reportService = require('../services/reportService');
const { ABUSE_TYPES, IDENTITY_DOC_TYPES } = require('../constants/reports');
const path = require('path');
const { upload, UPLOAD_DIR, ALLOWED_UPLOAD_MIMES } = require('../middleware/upload');
const { validateUploadedFileOrRemove } = require('../lib/validateUploadedFile');
const { sendReportEmails } = require('../services/mail');

const router = express.Router();

function isAnonymousReport(req) {
  const v = String(req.body?.isAnonymous || '').trim().toLowerCase();
  return v === 'true' || v === '1' || v === 'yes' || v === 'on';
}

const STATUS_PUBLIC_FR = {
  pending: 'En attente de traitement',
  reviewed: 'Examiné par le service',
  forwarded_arptc: 'Transmis à l’ARPTC (selon procédure en vigueur)',
  closed: 'Dossier clos',
};

function requireIdentityFileUnlessAnonymous(req, res, next) {
  if (isAnonymousReport(req)) return next();
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
  requireIdentityFileUnlessAnonymous,
  [
    body('isAnonymous')
      .optional()
      .custom((value) => ['true', 'false', '1', '0', 'yes', 'no', 'on', 'off'].includes(String(value).toLowerCase()))
      .withMessage('Indicateur isAnonymous invalide.'),
    body('lastName')
      .optional({ values: 'falsy' })
      .trim()
      .custom((value, { req }) => {
        if (isAnonymousReport(req)) return true;
        if (!value || value.length < 2 || value.length > 120) {
          throw new Error('Nom requis (2 à 120 caractères).');
        }
        return true;
      }),
    body('postName')
      .optional({ values: 'falsy' })
      .trim()
      .custom((value, { req }) => {
        if (isAnonymousReport(req)) return true;
        if (!value || value.length < 1 || value.length > 120) {
          throw new Error('Postnom requis (ou « N/A »).');
        }
        return true;
      }),
    body('firstName')
      .optional({ values: 'falsy' })
      .trim()
      .custom((value, { req }) => {
        if (isAnonymousReport(req)) return true;
        if (!value || value.length < 2 || value.length > 120) {
          throw new Error('Prénom requis (2 à 120 caractères).');
        }
        return true;
      }),
    body('birthPlace')
      .optional({ values: 'falsy' })
      .trim()
      .custom((value, { req }) => {
        if (isAnonymousReport(req)) return true;
        if (!value || value.length < 2 || value.length > 200) {
          throw new Error('Lieu de naissance requis.');
        }
        return true;
      }),
    body('birthDate')
      .optional({ values: 'falsy' })
      .trim()
      .custom((v, { req }) => {
        if (isAnonymousReport(req)) return true;
        if (!v) throw new Error('Date de naissance requise.');
        const d = new Date(v);
        if (Number.isNaN(d.getTime())) throw new Error('Date de naissance invalide.');
        return true;
      }),
    body('maritalStatus')
      .optional({ values: 'falsy' })
      .trim()
      .custom((value, { req }) => {
        if (isAnonymousReport(req)) return true;
        if (!value || value.length < 2 || value.length > 80) {
          throw new Error('État civil requis.');
        }
        return true;
      }),
    body('address')
      .optional({ values: 'falsy' })
      .trim()
      .custom((value, { req }) => {
        if (isAnonymousReport(req)) return true;
        if (!value || value.length < 5 || value.length > 4000) {
          throw new Error('Adresse requise (5 à 4000 caractères).');
        }
        return true;
      }),
    body('identityDocType')
      .optional({ values: 'falsy' })
      .custom((value, { req }) => {
        if (isAnonymousReport(req)) return true;
        if (!IDENTITY_DOC_TYPES.includes(value)) throw new Error('Type de pièce d’identité invalide.');
        return true;
      }),
    body('abuseType').isIn(ABUSE_TYPES).withMessage("Type d'abus invalide."),
    body('description')
      .trim()
      .isLength({ min: 20, max: 600 })
      .withMessage('Description requise (20 à 600 caractères).'),
    body('contactEmail')
      .optional({ values: 'falsy' })
      .trim()
      .custom((value, { req }) => {
        if (isAnonymousReport(req) && !value) return true;
        if (!value) throw new Error('Email requis.');
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (!ok) throw new Error('Email invalide.');
        return true;
      }),
    body('contactPhone')
      .optional({ values: 'falsy' })
      .trim()
      .custom((value, { req }) => {
        if (isAnonymousReport(req) && !value) return true;
        if (!value) throw new Error('Téléphone requis.');
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
    const anonymous = isAnonymousReport(req);
    if (!anonymous && req.file) {
      const identityPath = path.join(UPLOAD_DIR, req.file.filename);
      const fileCheck = await validateUploadedFileOrRemove(identityPath, ALLOWED_UPLOAD_MIMES);
      if (!fileCheck.ok) {
        return res.status(400).json({
          error:
            'Le fichier fourni ne correspond pas à un type autorisé (contenu invalide ou pièce d’identité illisible).',
        });
      }
    }
    try {
      const reference = await reportService.generateUniqueReference();
      if (!reference) {
        return res.status(500).json({ error: 'Impossible de créer une référence de dossier. Réessayez.' });
      }
      const accessSecret = generateAccessSecret();
      const lookupSecretHash = await bcrypt.hash(accessSecret, 10);

      const phoneRaw = String(req.body.contactPhone || '').trim();
      const phoneParsed = phoneRaw ? parsePhoneNumberFromString(phoneRaw) : null;
      const birthDateRaw = String(req.body.birthDate || '').trim();
      const birthDate = birthDateRaw ? new Date(birthDateRaw) : null;
      if (!anonymous && (!birthDate || Number.isNaN(birthDate.getTime()))) {
        return res.status(400).json({ errors: [{ msg: 'Date de naissance invalide.', path: 'birthDate' }] });
      }

      const report = await reportService.create({
        lastName: anonymous ? '' : req.body.lastName.trim(),
        postName: anonymous ? '' : req.body.postName.trim(),
        firstName: anonymous ? '' : req.body.firstName.trim(),
        birthPlace: anonymous ? '' : req.body.birthPlace.trim(),
        birthDate,
        maritalStatus: anonymous ? '' : req.body.maritalStatus.trim(),
        address: anonymous ? '' : req.body.address.trim(),
        identityDocType: anonymous ? '' : req.body.identityDocType,
        identityDocPath: anonymous || !req.file ? '' : req.file.filename,
        identityDocOriginalName: anonymous || !req.file ? '' : req.file.originalname || '',
        abuseType: req.body.abuseType,
        description: req.body.description,
        contactEmail: anonymous ? String(req.body.contactEmail || '').trim() : req.body.contactEmail || '',
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
