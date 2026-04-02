const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models/User');
const { requireAuth, attachUserOptional } = require('../middleware/auth');
const { issueCsrf, csrfProtection } = require('../middleware/csrf');

const router = express.Router();

router.get('/csrf', attachUserOptional, (req, res) => {
  const token = issueCsrf(req, res);
  res.json({ csrfToken: token });
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ error: 'Utilisateur introuvable.' });
    return res.json({ user: user.toJSON() });
  } catch {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post(
  '/login',
  csrfProtection,
  [
    body('email').isEmail().withMessage('Email invalide.'),
    body('password').isString().isLength({ min: 8 }).withMessage('Mot de passe invalide.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ error: 'Configuration serveur incomplète.' });
    const email = String(req.body.email).trim().toLowerCase();
    const { password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: 'Identifiants incorrects.' });
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(401).json({ error: 'Identifiants incorrects.' });
      const token = jwt.sign(
        { sub: user._id.toString(), role: user.role },
        secret,
        { expiresIn: '7d' }
      );
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.json({ user: user.toJSON() });
    } catch {
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
  }
);

router.post('/logout', (_req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'strict' });
  res.clearCookie('_csrfSecret', { httpOnly: true, sameSite: 'strict' });
  res.json({ ok: true });
});

module.exports = router;
