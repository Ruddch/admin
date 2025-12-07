import { useAuth } from '../auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Header.css'

export const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header__content">
        <div className="header__user">
          {user && <span className="header__username">{user.username}</span>}
        </div>
        <button className="header__logout" onClick={handleLogout}>
          Выйти
        </button>
      </div>
    </header>
  )
}

