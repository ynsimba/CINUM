import { lazy } from 'react'

/** Découpage par route : réduit le JS initial (bonnes pratiques perf). */
export const Home = lazy(() => import('../pages/Home').then((m) => ({ default: m.Home })))
export const About = lazy(() => import('../pages/About').then((m) => ({ default: m.About })))
export const Rights = lazy(() => import('../pages/Rights').then((m) => ({ default: m.Rights })))
export const Duties = lazy(() => import('../pages/Duties').then((m) => ({ default: m.Duties })))
export const Offenses = lazy(() => import('../pages/Offenses').then((m) => ({ default: m.Offenses })))
export const Sanctions = lazy(() => import('../pages/Sanctions').then((m) => ({ default: m.Sanctions })))
export const GoodPractices = lazy(() =>
  import('../pages/GoodPractices').then((m) => ({ default: m.GoodPractices }))
)
export const Education = lazy(() => import('../pages/Education').then((m) => ({ default: m.Education })))
export const DigitalLiteracy = lazy(() =>
  import('../pages/DigitalLiteracy').then((m) => ({ default: m.DigitalLiteracy }))
)
export const QuizPlayer = lazy(() => import('../pages/QuizPlayer').then((m) => ({ default: m.QuizPlayer })))
export const ArticleDetail = lazy(() =>
  import('../pages/ArticleDetail').then((m) => ({ default: m.ArticleDetail }))
)
export const Report = lazy(() => import('../pages/Report').then((m) => ({ default: m.Report })))
export const ReportTrack = lazy(() => import('../pages/ReportTrack').then((m) => ({ default: m.ReportTrack })))
export const PrivacyPolicy = lazy(() =>
  import('../pages/PrivacyPolicy').then((m) => ({ default: m.PrivacyPolicy }))
)
export const LegalNotice = lazy(() => import('../pages/LegalNotice').then((m) => ({ default: m.LegalNotice })))
export const DigitalCode = lazy(() => import('../pages/DigitalCode').then((m) => ({ default: m.DigitalCode })))
export const Faq = lazy(() => import('../pages/Faq').then((m) => ({ default: m.Faq })))
export const Glossary = lazy(() => import('../pages/Glossary').then((m) => ({ default: m.Glossary })))
export const Press = lazy(() => import('../pages/Press').then((m) => ({ default: m.Press })))
export const ActivityReports = lazy(() =>
  import('../pages/ActivityReports').then((m) => ({ default: m.ActivityReports }))
)
export const NewsList = lazy(() => import('../pages/NewsList').then((m) => ({ default: m.NewsList })))
export const NewsDetail = lazy(() => import('../pages/NewsDetail').then((m) => ({ default: m.NewsDetail })))
export const Contact = lazy(() => import('../pages/Contact').then((m) => ({ default: m.Contact })))
export const LoginModalPage = lazy(() =>
  import('../pages/LoginModalPage').then((m) => ({ default: m.LoginModalPage }))
)
export const AdminLayout = lazy(() =>
  import('../pages/admin/AdminLayout').then((m) => ({ default: m.AdminLayout }))
)
export const AdminDashboard = lazy(() =>
  import('../pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
)
export const AdminArticles = lazy(() =>
  import('../pages/admin/AdminArticles').then((m) => ({ default: m.AdminArticles }))
)
export const AdminNews = lazy(() => import('../pages/admin/AdminNews').then((m) => ({ default: m.AdminNews })))
export const AdminReports = lazy(() =>
  import('../pages/admin/AdminReports').then((m) => ({ default: m.AdminReports }))
)
export const AdminResources = lazy(() =>
  import('../pages/admin/AdminResources').then((m) => ({ default: m.AdminResources }))
)
export const AdminLaws = lazy(() => import('../pages/admin/AdminLaws').then((m) => ({ default: m.AdminLaws })))
export const AdminContactMessages = lazy(() =>
  import('../pages/admin/AdminContactMessages').then((m) => ({ default: m.AdminContactMessages }))
)
