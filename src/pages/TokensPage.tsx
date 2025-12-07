import { useState, useEffect } from 'react'
import { tokensApi } from '../api/tokensApi'
import { Token, CreateTokenDto, UpdateTokenDto } from '../api/types'
import { TokensTable } from '../components/TokensTable'
import { TokenForm } from '../components/TokenForm'
import './Page.css'
import './TokensPage.css'

export const TokensPage = () => {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingToken, setEditingToken] = useState<Token | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [schedulerStatus, setSchedulerStatus] = useState<string>('')
  const [activeOnly, setActiveOnly] = useState<boolean>(false)

  useEffect(() => {
    loadTokens()
    loadSchedulerStatus()
  }, [activeOnly])

  const loadTokens = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await tokensApi.getAll(activeOnly)
      setTokens(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке токенов')
    } finally {
      setLoading(false)
    }
  }

  const loadSchedulerStatus = async () => {
    try {
      const status = await tokensApi.getSchedulerStatus()
      // Преобразуем объект в строку, если это объект
      setSchedulerStatus(typeof status === 'string' ? status : JSON.stringify(status))
    } catch (err) {
      console.error('Ошибка при загрузке статуса планировщика:', err)
    }
  }

  const handleCreate = async (data: CreateTokenDto | UpdateTokenDto) => {
    await tokensApi.create(data as CreateTokenDto)
    await loadTokens()
    setShowForm(false)
  }

  const handleUpdate = async (data: CreateTokenDto | UpdateTokenDto) => {
    if (!editingToken) return
    await tokensApi.update(editingToken.id, data as UpdateTokenDto)
    await loadTokens()
    setEditingToken(null)
    setShowForm(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот токен?')) {
      return
    }

    try {
      await tokensApi.delete(id)
      await loadTokens()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при удалении токена')
    }
  }

  const handleEdit = (token: Token) => {
    setEditingToken(token)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingToken(null)
  }

  const handleTriggerScheduler = async () => {
    try {
      const result = await tokensApi.triggerScheduler()
      const message = typeof result === 'string' ? result : JSON.stringify(result)
      alert(message)
      await loadSchedulerStatus()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка при запуске планировщика')
    }
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Tokens Settings</h1>
        <div className="page__actions">
          <div className="tokens-page__filters">
            <label className="tokens-page__filter-label">
              <input
                type="checkbox"
                checked={activeOnly}
                onChange={(e) => setActiveOnly(e.target.checked)}
                className="tokens-page__filter-checkbox"
              />
              <span>Только активные</span>
            </label>
          </div>
          {schedulerStatus && (
            <div className="tokens-page__scheduler">
              <span className="tokens-page__scheduler-status">Статус: {schedulerStatus}</span>
              <button
                className="tokens-page__scheduler-button"
                onClick={handleTriggerScheduler}
              >
                Запустить планировщик
              </button>
            </div>
          )}
          <button
            className="page__button page__button--primary"
            onClick={() => {
              setEditingToken(null)
              setShowForm(true)
            }}
          >
            Создать токен
          </button>
        </div>
      </div>

      {error && <div className="page__error">{error}</div>}

      {showForm && (
        <div className="tokens-page__form-container">
          <TokenForm
            token={editingToken}
            onSubmit={editingToken ? handleUpdate : handleCreate}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div className="page__content">
        {loading ? (
          <div className="page__loading">Загрузка...</div>
        ) : (
          <TokensTable tokens={tokens} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </div>
  )
}
