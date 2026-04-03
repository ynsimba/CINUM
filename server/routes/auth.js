const express = require('express');
const { body, validationResult } = require('express-validator');
const userService = require('../services/userService');
const authService = require('../services/authService');
const { requireAuth, attachUserOptional } = require('../middleware/auth');
const { issueCsrf, csrfProtection } = require('../middleware/csrf');
const { publicUser } = require('../lib/serialize');

const router = express.Router();

router.get('/csrf', attachUserOptional, (req, res) => {
  const token = issueCsrf(req, res);
  res.json({ csrfToken: token });
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await userService.findById(req.userId);
    if (!user) return res.status(401).json({ error: 'Utilisateur introuvable.' });
    return res.json({ user: publicUser(user) });
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
    const email = String(req.body.email).trim().toLowerCase();
    const { password } = req.body;
    try {
      const { user } = await authService.loginStaff(email, password);
      const accessToken = authService.attachStaffSessionCookie(res, user);
      return res.json({ user: publicUser(user), accessToken });
    } catch (err) {
      const handled = authService.handleStaffLoginError(res, err);
      if (handled) return handled;
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
