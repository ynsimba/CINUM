import { Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DocumentLang } from './components/DocumentLang'
import { ScrollToTop } from './components/ScrollToTop'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PageLoader } from './components/PageLoader'
import * as Pages from './routes/lazyPages'

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <DocumentLang />
          <ScrollToTop />
          <div className="d-flex flex-column min-vh-100">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/connexion" element={<Pages.LoginModalPage />} />
                  <Route path="/" element={<Pages.Home />} />
                  <Route path="/a-propos" element={<Pages.About />} />
                  <Route path="/droits" element={<Pages.Rights />} />
                  <Route path="/devoirs" element={<Pages.Duties />} />
                  <Route path="/infractions" element={<Pages.Offenses />} />
                  <Route path="/sanctions" element={<Pages.Sanctions />} />
                  <Route path="/bonnes-pratiques" element={<Pages.GoodPractices />} />
                  <Route path="/espace-educatif/quiz/:quizId" element={<Pages.QuizPlayer />} />
                  <Route path="/espace-educatif" element={<Pages.Education />} />
                  <Route path="/litteratie-numerique" element={<Pages.DigitalLiteracy />} />
                  <Route path="/article/:slug" element={<Pages.ArticleDetail />} />
                  <Route path="/signalement/suivi" element={<Pages.ReportTrack />} />
                  <Route path="/signalement" element={<Pages.Report />} />
                  <Route path="/confidentialite" element={<Pages.PrivacyPolicy />} />
                  <Route path="/mentions-legales" element={<Pages.LegalNotice />} />
                  <Route path="/faq" element={<Pages.Faq />} />
                  <Route path="/glossaire" element={<Pages.Glossary />} />
                  <Route path="/presse" element={<Pages.Press />} />
                  <Route path="/rapports-activite" element={<Pages.ActivityReports />} />
                  <Route path="/actualites" element={<Pages.NewsList />} />
                  <Route path="/actualites/:id" element={<Pages.NewsDetail />} />
                  <Route path="/contact" element={<Pages.Contact />} />
                  <Route element={<ProtectedRoute roles={['admin', 'moderator']} />}>
                    <Route path="admin" element={<Pages.AdminLayout />}>
                      <Route index element={<Pages.AdminDashboard />} />
                      <Route path="articles" element={<Pages.AdminArticles />} />
                      <Route path="actualites" element={<Pages.AdminNews />} />
                      <Route path="signalements" element={<Pages.AdminReports />} />
                      <Route path="ressources" element={<Pages.AdminResources />} />
                      <Route path="lois" element={<Pages.AdminLaws />} />
                    </Route>
                  </Route>
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}
