import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'
import { ACTIVITY_REPORTS } from '../data/activityReports'

export function ActivityReports() {
  return (
    <>
      <Seo
        title="Rapports d’activité — Civisme numérique RDC"
        description="Rapports d’activité institutionnels sur les actions de civisme numérique, de prévention et de protection dans le cyberespace."
      />
      <PageHeader
        title="Rapports d’activité"
        lead="Documents de synthèse sur les résultats, actions de prévention et mesures de protection menées par l’entité porteuse."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <div className="alert alert-light border mb-4" role="note">
          Les rapports d&apos;activité rendent compte des progrès réalisés pour renforcer une société congolaise plus
          éclairée, plus responsable et plus sécurisée face aux menaces numériques.
        </div>
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
