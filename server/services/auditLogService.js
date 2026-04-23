const prisma = require('../lib/prisma');

function sanitizeBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return {};
  const out = {};
  const sensitive = new Set(['password', 'passwordHash', 'currentPassword', 'newPassword', 'token']);
  for (const [k, v] of Object.entries(body)) {
    if (sensitive.has(k)) out[k] = '[REDACTED]';
    else if (v == null) out[k] = v;
    else if (typeof v === 'string') out[k] = v.slice(0, 200);
    else if (Array.isArray(v)) out[k] = `[array:${v.length}]`;
    else if (typeof v === 'object') out[k] = '[object]';
    else out[k] = v;
  }
  return out;
}

async function createAdminAuditLog(payload) {
  return prisma.adminAuditLog.create({
    data: {
      actorId: payload.actorId || null,
      method: payload.method,
      path: payload.path,
      action: payload.action,
      entityType: payload.entityType,
      entityId: payload.entityId || null,
      statusCode: payload.statusCode,
      details: payload.details || {},
    },
  });
}

function deriveAuditMeta(req) {
  const cleanPath = String(req.path || req.originalUrl || '/');
  const chunks = cleanPath.split('/').filter(Boolean);
  const entityType = chunks[0] || 'unknown';
  const entityId = chunks[1] || null;
  return {
    action: `${req.method}:${entityType}`,
    entityType,
    entityId,
  };
}

module.exports = {
  sanitizeBody,
  createAdminAuditLog,
  deriveAuditMeta,
};
