const prisma = require('../lib/prisma');

async function findById(id) {
  return prisma.user.findUnique({ where: { id } });
}

async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
}

module.exports = { findById, findByEmail };
