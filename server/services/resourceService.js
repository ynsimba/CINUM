const prisma = require('../lib/prisma');

async function count() {
  return prisma.resource.count();
}

async function listAdmin() {
  return prisma.resource.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

async function create(data) {
  return prisma.resource.create({ data });
}

async function findById(id) {
  return prisma.resource.findUnique({ where: { id } });
}

async function deleteById(id) {
  try {
    await prisma.resource.delete({ where: { id } });
    return true;
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
}

async function findPublished() {
  return prisma.resource.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = {
  count,
  listAdmin,
  create,
  findById,
  deleteById,
  findPublished,
};
