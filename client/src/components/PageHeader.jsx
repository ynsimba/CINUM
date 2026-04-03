import { ScrollReveal } from './ScrollReveal'

export function PageHeader({ title, lead, titleId }) {
  return (
    <header className="bg-primary text-white cinum-page-header py-3 py-md-4 mb-3 mb-md-4">
      <ScrollReveal className="container px-3 px-sm-4 min-w-0" variant="fade-up">
        <h1 id={titleId} className="cinum-page-header__title h2 mb-2 text-break">
          {title}
        </h1>
        {lead && (
          <p className="mb-0 opacity-90 cinum-page-header__lead small text-break">{lead}</p>
        )}
      </ScrollReveal>
    </header>
  )
}
