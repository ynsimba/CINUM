require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { connectDb } = require('./config/db');
const { csrfProtection } = require('./middleware/csrf');

const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');
const contactRoutes = require('./routes/contact');
const reportsRoutes = require('./routes/reports');
const adminRoutes = require('./routes/admin');

/** 5001 par défaut : sur macOS, le port 5000 est souvent pris par AirPlay (réponses HTTP 403). */
const PORT = process.env.PORT || 5001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
/** En dev, autoriser localhost et 127.0.0.1 (même port) — évite les échecs CORS / cookies si l’URL ne correspond pas à CLIENT_ORIGIN. */
const DEV_EXTRA_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173'];

function isDevLocalOrigin(origin) {
  try {
    const { protocol, hostname } = new URL(origin);
    if (protocol !== 'http:' && protocol !== 'https:') return false;
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI manquant dans .env');
    process.exit(1);
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.error('JWT_SECRET doit faire au moins 32 caractères.');
    process.exit(1);
  }

  await connectDb(mongoUri);

  const app = express();

  app.set('trust proxy', 1);

  const isProd = process.env.NODE_ENV === 'production';
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      ...(isProd
        ? {
            strictTransportSecurity: {
              maxAge: 31536000,
              includeSubDomains: true,
            },
          }
        : {}),
    })
  );

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (!isProd) {
          if (isDevLocalOrigin(origin)) return callback(null, true);
          const ok = new Set([CLIENT_ORIGIN, ...DEV_EXTRA_ORIGINS]).has(origin);
          return callback(null, ok);
        }
        return callback(null, origin === CLIENT_ORIGIN);
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api', apiLimiter);

  const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 40,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  app.use('/api/auth', authRoutes);
  app.use('/api/public', publicRoutes);
  app.use('/api/contact', strictLimiter, csrfProtection, contactRoutes);
  app.use('/api/reports', strictLimiter, csrfProtection, reportsRoutes);
  app.use('/api/admin', strictLimiter, csrfProtection, adminRoutes);

  app.use((err, _req, res, next) => {
    if (err && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Fichier trop volumineux (max 5 Mo).' });
    }
    if (err && err.message && err.message.includes('non autorisé')) {
      return res.status(400).json({ error: 'Type de fichier non autorisé.' });
    }
    next(err);
  });

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  });

  app.listen(PORT, () => {
    console.log(`API civisme numérique à l'écoute sur le port ${PORT}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
