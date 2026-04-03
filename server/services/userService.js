const prisma = require('../lib/prisma');

async function findById(id) {
  return prisma.user.findUnique({ where: { id } });
}

async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
}

async function updatePasswordHashById(id, passwordHash) {
  try {
    return await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
}

module.exports = { findById, findByEmail, updatePasswordHashById };
