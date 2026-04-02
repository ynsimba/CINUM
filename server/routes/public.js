const express = require('express');
const Article = require('../models/Article');
const News = require('../models/News');
const Resource = require('../models/Resource');
const LawReference = require('../models/LawReference');

const router = express.Router();

router.get('/articles', async (_req, res) => {
  try {
    const items = await Article.find({ published: true }).sort({ updatedAt: -1 }).limit(100).lean();
    return res.json({ items });
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.get('/articles/:slug', async (req, res) => {
  try {
    const doc = await Article.findOne({ slug: req.params.slug, published: true }).lean();
    if (!doc) return res.status(404).json({ error: 'Article introuvable.' });
    return res.json(doc);
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.get('/news', async (_req, res) => {
  try {
    const items = await News.find({ published: true }).sort({ createdAt: -1 }).limit(50).lean();
    return res.json({ items });
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.get('/news/:id', async (req, res) => {
  try {
    const doc = await News.findOne({ _id: req.params.id, published: true }).lean();
    if (!doc) return res.status(404).json({ error: 'Publication introuvable.' });
    return res.json(doc);
  } catch {
    return res.status(400).json({ error: 'Identifiant invalide.' });
  }
});

router.get('/resources', async (_req, res) => {
  try {
    const items = await Resource.find({ published: true }).sort({ createdAt: -1 }).lean();
    return res.json({ items });
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.get('/laws', async (_req, res) => {
  try {
    const items = await LawReference.find({ published: true }).sort({ createdAt: -1 }).lean();
    return res.json({ items });
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
