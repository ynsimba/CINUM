const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const userService = require('../services/userService');
const authService = require('../services/authService');
const { requireAuth, attachUserOptional } = require('../middleware/auth');
const { issueCsrf, csrfProtection } = require('../middleware/csrf');
const { publicUser } = require('../lib/serialize');
const { isStrongPassword, PASSWORD_POLICY_MESSAGE } = require('../lib/passwordPolicy');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
});
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
  loginLimiter,
  csrfProtection,
  [
    body('email').trim().notEmpty().withMessage('Identifiant requis.'),
    body('password').isString().isLength({ min: 8 }).withMessage('Mot de passe invalide.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const rawIdentifier = String(req.body.email).trim().toLowerCase();
    const email = rawIdentifier === 'admin' ? 'admin@cinum-rdc.local' : rawIdentifier;
    const { password } = req.body;
    try {
      const { user } = await authService.loginStaff(email, password, { ip: req.ip });
      authService.attachStaffSessionCookie(res, user);
      return res.json({ user: publicUser(user) });
    } catch (err) {
      const handled = authService.handleStaffLoginError(res, err);
      if (handled) return handled;
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
  }
);

router.post('/logout', (_req, res) => {
  const clearOpts = {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/api',
  };
  res.clearCookie('token', clearOpts);
  res.clearCookie('_csrfSecret', clearOpts);
  res.json({ ok: true });
});

router.post(
  '/change-password',
  requireAuth,
  csrfProtection,
  [
    body('currentPassword').isString().isLength({ min: 8 }).withMessage('Mot de passe actuel invalide.'),
    body('newPassword')
      .isString()
      .custom((value) => isStrongPassword(value))
      .withMessage(PASSWORD_POLICY_MESSAGE),
    body('newPassword')
      .custom((value, { req }) => value !== req.body.currentPassword)
      .withMessage("Le nouveau mot de passe doit être différent de l'ancien."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      await authService.changeStaffPassword(
        req.userId,
        String(req.body.currentPassword),
        String(req.body.newPassword)
      );
      return res.json({ ok: true, message: 'Mot de passe mis à jour.' });
    } catch (err) {
      const handled = authService.handleStaffLoginError(res, err);
      if (handled) return handled;
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
  }
);

module.exports = router;
