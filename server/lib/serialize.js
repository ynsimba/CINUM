/**
 * Mappe les documents Prisma (`id`) vers la forme attendue par le front (`_id`),
 * comme avec Mongoose.
 */
function toClientDoc(obj) {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) return obj.map(toClientDoc);
  if (typeof obj !== 'object') return obj;

  if (Object.prototype.hasOwnProperty.call(obj, 'id')) {
    const { id, passwordHash: _ph, ...rest } = obj;
    const nested = {};
    for (const [k, v] of Object.entries(rest)) {
      if (k === 'passwordHash') continue;
      nested[k] = toClientDoc(v);
    }
    return { ...nested, _id: id };
  }

  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'passwordHash') continue;
    out[k] = toClientDoc(v);
  }
  return out;
}

function publicUser(user) {
  if (!user) return null;
  const { passwordHash: _p, ...rest } = user;
  return toClientDoc(rest);
}

module.exports = { toClientDoc, publicUser };
