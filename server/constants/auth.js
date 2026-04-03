/** Rôles autorisés à se connecter à l’espace d’administration (aligné sur Prisma `Role`). */
const STAFF_ROLES = Object.freeze(['admin', 'moderator'])

function isStaffRole(role) {
  return STAFF_ROLES.includes(role)
}

module.exports = { STAFF_ROLES, isStaffRole }
