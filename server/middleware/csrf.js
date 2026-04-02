const Tokens = require('csrf');
const tokens = new Tokens();

function csrfProtection(req, res, next) {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next();
  const secret = req.cookies._csrfSecret;
  const token = req.headers['x-csrf-token'] || req.body?._csrf;
  if (!secret || !token || !tokens.verify(secret, token)) {
    return res.status(403).json({ error: 'Jeton CSRF invalide ou manquant.' });
  }
  next();
}

function issueCsrf(req, res) {
  let secret = req.cookies._csrfSecret;
  if (!secret) {
    secret = tokens.secretSync();
    res.cookie('_csrfSecret', secret, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });
  }
  return tokens.create(secret);
}

module.exports = { csrfProtection, issueCsrf };
