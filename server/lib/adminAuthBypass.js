/**
 * Désactive JWT + rôles sur /api/admin (dev uniquement).
 * Définir DISABLE_ADMIN_AUTH=true dans server/.env — à retirer en production.
 */
function isAdminAuthDisabled() {
  return ['1', 'true', 'yes', 'on'].includes(String(process.env.DISABLE_ADMIN_AUTH || '').toLowerCase());
}

module.exports = { isAdminAuthDisabled };
