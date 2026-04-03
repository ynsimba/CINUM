/**
 * Bypass admin désactivé : mot de passe obligatoire pour /api/admin.
 */
function isAdminAuthDisabled() {
  return false;
}

module.exports = { isAdminAuthDisabled };
