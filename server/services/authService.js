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
async function loginStaff(email, password) {
  const user = await userService.findByEmail(email);
  if (!user) {
    throw new StaffLoginError('INVALID_CREDENTIALS', 'Identifiants incorrects.', 401);
  }
  if (!isStaffRole(user.role)) {
    throw new StaffLoginError(
      'FORBIDDEN_ROLE',
      "Ce compte n'a pas accès à l'espace d'administration.",
      403
    );
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new StaffLoginError('INVALID_CREDENTIALS', 'Identifiants incorrects.', 401);
  }
  return { user };
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
  attachStaffSessionCookie,
  assertJwtSecret,
  handleStaffLoginError,
};
