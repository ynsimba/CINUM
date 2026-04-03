/**
 * Aligné sur server `DISABLE_ADMIN_AUTH` — variable Vite côté client.
 * En dev, permet d’ouvrir /admin sans JWT (ne pas utiliser en production).
 */
export const isAdminAuthBypass =
  import.meta.env.VITE_DISABLE_ADMIN_AUTH === 'true' || import.meta.env.VITE_DISABLE_ADMIN_AUTH === '1'
