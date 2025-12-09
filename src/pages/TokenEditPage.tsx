import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tokensApi } from '../api/tokensApi'
import { Token, CreateTokenDto, UpdateTokenDto } from '../api/types'
import { TokenForm } from '../components/TokenForm'
import './Page.css'
import './TokenEditPage.css'

export const TokenEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [token, setToken] = useState<Token | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isEditMode = id !== undefined && id !== 'new'

  useEffect(() => {
    if (isEditMode && id) {
      loadToken()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadToken = async () => {
    if (!id || id === 'new') return

    try {
      setLoading(true)
      setError('')
      const data = await tokensApi.getById(Number(id))
      setToken(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке токена')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: CreateTokenDto | UpdateTokenDto) => {
    try {
      if (isEditMode && token) {
        await tokensApi.update(token.id, data as UpdateTokenDto)
      } else {
        await tokensApi.create(data as CreateTokenDto)
      }
      navigate('/tokens')
    } catch (err) {
      throw err // Пробрасываем ошибку в TokenForm
    }
  }

  const handleCancel = () => {
    navigate('/tokens')
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

  return (
    <div className="page page--full-height">
      <div className="token-edit-page__form-container">
        <TokenForm token={token} onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  )
}
