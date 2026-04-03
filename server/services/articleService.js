const prisma = require('../lib/prisma');

async function count() {
  return prisma.article.count();
}

async function listAdmin() {
  return prisma.article.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 200,
    include: { author: { select: { id: true, name: true, email: true } } },
  });
}

async function create(data) {
  return prisma.article.create({ data });
}

async function updateById(id, data) {
  try {
    return await prisma.article.update({ where: { id }, data });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
}

async function deleteById(id) {
  try {
    await prisma.article.delete({ where: { id } });
    return true;
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
}

async function findPublished(limit = 100) {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { updatedAt: 'desc' },
    take: limit,
  });
}

async function findBySlugPublished(slug) {
  return prisma.article.findFirst({
    where: { slug, published: true },
  });
}

async function findOneBySlug(slug) {
  return prisma.article.findUnique({ where: { slug } });
}

module.exports = {
  count,
  listAdmin,
  create,
  updateById,
  deleteById,
  findPublished,
  findBySlugPublished,
  findOneBySlug,
};
