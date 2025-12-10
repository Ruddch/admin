import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usersApi } from '../api/usersApi'
import { User, UpdateUserDto } from '../api/types'
import { UserForm } from '../components/UserForm'
import './Page.css'
import './UserEditPage.css'

export const UserEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isEditMode = id !== undefined && id !== 'new'

  useEffect(() => {
    if (isEditMode && id) {
      loadUser()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadUser = async () => {
    if (!id || id === 'new') return

    try {
      setLoading(true)
      setError('')
      const data = await usersApi.getById(Number(id))
      setUser(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке пользователя')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: UpdateUserDto) => {
    if (!user) return

    try {
      await usersApi.update(user.id, data)
      navigate('/users')
    } catch (err) {
      throw err // Пробрасываем ошибку в UserForm
    }
  }

  const handleCancel = () => {
    navigate('/users')
  }

  if (loading) {
    return (
      <div className="page">
        <div className="page__loading">Загрузка...</div>
      </div>
    )
  }

  if (error && isEditMode) {
    return (
      <div className="page">
        <div className="page__error">{error}</div>
        <button className="page__button" onClick={handleCancel}>
          Вернуться к списку
        </button>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page">
        <div className="page__error">Пользователь не найден</div>
        <button className="page__button" onClick={handleCancel}>
          Вернуться к списку
        </button>
      </div>
    )
  }

  return (
    <div className="page page--full-height">
      <div className="user-edit-page__form-container">
        <UserForm user={user} onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  )
}
