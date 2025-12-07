import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { LoginPage } from '../pages/LoginPage'
import { TokensPage } from '../pages/TokensPage'
import { CardsPage } from '../pages/CardsPage'
import { TournamentsPage } from '../pages/TournamentsPage'
import { UsersPage } from '../pages/UsersPage'
import { AdminLayout } from '../layouts/AdminLayout'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export const AppRouter = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/tokens" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/tokens" replace />} />
        <Route path="tokens" element={<TokensPage />} />
        <Route path="cards" element={<CardsPage />} />
        <Route path="tournaments" element={<TournamentsPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

