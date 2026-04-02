import { Component } from 'react'
import { Link } from 'react-router-dom'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main id="contenu-principal" className="cinum-main" tabIndex={-1}>
          <div className="container py-5 px-3" role="alert" aria-live="assertive">
            <h1 className="h4 text-danger mb-3">Une erreur est survenue</h1>
            <p className="text-muted mb-4">
              Le chargement de cette page a échoué. Vous pouvez recharger la page ou retourner à l’accueil.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
                Recharger
              </button>
              <Link className="btn btn-outline-secondary" to="/">
                Accueil
              </Link>
            </div>
          </div>
        </main>
      )
    }
    return this.props.children
  }
}
