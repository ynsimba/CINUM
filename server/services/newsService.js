const prisma = require('../lib/prisma');

async function count() {
  return prisma.news.count();
}

async function listAdmin() {
  return prisma.news.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
}

async function create(data) {
  return prisma.news.create({ data });
}

async function updateById(id, data) {
  try {
    return await prisma.news.update({ where: { id }, data });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
}

async function deleteById(id) {
  try {
    await prisma.news.delete({ where: { id } });
    return true;
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
}

async function findPublished(limit = 50) {
  return prisma.news.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

async function findPublishedById(id) {
  return prisma.news.findFirst({
    where: { id, published: true },
  });
}

module.exports = {
  count,
  listAdmin,
  create,
  updateById,
  deleteById,
  findPublished,
  findPublishedById,
};
