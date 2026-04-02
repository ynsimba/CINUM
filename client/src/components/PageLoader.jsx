/** Indicateur de chargement pour le découpage de code (Suspense). */
export function PageLoader() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center py-5"
      style={{ minHeight: '40vh' }}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="spinner-border text-primary mb-2" aria-hidden="true" />
      <span className="visually-hidden">Chargement de la page…</span>
      <span className="small text-muted">Chargement…</span>
    </div>
  )
}
