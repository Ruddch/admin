import { useState, useEffect } from 'react'
import { usersApi } from '../api/usersApi'
import { User, UpdateUserDto } from '../api/types'
import { UsersTable } from '../components/UsersTable'
import { UserForm } from '../components/UserForm'
import './Page.css'
import './UsersPage.css'

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [statsSummary, setStatsSummary] = useState<string>('')

  useEffect(() => {
    loadUsers()
    loadStatsSummary()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await usersApi.getAll()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке пользователей')
    } finally {
      setLoading(false)
    }
  }

  const loadStatsSummary = async () => {
    try {
      const summary = await usersApi.getStatsSummary()
      // Преобразуем объект в строку, если это объект
      setStatsSummary(typeof summary === 'string' ? summary : JSON.stringify(summary))
    } catch (err) {
      console.error('Ошибка при загрузке статистики:', err)
    }
  }

  const handleUpdate = async (data: UpdateUserDto) => {
    if (!editingUser) return
    await usersApi.update(editingUser.id, data)
    await loadUsers()
    await loadStatsSummary()
    setEditingUser(null)
    setShowForm(false)
  }

  const handleSearchDuplicates = async () => {
    try {
      const result = await usersApi.searchDuplicates()
      const message = typeof result === 'string' ? result : JSON.stringify(result)
      alert(message)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка при поиске дубликатов')
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingUser(null)
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Users Settings</h1>
        <div className="page__actions">
          {statsSummary && (
            <div className="users-page__stats">
              <span className="users-page__stats-text">{statsSummary}</span>
            </div>
          )}
          <button
            className="page__button page__button--secondary"
            onClick={handleSearchDuplicates}
          >
            Найти дубликаты
          </button>
        </div>
      </div>

      {error && <div className="page__error">{error}</div>}

      {showForm && editingUser && (
        <div className="users-page__form-container">
          <UserForm user={editingUser} onSubmit={handleUpdate} onCancel={handleCancel} />
        </div>
      )}

      <div className="page__content">
        {loading ? (
          <div className="page__loading">Загрузка...</div>
        ) : (
          <UsersTable users={users} onEdit={handleEdit} />
        )}
      </div>
    </div>
  )
}
