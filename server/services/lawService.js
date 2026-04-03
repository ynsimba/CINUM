const prisma = require('../lib/prisma');

async function listAdmin() {
  return prisma.lawReference.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

async function create(data) {
  return prisma.lawReference.create({ data });
}

async function deleteById(id) {
  try {
    await prisma.lawReference.delete({ where: { id } });
    return true;
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
}

async function findPublished() {
  return prisma.lawReference.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = {
  listAdmin,
  create,
  deleteById,
  findPublished,
};
