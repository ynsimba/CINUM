const prisma = require('../lib/prisma');

async function createOrIgnoreByEmail(email) {
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized) return null;
  return prisma.newsletterSubscription.upsert({
    where: { email: normalized },
    update: {},
    create: { email: normalized },
  });
}

module.exports = {
  createOrIgnoreByEmail,
};
