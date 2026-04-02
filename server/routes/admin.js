const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Article = require('../models/Article');
const News = require('../models/News');
const Resource = require('../models/Resource');
const LawReference = require('../models/LawReference');
const { Report, STATUSES } = require('../models/Report');
const { requireAuth, requireRole } = require('../middleware/auth');
const { upload, UPLOAD_DIR } = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.use(requireAuth);
router.use(requireRole('admin', 'moderator'));

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
    const [articles, newsCount, reportsPending, resources] = await Promise.all([
      Article.countDocuments(),
      News.countDocuments(),
      Report.countDocuments({ status: 'pending' }),
      Resource.countDocuments(),
    ]);
    return res.json({
      counts: {
        articles,
        news: newsCount,
        reportsPending,
        resources,
      },
    });
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

/** Articles */
router.get('/articles', async (_req, res) => {
  try {
    const items = await Article.find().sort({ updatedAt: -1 }).limit(200).populate('author', 'name email').lean();
    return res.json({ items });
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post(
  '/articles',
  [
    body('title').trim().isLength({ min: 3, max: 200 }),
    body('content').trim().isLength({ min: 10 }),
    body('excerpt').optional().trim(),
    body('category').optional().trim(),
    body('published').optional().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    let slug = slugify(req.body.title);
    const exists = await Article.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now()}`;
    try {
      const doc = await Article.create({
        title: req.body.title,
        slug,
        excerpt: req.body.excerpt || '',
        content: req.body.content,
        category: req.body.category || 'general',
        published: Boolean(req.body.published),
        author: req.userId,
      });
      return res.status(201).json(doc);
    } catch {
      return res.status(500).json({ error: 'Création impossible.' });
    }
  }
);

router.patch('/articles/:id', async (req, res) => {
  try {
    const u = await Article.findByIdAndUpdate(
      req.params.id,
      {
        ...(req.body.title && { title: req.body.title }),
        ...(req.body.content && { content: req.body.content }),
        ...(req.body.excerpt !== undefined && { excerpt: req.body.excerpt }),
        ...(req.body.category && { category: req.body.category }),
        ...(req.body.published !== undefined && { published: req.body.published }),
      },
      { new: true }
    );
    if (!u) return res.status(404).json({ error: 'Introuvable.' });
    return res.json(u);
  } catch {
    return res.status(400).json({ error: 'Mise à jour impossible.' });
  }
});

router.delete('/articles/:id', requireRole('admin'), async (req, res) => {
  try {
    const r = await Article.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ error: 'Introuvable.' });
    return res.json({ ok: true });
  } catch {
    return res.status(400).json({ error: 'Suppression impossible.' });
  }
});

/** News */
router.get('/news', async (_req, res) => {
  try {
    const items = await News.find().sort({ createdAt: -1 }).limit(200).lean();
    return res.json({ items });
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post(
  '/news',
  [
    body('title').trim().isLength({ min: 3, max: 200 }),
    body('content').trim().isLength({ min: 10 }),
    body('excerpt').optional().trim(),
    body('alert').optional().isBoolean(),
    body('campaign').optional().isBoolean(),
    body('published').optional().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const doc = await News.create({
        title: req.body.title,
        excerpt: req.body.excerpt || '',
        content: req.body.content,
        alert: Boolean(req.body.alert),
        campaign: Boolean(req.body.campaign),
        published: req.body.published !== false,
      });
      return res.status(201).json(doc);
    } catch {
      return res.status(500).json({ error: 'Création impossible.' });
    }
  }
);

router.patch('/news/:id', async (req, res) => {
  try {
    const allowed = ['title', 'excerpt', 'content', 'alert', 'campaign', 'published'];
    const update = {};
    for (const k of allowed) if (req.body[k] !== undefined) update[k] = req.body[k];
    const u = await News.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!u) return res.status(404).json({ error: 'Introuvable.' });
    return res.json(u);
  } catch {
    return res.status(400).json({ error: 'Mise à jour impossible.' });
  }
});

router.delete('/news/:id', requireRole('admin'), async (req, res) => {
  try {
    const r = await News.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ error: 'Introuvable.' });
    return res.json({ ok: true });
  } catch {
    return res.status(400).json({ error: 'Suppression impossible.' });
  }
});

/** Resources */
router.get('/resources', async (_req, res) => {
  try {
    const items = await Resource.find().sort({ createdAt: -1 }).lean();
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
      const doc = await Resource.create({
        title: req.body.title,
        description: req.body.description || '',
        fileUrl: publicPath,
        fileName: req.file.originalname,
        category: req.body.category || 'guide',
        published: true,
      });
      return res.status(201).json(doc);
    } catch {
      return res.status(500).json({ error: 'Enregistrement impossible.' });
    }
  }
);

router.delete('/resources/:id', requireRole('admin'), async (req, res) => {
  try {
    const r = await Resource.findById(req.params.id);
    if (!r) return res.status(404).json({ error: 'Introuvable.' });
    const fp = path.join(UPLOAD_DIR, path.basename(r.fileUrl));
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
    await Resource.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  } catch {
    return res.status(400).json({ error: 'Suppression impossible.' });
  }
});

/** Laws */
router.get('/laws', async (_req, res) => {
  try {
    const items = await LawReference.find().sort({ createdAt: -1 }).lean();
    return res.json({ items });
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post(
  '/laws',
  requireRole('admin'),
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
      const doc = await LawReference.create({
        title: req.body.title,
        reference: req.body.reference,
        summary: req.body.summary,
        fullTextUrl: req.body.fullTextUrl || '',
        published: true,
      });
      return res.status(201).json(doc);
    } catch {
      return res.status(500).json({ error: 'Création impossible.' });
    }
  }
);

router.delete('/laws/:id', requireRole('admin'), async (req, res) => {
  try {
    await LawReference.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  } catch {
    return res.status(400).json({ error: 'Suppression impossible.' });
  }
});

/** Reports */
router.get('/reports', async (_req, res) => {
  try {
    const items = await Report.find().sort({ createdAt: -1 }).limit(500).lean();
    return res.json({ items });
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.patch(
  '/reports/:id',
  [param('id').isMongoId(), body('status').optional().isIn(STATUSES), body('internalNote').optional().trim()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const u = await Report.findByIdAndUpdate(
        req.params.id,
        {
          ...(req.body.status && { status: req.body.status }),
          ...(req.body.internalNote !== undefined && { internalNote: req.body.internalNote }),
        },
        { new: true }
      );
      if (!u) return res.status(404).json({ error: 'Introuvable.' });
      return res.json(u);
    } catch {
      return res.status(400).json({ error: 'Mise à jour impossible.' });
    }
  }
);

module.exports = router;
