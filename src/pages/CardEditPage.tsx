import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { cardsApi } from '../api/cardsApi'
import { Card, CreateCardDto, UpdateCardDto } from '../api/types'
import { CardForm } from '../components/CardForm'
import './Page.css'
import './CardEditPage.css'

export const CardEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [card, setCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isEditMode = id !== undefined && id !== 'new'

  useEffect(() => {
    if (isEditMode && id) {
      loadCard()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadCard = async () => {
    if (!id || id === 'new') return

    try {
      setLoading(true)
      setError('')
      const data = await cardsApi.getById(Number(id))
      setCard(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке карточки')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: CreateCardDto | UpdateCardDto) => {
    try {
      if (isEditMode && card) {
        await cardsApi.update(card.id, data as UpdateCardDto)
      } else {
        await cardsApi.create(data as CreateCardDto)
      }
      navigate('/cards')
    } catch (err) {
      throw err // Пробрасываем ошибку в CardForm
    }
  }

  const handleCancel = () => {
    navigate('/cards')
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
      <div className="card-edit-page__form-container">
        <CardForm card={card} onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  )
}
