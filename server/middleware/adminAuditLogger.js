const { createAdminAuditLog, deriveAuditMeta, sanitizeBody } = require('../services/auditLogService');

function adminAuditLogger(req, res, next) {
  const method = req.method.toUpperCase();
  if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) return next();

  res.on('finish', () => {
    if (res.statusCode >= 500) return;
    const meta = deriveAuditMeta(req);
    createAdminAuditLog({
      actorId: req.userId || null,
      method,
      path: req.originalUrl || req.path,
      statusCode: res.statusCode,
      action: meta.action,
      entityType: meta.entityType,
      entityId: meta.entityId,
      details: {
        body: sanitizeBody(req.body),
        query: sanitizeBody(req.query),
        ip: req.ip,
      },
    }).catch(() => {});
  });

  next();
}

module.exports = { adminAuditLogger };
