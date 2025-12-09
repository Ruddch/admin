import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { LoginPage } from '../pages/LoginPage'
import { TokensPage } from '../pages/TokensPage'
import { TokenEditPage } from '../pages/TokenEditPage'
import { TokenPricesPage } from '../pages/TokenPricesPage'
import { CardsPage } from '../pages/CardsPage'
import { CardEditPage } from '../pages/CardEditPage'
import { RaritiesPage } from '../pages/RaritiesPage'
import { RarityEditPage } from '../pages/RarityEditPage'
import { TournamentsPage } from '../pages/TournamentsPage'
import { TournamentEditPage } from '../pages/TournamentEditPage'
import { TournamentDetailsPage } from '../pages/TournamentDetailsPage'
import { PrizesPage } from '../pages/PrizesPage'
import { PrizeEditPage } from '../pages/PrizeEditPage'
import { PackTypesPage } from '../pages/PackTypesPage'
import { PackTypeEditPage } from '../pages/PackTypeEditPage'
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
        <Route path="tokens/:id" element={<TokenEditPage />} />
        <Route path="tokens/:id/prices" element={<TokenPricesPage />} />
        <Route path="cards" element={<CardsPage />} />
        <Route path="cards/:id" element={<CardEditPage />} />
        <Route path="rarities" element={<RaritiesPage />} />
        <Route path="rarities/:id" element={<RarityEditPage />} />
        <Route path="tournaments" element={<TournamentsPage />} />
        <Route path="tournaments/:id" element={<TournamentEditPage />} />
        <Route path="tournaments/:id/details" element={<TournamentDetailsPage />} />
        <Route path="prizes" element={<PrizesPage />} />
        <Route path="prizes/:id" element={<PrizeEditPage />} />
        <Route path="pack-types" element={<PackTypesPage />} />
        <Route path="pack-types/:id" element={<PackTypeEditPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

