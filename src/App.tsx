import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { AppRouter } from './router/AppRouter'

// Base path для роутера (должен совпадать с base в vite.config.ts)
// Если репозиторий не в корне GitHub Pages, укажите путь, например: '/admin/'
const BASE_PATH = import.meta.env.BASE_URL || '/'

function App() {
  return (
    <BrowserRouter basename={BASE_PATH}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

