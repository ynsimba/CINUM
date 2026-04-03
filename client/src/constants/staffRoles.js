/** Aligné sur l’API : rôles autorisés pour `/admin` (admin + modérateur). */
export const STAFF_ROLES = Object.freeze(['admin', 'moderator'])

export function isStaffRole(role) {
  return role != null && STAFF_ROLES.includes(role)
}
