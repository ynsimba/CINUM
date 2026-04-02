const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

function getTokenFromRequest(req) {
  if (req.cookies && req.cookies.token) return req.cookies.token;
  const h = req.headers.authorization;
  if (h && h.startsWith('Bearer ')) return h.slice(7);
  return null;
}

function requireAuth(req, res, next) {
  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ error: 'Configuration serveur incomplète.' });
  const token = getTokenFromRequest(req);
  if (!token) return res.status(401).json({ error: 'Authentification requise.' });
  try {
    const payload = jwt.verify(token, secret);
    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch {
    return res.status(401).json({ error: 'Session invalide ou expirée.' });
  }
}

function requireRole(...roles) {
  return async (req, res, next) => {
    if (!req.userId) return res.status(401).json({ error: 'Authentification requise.' });
    try {
      const user = await User.findById(req.userId).lean();
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ error: 'Droits insuffisants.' });
      }
      req.user = user;
      next();
    } catch {
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
  };
}

async function attachUserOptional(req, res, next) {
  const secret = process.env.JWT_SECRET;
  const token = getTokenFromRequest(req);
  if (!token || !secret) return next();
  try {
    const payload = jwt.verify(token, secret);
    req.userId = payload.sub;
    req.userRole = payload.role;
    const user = await User.findById(payload.sub).lean();
    if (user) req.user = user;
  } catch {
    /* ignore */
  }
  next();
}

module.exports = { requireAuth, requireRole, attachUserOptional, getTokenFromRequest };
