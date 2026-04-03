const crypto = require('crypto');
const prisma = require('../lib/prisma');

async function countPending() {
  return prisma.report.count({ where: { status: 'pending' } });
}

async function listAdmin() {
  return prisma.report.findMany({
    orderBy: { createdAt: 'desc' },
    take: 500,
  });
}

async function create(data) {
  return prisma.report.create({ data });
}

async function findByReferenceForLookup(reference) {
  return prisma.report.findUnique({
    where: { reference },
  });
}

async function updateById(id, data) {
  try {
    return await prisma.report.update({ where: { id }, data });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
}

async function findById(id) {
  return prisma.report.findUnique({ where: { id } });
}

async function deleteById(id) {
  try {
    await prisma.report.delete({ where: { id } });
    return true;
  } catch (e) {
    if (e.code === 'P2025') return false;
    throw e;
  }
}

async function referenceExists(reference) {
  const n = await prisma.report.count({ where: { reference } });
  return n > 0;
}

async function generateUniqueReference() {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const reference = `CIN-${year}-${suffix}`;
    const exists = await referenceExists(reference);
    if (!exists) return reference;
  }
  return null;
}

module.exports = {
  countPending,
  listAdmin,
  create,
  findByReferenceForLookup,
  findById,
  updateById,
  deleteById,
  generateUniqueReference,
};
