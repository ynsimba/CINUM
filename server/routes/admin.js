const express = require('express');
const { body, param, validationResult } = require('express-validator');
const articleService = require('../services/articleService');
const newsService = require('../services/newsService');
const resourceService = require('../services/resourceService');
const lawService = require('../services/lawService');
const reportService = require('../services/reportService');
const contactService = require('../services/contactService');
const { STATUSES } = require('../constants/reports');
const { requireAuth, requireRole } = require('../middleware/auth');
const { upload, UPLOAD_DIR } = require('../middleware/upload');
const { uploadEditor } = require('../middleware/uploadEditor');
const { sanitizeEditorHtml, plainTextLength } = require('../lib/sanitizeContent');
const { toClientDoc } = require('../lib/serialize');
const { sendReportAppointmentEmail } = require('../services/mail');
const { isAdminAuthDisabled } = require('../lib/adminAuthBypass');
const path = require('path');
const fs = require('fs');

const router = express.Router();

function validateRichContent(value) {
  if (value === undefined || value === null) return true;
  if (plainTextLength(String(value)) < 10) {
    throw new Error('Le contenu doit contenir au moins 10 caractères de texte.');
  }
  return true;
}

const bypass = isAdminAuthDisabled();
/** Routes réservées à l’admin : contournées si `DISABLE_ADMIN_AUTH` */
const requireAdminRole = bypass ? (_req, _res, next) => next() : requireRole('admin');

if (!bypass) {
  router.use(requireAuth);
  router.use(requireRole('admin', 'moderator'));
}

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 120);
}

router.get('/dashboard', async (_req, res) => {
  try {
    const [articles, newsCount, reportsPending, resources, contactMessages] = await Promise.all([
      articleService.count(),
      newsService.count(),
      reportService.countPending(),
      resourceService.count(),
      contactService.count(),
    ]);
    return res.json({
      counts: {
        articles,
        news: newsCount,
        reportsPending,
        resources,
        contactMessages,
      },
    });
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

/** Messages du formulaire Contact (site public) */
router.get('/contact-messages', async (_req, res) => {
  try {
    const rows = await contactService.listAdmin(200);
    const items = rows.map(toClientDoc);
    return res.json({ items });
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.delete(
  '/contact-messages/:id',
  requireAdminRole,
  [param('id').isString().isLength({ min: 10, max: 40 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const ok = await contactService.deleteById(req.params.id);
      if (!ok) return res.status(404).json({ error: 'Introuvable.' });
      return res.json({ ok: true });
    } catch {
      return res.status(400).json({ error: 'Suppression impossible.' });
    }
  }
);

/** Upload médias pour l’éditeur riche (images, audio, vidéo) */
router.post(
  '/editor-media',
  (req, res, next) => {
    uploadEditor.single('file')(req, res, (err) => {
      if (!err) return next();
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Fichier trop volumineux (max 50 Mo pour les médias de l’éditeur).' });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ error: 'Type de fichier non autorisé pour l’éditeur.' });
      }
      return next(err);
    });
  },
  async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Fichier requis.' });
    return res.json({ url: `/uploads/${req.file.filename}` });
  }
);

/** Articles */
router.get('/articles', async (_req, res) => {
  try {
    const rows = await articleService.listAdmin();
    const items = rows.map(toClientDoc);
    return res.json({ items });
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post(
  '/articles',
  [
    body('title').trim().isLength({ min: 3, max: 200 }),
    body('content').custom(validateRichContent),
    body('excerpt').optional().trim(),
    body('category').optional().trim(),
    body('published').optional().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    let slug = slugify(req.body.title);
    const exists = await articleService.findOneBySlug(slug);
    if (exists) slug = `${slug}-${Date.now()}`;
    try {
      const doc = await articleService.create({
        title: req.body.title,
        slug,
        excerpt: req.body.excerpt || '',
        content: sanitizeEditorHtml(req.body.content),
        category: req.body.category || 'general',
        published: Boolean(req.body.published),
        authorId: req.userId || null,
      });
      return res.status(201).json(toClientDoc(doc));
    } catch {
      return res.status(500).json({ error: 'Création impossible.' });
    }
  }
);

router.patch('/articles/:id', async (req, res) => {
  try {
    if (req.body.content !== undefined) {
      if (plainTextLength(String(req.body.content)) < 10) {
        return res.status(400).json({ error: 'Le contenu doit contenir au moins 10 caractères de texte.' });
      }
    }
    const u = await articleService.updateById(req.params.id, {
      ...(req.body.title && { title: req.body.title }),
      ...(req.body.content !== undefined && { content: sanitizeEditorHtml(req.body.content) }),
      ...(req.body.excerpt !== undefined && { excerpt: req.body.excerpt }),
      ...(req.body.category && { category: req.body.category }),
      ...(req.body.published !== undefined && { published: req.body.published }),
    });
    if (!u) return res.status(404).json({ error: 'Introuvable.' });
    return res.json(toClientDoc(u));
  } catch {
    return res.status(400).json({ error: 'Mise à jour impossible.' });
  }
});

router.delete('/articles/:id', requireAdminRole, async (req, res) => {
  try {
    const r = await articleService.deleteById(req.params.id);
    if (!r) return res.status(404).json({ error: 'Introuvable.' });
    return res.json({ ok: true });
  } catch {
    return res.status(400).json({ error: 'Suppression impossible.' });
  }
});

/** News */
router.get('/news', async (_req, res) => {
  try {
    const rows = await newsService.listAdmin();
    const items = rows.map(toClientDoc);
    return res.json({ items });
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post(
  '/news',
  [
    body('title').trim().isLength({ min: 3, max: 200 }),
    body('content').custom(validateRichContent),
    body('excerpt').optional().trim(),
    body('coverImageUrl').optional().trim().isLength({ max: 2000 }),
    body('alert').optional().isBoolean(),
    body('campaign').optional().isBoolean(),
    body('published').optional().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const doc = await newsService.create({
        title: req.body.title,
        excerpt: req.body.excerpt || '',
        content: sanitizeEditorHtml(req.body.content),
        coverImageUrl: String(req.body.coverImageUrl || '').trim().slice(0, 2000),
        alert: Boolean(req.body.alert),
        campaign: Boolean(req.body.campaign),
        published: req.body.published !== false,
      });
      return res.status(201).json(toClientDoc(doc));
    } catch {
      return res.status(500).json({ error: 'Création impossible.' });
    }
  }
);

router.patch('/news/:id', async (req, res) => {
  try {
    if (req.body == null || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Corps de requête JSON attendu.' });
    }
    if (req.body.content !== undefined) {
      if (plainTextLength(String(req.body.content)) < 10) {
        return res.status(400).json({ error: 'Le contenu doit contenir au moins 10 caractères de texte.' });
      }
    }
    const allowed = ['title', 'excerpt', 'content', 'coverImageUrl', 'alert', 'campaign', 'published'];
    const update = {};
    for (const k of allowed) {
      if (req.body[k] === undefined) continue;
      if (k === 'content') update[k] = sanitizeEditorHtml(req.body.content);
      else if (k === 'coverImageUrl') update[k] = String(req.body.coverImageUrl || '').trim().slice(0, 2000);
      else update[k] = req.body[k];
    }
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: 'Aucun champ à mettre à jour.' });
    }
    const u = await newsService.updateById(req.params.id, update);
    if (!u) return res.status(404).json({ error: 'Introuvable.' });
    return res.json(toClientDoc(u));
  } catch (e) {
    console.error('[PATCH /api/admin/news/:id]', e?.message || e);
    return res.status(400).json({
      error:
        process.env.NODE_ENV !== 'production' && e?.message
          ? `Mise à jour impossible : ${e.message}`
          : 'Mise à jour impossible. Vérifiez que la base est à jour (migration Prisma).',
    });
  }
});

router.delete('/news/:id', requireAdminRole, async (req, res) => {
  try {
    const r = await newsService.deleteById(req.params.id);
    if (!r) return res.status(404).json({ error: 'Introuvable.' });
    return res.json({ ok: true });
  } catch {
    return res.status(400).json({ error: 'Suppression impossible.' });
  }
});

/** Resources */
router.get('/resources', async (_req, res) => {
  try {
    const rows = await resourceService.listAdmin();
    const items = rows.map(toClientDoc);
    return res.json({ items });
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post(
  '/resources/upload',
  upload.single('file'),
  [body('title').trim().isLength({ min: 2, max: 200 }), body('description').optional().trim(), body('category').optional().trim()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    if (!req.file) return res.status(400).json({ error: 'Fichier requis.' });
    try {
      const publicPath = `/uploads/${req.file.filename}`;
      const doc = await resourceService.create({
        title: req.body.title,
        description: req.body.description || '',
        fileUrl: publicPath,
        fileName: req.file.originalname,
        category: req.body.category || 'guide',
        published: true,
      });
      return res.status(201).json(toClientDoc(doc));
    } catch {
      return res.status(500).json({ error: 'Enregistrement impossible.' });
    }
  }
);

router.delete('/resources/:id', requireAdminRole, async (req, res) => {
  try {
    const r = await resourceService.findById(req.params.id);
    if (!r) return res.status(404).json({ error: 'Introuvable.' });
    const fp = path.join(UPLOAD_DIR, path.basename(r.fileUrl));
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
    await resourceService.deleteById(req.params.id);
    return res.json({ ok: true });
  } catch {
    return res.status(400).json({ error: 'Suppression impossible.' });
  }
});

/** Laws */
router.get('/laws', async (_req, res) => {
  try {
    const rows = await lawService.listAdmin();
    const items = rows.map(toClientDoc);
    return res.json({ items });
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post(
  '/laws',
  requireAdminRole,
  [
    body('title').trim().isLength({ min: 3, max: 200 }),
    body('reference').trim().isLength({ min: 3, max: 200 }),
    body('summary').trim().isLength({ min: 10 }),
    body('fullTextUrl').optional({ checkFalsy: true }).trim().isURL(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const doc = await lawService.create({
        title: req.body.title,
        reference: req.body.reference,
        summary: req.body.summary,
        fullTextUrl: req.body.fullTextUrl || '',
        published: true,
      });
      return res.status(201).json(toClientDoc(doc));
    } catch {
      return res.status(500).json({ error: 'Création impossible.' });
    }
  }
);

router.delete('/laws/:id', requireAdminRole, async (req, res) => {
  try {
    const ok = await lawService.deleteById(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Introuvable.' });
    return res.json({ ok: true });
  } catch {
    return res.status(400).json({ error: 'Suppression impossible.' });
  }
});

/** Reports */
router.get('/reports', async (_req, res) => {
  try {
    const rows = await reportService.listAdmin();
    const items = rows.map(toClientDoc);
    return res.json({ items });
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.patch(
  '/reports/:id',
  [
    param('id').isString().isLength({ min: 10, max: 40 }),
    body('status').optional().isIn(STATUSES),
    body('internalNote').optional().trim(),
    body('appointmentAt').custom((value) => {
      if (value === undefined) return true;
      if (value === null || value === '') return true;
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) throw new Error('Date de rendez-vous invalide.');
      return true;
    }),
    body('appointmentNote').optional().isString().isLength({ max: 4000 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const before = await reportService.findById(req.params.id);
      if (!before) return res.status(404).json({ error: 'Introuvable.' });

      const data = {};
      if (req.body.status) data.status = req.body.status;
      if (req.body.internalNote !== undefined) data.internalNote = req.body.internalNote;
      if (req.body.appointmentAt !== undefined) {
        data.appointmentAt =
          req.body.appointmentAt === null || req.body.appointmentAt === ''
            ? null
            : new Date(req.body.appointmentAt);
      }
      if (req.body.appointmentNote !== undefined) {
        data.appointmentNote = String(req.body.appointmentNote || '').trim();
      }

      if (Object.keys(data).length === 0) {
        return res.json(toClientDoc(before));
      }

      const prevApptMs = before.appointmentAt ? new Date(before.appointmentAt).getTime() : null;
      const u = await reportService.updateById(req.params.id, data);
      if (!u) return res.status(404).json({ error: 'Introuvable.' });

      const nextApptMs = u.appointmentAt ? new Date(u.appointmentAt).getTime() : null;
      if (
        u.contactEmail &&
        nextApptMs !== null &&
        nextApptMs !== prevApptMs
      ) {
        await sendReportAppointmentEmail({
          userEmail: u.contactEmail,
          reference: u.reference,
          appointmentAt: u.appointmentAt,
          appointmentNote: u.appointmentNote,
          siteUrl: process.env.PUBLIC_SITE_URL,
        });
      }

      return res.json(toClientDoc(u));
    } catch {
      return res.status(400).json({ error: 'Mise à jour impossible.' });
    }
  }
);

router.delete('/reports/:id', requireAdminRole, async (req, res) => {
  try {
    const report = await reportService.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Introuvable.' });
    if (report.identityDocPath) {
      const idSafe = path.basename(report.identityDocPath);
      if (idSafe && !idSafe.includes('..')) {
        const idFp = path.join(UPLOAD_DIR, idSafe);
        if (fs.existsSync(idFp)) {
          try {
            fs.unlinkSync(idFp);
          } catch {
            /* ignore */
          }
        }
      }
    }
    const attachments = Array.isArray(report.attachments) ? report.attachments : [];
    for (const a of attachments) {
      if (a && typeof a.path === 'string' && a.path) {
        const safe = path.basename(a.path);
        if (!safe || safe.includes('..')) continue;
        const fp = path.join(UPLOAD_DIR, safe);
        if (fs.existsSync(fp)) {
          try {
            fs.unlinkSync(fp);
          } catch {
            /* fichier verrouillé ou autre — on continue la suppression du dossier */
          }
        }
      }
    }
    const ok = await reportService.deleteById(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Introuvable.' });
    return res.json({ ok: true });
  } catch {
    return res.status(400).json({ error: 'Suppression impossible.' });
  }
});

module.exports = router;
