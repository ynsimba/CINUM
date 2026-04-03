const express = require('express');
const articleService = require('../services/articleService');
const newsService = require('../services/newsService');
const resourceService = require('../services/resourceService');
const lawService = require('../services/lawService');
const { toClientDoc } = require('../lib/serialize');

const router = express.Router();

router.get('/articles', async (_req, res) => {
  try {
    const rows = await articleService.findPublished(100);
    const items = rows.map(toClientDoc);
    return res.json({ items });
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.get('/articles/:slug', async (req, res) => {
  try {
    const doc = await articleService.findBySlugPublished(req.params.slug);
    if (!doc) return res.status(404).json({ error: 'Article introuvable.' });
    return res.json(toClientDoc(doc));
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.get('/news', async (_req, res) => {
  try {
    const rows = await newsService.findPublished(50);
    const items = rows.map(toClientDoc);
    return res.json({ items });
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.get('/news/:id', async (req, res) => {
  try {
    const doc = await newsService.findPublishedById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Publication introuvable.' });
    return res.json(toClientDoc(doc));
  } catch {
    return res.status(400).json({ error: 'Identifiant invalide.' });
  }
});

router.get('/resources', async (_req, res) => {
  try {
    const rows = await resourceService.findPublished();
    const items = rows.map(toClientDoc);
    return res.json({ items });
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.get('/laws', async (_req, res) => {
  try {
    const rows = await lawService.findPublished();
    const items = rows.map(toClientDoc);
    return res.json({ items });
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
