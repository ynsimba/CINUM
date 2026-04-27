const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('./userService');
const { isStaffRole } = require('../constants/auth');

/** Erreurs métier login — codes stables pour le routeur HTTP */
class StaffLoginError extends Error {
  constructor(code, message, statusCode = 400) {
    super(message);
    this.name = 'StaffLoginError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * Vérifie les identifiants et que le compte est bien éligible à l’espace admin/modération.
 * @returns {Promise<{ user: import('@prisma/client').User }>}
 */
async function loginStaff(email, password, context = {}) {
  const now = new Date();
  const ip = context.ip || '';
  const user = await userService.findByEmail(email);
  if (!user) {
    await userService.registerLoginAttempt({ email, ip, success: false });
    throw new StaffLoginError('INVALID_CREDENTIALS', 'Identifiants incorrects.', 401);
  }
  if (!isStaffRole(user.role)) {
    await userService.registerLoginAttempt({ email, ip, success: false });
    throw new StaffLoginError('INVALID_CREDENTIALS', 'Identifiants incorrects.', 401);
  }
  if (user.lockedUntil && new Date(user.lockedUntil).getTime() > now.getTime()) {
    await userService.registerLoginAttempt({ email, ip, success: false });
    throw new StaffLoginError(
      'ACCOUNT_LOCKED',
      'Compte temporairement verrouillé après plusieurs tentatives. Réessayez plus tard.',
      429
    );
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    await Promise.all([
      userService.registerFailedStaffLogin(user.id, now),
      userService.registerLoginAttempt({ email, ip, success: false }),
    ]);
    throw new StaffLoginError('INVALID_CREDENTIALS', 'Identifiants incorrects.', 401);
  }
  await Promise.all([
    userService.clearLoginFailures(user.id),
    userService.registerLoginAttempt({ email, ip, success: true }),
  ]);
  return { user };
}

/**
 * Change le mot de passe du compte staff connecté après vérification de l'ancien.
 */
async function changeStaffPassword(userId, currentPassword, newPassword) {
  const user = await userService.findById(userId);
  if (!user) {
    throw new StaffLoginError('USER_NOT_FOUND', 'Utilisateur introuvable.', 404);
  }
  if (!isStaffRole(user.role)) {
    throw new StaffLoginError(
      'FORBIDDEN_ROLE',
      "Ce compte n'a pas accès à l'espace d'administration.",
      403
    );
  }
  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) {
    throw new StaffLoginError('INVALID_CURRENT_PASSWORD', 'Mot de passe actuel incorrect.', 400);
  }
  const nextHash = await bcrypt.hash(newPassword, 12);
  await userService.updatePasswordHashById(user.id, nextHash);
  return true;
}

function assertJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new StaffLoginError('SERVER_CONFIG', 'Configuration serveur incomplète.', 500);
  }
  return secret;
}

/**
 * Pose le cookie JWT httpOnly pour la session staff et renvoie le même jeton
 * (pour réponse JSON `accessToken` / en-tête Bearer côté SPA).
 * @param {import('express').Response} res
 * @param {{ id: string, role: string }} user
 * @returns {string} JWT
 */
function attachStaffSessionCookie(res, user) {
  const secret = assertJwtSecret();
  const token = jwt.sign({ sub: user.id, role: user.role }, secret, { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/api',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
}

function handleStaffLoginError(res, err) {
  if (err instanceof StaffLoginError) {
    return res.status(err.statusCode).json({ error: err.message, code: err.code });
  }
  return null;
}

module.exports = {
  StaffLoginError,
  loginStaff,
  changeStaffPassword,
  attachStaffSessionCookie,
  assertJwtSecret,
  handleStaffLoginError,
};
