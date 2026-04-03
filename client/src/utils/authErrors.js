/**
 * Message lisible pour les échecs de connexion staff (admin / modérateur).
 * @param {unknown} ex — erreur Axios ou autre
 */
export function staffLoginErrorMessage(ex) {
  const res = ex?.response
  if (!res) {
    if (ex?.code === 'ECONNABORTED' || String(ex?.message || '').toLowerCase().includes('timeout')) {
      return 'La requête a expiré. Réessayez ou vérifiez que l’API est démarrée.'
    }
    if (ex?.message === 'Network Error') {
      return 'Le serveur ne répond pas. Vérifiez que l’API tourne dans un autre terminal : npm run dev:server (port dans server/.env, défaut 5001), puis réessayez.'
    }
    return `Impossible de joindre l’API (${ex?.message || 'erreur réseau'}). Lancez npm run dev:server ; le port doit correspondre au proxy Vite (défaut 5001).`
  }
  const status = res.status
  const d = res.data
  if (d && typeof d === 'object') {
    if (typeof d.error === 'string' && d.error.trim()) return d.error
    const first = Array.isArray(d.errors) ? d.errors[0] : null
    if (first?.msg) return first.msg
    if (d.code === 'FORBIDDEN_ROLE' && typeof d.error === 'string') return d.error
  }
  if (typeof d === 'string' && d.trim()) {
    return 'Réponse serveur inattendue (souvent une page HTML). Vérifiez l’URL de l’API et le proxy Vite vers le bon port.'
  }
  if (status === 401) return 'Identifiants incorrects.'
  if (status === 403) {
    return (
      (d && typeof d === 'object' && typeof d.error === 'string' && d.error) ||
      'Accès refusé : ce compte ne peut pas accéder à l’administration (ou jeton CSRF / session). Rechargez la page si besoin.'
    )
  }
  if (status === 502 || status === 503) {
    return [
      'L’API ne répond pas ou le proxy Vite ne peut pas l’atteindre (erreur 502/503).',
      '1) Vérifiez que PostgreSQL est démarré et que DATABASE_URL dans server/.env est correct.',
      '2) Dans un autre terminal : npm run dev:server.',
      '3) PORT dans server/.env doit correspondre au proxy Vite (défaut 5001 ; sinon client/.env → VITE_DEV_API_TARGET).',
      'Redémarrez le client Vite après modification de client/.env.',
    ].join(' ')
  }
  if (status === 500) return 'Erreur serveur. Réessayez plus tard.'
  return `Connexion impossible (erreur HTTP ${status}).`
}
