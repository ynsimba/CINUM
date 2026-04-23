const crypto = require('crypto');

function genId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

function requestLogger(req, res, next) {
  const start = process.hrtime.bigint();
  const requestId = req.headers['x-request-id'] || genId();
  req.requestId = String(requestId);
  res.setHeader('x-request-id', req.requestId);

  res.on('finish', () => {
    const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
    const line = {
      ts: new Date().toISOString(),
      level: res.statusCode >= 500 ? 'error' : 'info',
      msg: 'http_request',
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl || req.url,
      status: res.statusCode,
      durationMs: Math.round(elapsedMs * 100) / 100,
      ip: req.ip,
      userAgent: req.get('user-agent') || '',
    };
    // Sortie JSON structurée pour ingestion (Datadog/Loki/ELK/CloudWatch).
    console.log(JSON.stringify(line));
  });

  next();
}

module.exports = { requestLogger };
