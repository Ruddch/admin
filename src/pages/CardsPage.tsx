import { useState, useEffect } from 'react'
import { cardsApi, CardsFilters } from '../api/cardsApi'
import { Card, CreateCardDto, UpdateCardDto } from '../api/types'
import { tokensApi } from '../api/tokensApi'
import { Token } from '../api/types'
import { CardsTable } from '../components/CardsTable'
import { CardForm } from '../components/CardForm'
import './Page.css'
import './CardsPage.css'

export const CardsPage = () => {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingCard, setEditingCard] = useState<Card | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [tokens, setTokens] = useState<Token[]>([])
  const [filters, setFilters] = useState<CardsFilters>({
    active_only: false,
    token_id: null,
    rarity: null,
  })

  useEffect(() => {
    loadTokens()
  }, [])

  useEffect(() => {
    loadCards()
  }, [filters])

  const loadTokens = async () => {
    try {
      const data = await tokensApi.getAll()
      setTokens(data)
    } catch (err) {
      console.error('Ошибка при загрузке токенов:', err)
    }
  }

  const loadCards = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await cardsApi.getAll(filters)
      setCards(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке карточек')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: CreateCardDto) => {
    await cardsApi.create(data)
    await loadCards()
    setShowForm(false)
  }

  const handleUpdate = async (data: UpdateCardDto) => {
    if (!editingCard) return
    await cardsApi.update(editingCard.id, data)
    await loadCards()
    setEditingCard(null)
    setShowForm(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту карточку?')) {
      return
    }

    try {
      const result = await cardsApi.delete(id)
      const message = typeof result === 'string' ? result : JSON.stringify(result)
      alert(message)
      await loadCards()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при удалении карточки')
    }
  }

  const handleActivate = async (id: number) => {
    try {
      const result = await cardsApi.activate(id)
      const message = typeof result === 'string' ? result : JSON.stringify(result)
      alert(message)
      await loadCards()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при активации карточки')
    }
  }

  const handleEdit = (card: Card) => {
    setEditingCard(card)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingCard(null)
  }

  const handleFilterChange = (key: keyof CardsFilters, value: boolean | number | string | null) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      active_only: false,
      token_id: null,
      rarity: null,
    })
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Cards Settings</h1>
        <div className="page__actions">
          <div className="cards-page__filters">
            <label className="cards-page__filter-label">
              <input
                type="checkbox"
                checked={filters.active_only || false}
                onChange={(e) => handleFilterChange('active_only', e.target.checked)}
                className="cards-page__filter-checkbox"
              />
              <span>Только активные</span>
            </label>
            <select
              className="cards-page__filter-select"
              value={filters.token_id || ''}
              onChange={(e) =>
                handleFilterChange('token_id', e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">Все токены</option>
              {tokens.map((token) => (
                <option key={token.id} value={token.id}>
                  {token.name} ({token.symbol})
                </option>
              ))}
            </select>
            <select
              className="cards-page__filter-select"
              value={filters.rarity || ''}
              onChange={(e) => handleFilterChange('rarity', e.target.value || null)}
            >
              <option value="">Все редкости</option>
              <option value="common">Common</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>
            {(filters.active_only || filters.token_id || filters.rarity) && (
              <button
                className="cards-page__filter-clear"
                onClick={clearFilters}
                title="Очистить фильтры"
              >
                ✕
              </button>
            )}
          </div>
          <button
            className="page__button page__button--primary"
            onClick={() => {
              setEditingCard(null)
              setShowForm(true)
            }}
          >
            Создать карточку
          </button>
        </div>
      </div>

      {error && <div className="page__error">{error}</div>}

      {showForm && (
        <div className="cards-page__form-container">
          <CardForm
            card={editingCard}
            onSubmit={editingCard ? handleUpdate : handleCreate}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div className="page__content">
        {loading ? (
          <div className="page__loading">Загрузка...</div>
        ) : (
          <CardsTable
            cards={cards}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onActivate={handleActivate}
          />
        )}
      </div>
    </div>
  )
}
