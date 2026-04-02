import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'
import { ACTIVITY_REPORTS } from '../data/activityReports'

export function ActivityReports() {
  return (
    <>
      <Seo
        title="Rapports d’activité — Civisme numérique RDC"
        description="Téléchargement des rapports d’activité annuels du portail (publications institutionnelles)."
      />
      <PageHeader
        title="Rapports d’activité"
        lead="Documents de synthèse publiés annuellement par l’entité porteuse (à compléter)."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        {ACTIVITY_REPORTS.length === 0 ? (
          <p className="text-muted">
            Aucun rapport n’est publié pour le moment. Ajoutez les fichiers PDF dans{' '}
            <code className="small">client/public/rapports/</code> et déclarez-les dans{' '}
            <code className="small">src/data/activityReports.js</code>.
          </p>
        ) : (
          <ul className="list-unstyled">
            {ACTIVITY_REPORTS.map((r) => (
              <li key={r.year} className="mb-3 pb-3 border-bottom">
                <h2 className="h6 mb-1">{r.title}</h2>
                {r.description && <p className="small text-muted mb-2">{r.description}</p>}
                {r.fileUrl ? (
                  <a href={r.fileUrl} className="btn btn-outline-primary btn-sm" download>
                    Télécharger (PDF)
                  </a>
                ) : (
                  <span className="small text-muted">Fichier à venir</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
