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

async function registerLoginAttempt({ email, ip, success }) {
  return prisma.loginAttempt.create({
    data: {
      email: String(email || '').trim().toLowerCase(),
      ip: String(ip || ''),
      success: Boolean(success),
    },
  });
}

async function registerFailedStaffLogin(userId, now = new Date()) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  const nextCount = Number(user.failedLoginCount || 0) + 1;
  const lockThreshold = 5;
  const lockMinutes = 15;
  const lockedUntil =
    nextCount >= lockThreshold ? new Date(now.getTime() + lockMinutes * 60 * 1000) : user.lockedUntil ?? null;
  return prisma.user.update({
    where: { id: userId },
    data: {
      failedLoginCount: nextCount >= lockThreshold ? 0 : nextCount,
      lockedUntil,
    },
  });
}

async function clearLoginFailures(userId) {
  return prisma.user.update({
    where: { id: userId },
    data: { failedLoginCount: 0, lockedUntil: null },
  });
}

module.exports = {
  findById,
  findByEmail,
  updatePasswordHashById,
  registerLoginAttempt,
  registerFailedStaffLogin,
  clearLoginFailures,
};
