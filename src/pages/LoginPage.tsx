import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'

export const LoginPage = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login: loginUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!login || !password) {
      setError('Заполните все поля')
      return
    }

    try {
      await loginUser(login, password)
      navigate('/tokens')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка авторизации')
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__container">
        <h1 className="login-page__title">Вход в админ-панель</h1>
        <form className="login-page__form" onSubmit={handleSubmit}>
          <div className="login-page__field">
            <label htmlFor="login">Логин</label>
            <input
              id="login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Введите логин"
            />
          </div>
          <div className="login-page__field">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
            />
          </div>
          {error && <div className="login-page__error">{error}</div>}
          <button type="submit" className="login-page__button">
            Войти
          </button>
        </form>
      </div>
    </div>
  )
}

