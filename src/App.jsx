import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RouteTitle } from './components/common/RouteTitle'
import { AuthLayout } from './layouts/AuthLayout'
import { MainLayout } from './layouts/MainLayout'
import ApprovalPage from './pages/ApprovalPage'
import DashboardPage from './pages/DashboardPage'
import GuidelinesPage from './pages/GuidelinesPage'
import HistoryPage from './pages/HistoryPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import NewReviewPage from './pages/NewReviewPage'
import NotFoundPage from './pages/NotFoundPage'
import RegisterPage from './pages/RegisterPage'
import ReviewResultPage from './pages/ReviewResultPage'
import SettingsPage from './pages/SettingsPage'
import TeamPage from './pages/TeamPage'

export default function App() {
  return (
    <BrowserRouter>
      <RouteTitle />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/guidelines" element={<GuidelinesPage />} />
          <Route path="/review/new" element={<NewReviewPage />} />
          <Route path="/review/:id" element={<ReviewResultPage />} />
          <Route path="/approvals" element={<ApprovalPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
