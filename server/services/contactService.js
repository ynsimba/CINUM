const prisma = require('../lib/prisma');

async function count() {
  return prisma.contactMessage.count();
}

async function create(data) {
  return prisma.contactMessage.create({ data });
}

async function listAdmin(limit = 200) {
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

async function deleteById(id) {
  try {
    await prisma.contactMessage.delete({ where: { id } });
    return true;
  } catch (e) {
    if (e.code === 'P2025') return false;
    throw e;
  }
}

module.exports = {
  count,
  create,
  listAdmin,
  deleteById,
};
