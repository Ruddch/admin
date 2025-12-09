import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cardsApi, CardsFilters } from '../api/cardsApi'
import { Card } from '../api/types'
import { tokensApi } from '../api/tokensApi'
import { Token } from '../api/types'
import { CardsTable } from '../components/CardsTable'
import './Page.css'
import './CardsPage.css'

const DEFAULT_LIMIT = 20

export const CardsPage = () => {
  const navigate = useNavigate()
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tokens, setTokens] = useState<Token[]>([])
  const [filters, setFilters] = useState<CardsFilters>({
    active_only: false,
    token_id: null,
    rarity: null,
  })
  const [skip, setSkip] = useState<number>(0)
  const [limit] = useState<number>(DEFAULT_LIMIT)
  const [total, setTotal] = useState<number>(0)
  const [hasNext, setHasNext] = useState<boolean>(false)
  const [hasPrev, setHasPrev] = useState<boolean>(false)

  useEffect(() => {
    loadTokens()
  }, [])

  useEffect(() => {
    setSkip(0) // Сбрасываем на первую страницу при изменении фильтра
  }, [filters])

  useEffect(() => {
    loadCards()
  }, [filters, skip])

  const loadTokens = async () => {
    try {
      const data = await tokensApi.getAll()
      setTokens(data.items)
    } catch (err) {
      console.error('Ошибка при загрузке токенов:', err)
    }
  }

  const loadCards = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await cardsApi.getAll(filters, skip, limit)
      setCards(data.items)
      setTotal(data.total)
      setHasNext(data.has_next)
      setHasPrev(data.has_prev)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке карточек')
    } finally {
      setLoading(false)
    }
  }

  const handleNextPage = () => {
    if (hasNext) {
      setSkip((prev) => prev + limit)
    }
  }

  const handlePrevPage = () => {
    if (hasPrev) {
      setSkip((prev) => Math.max(0, prev - limit))
    }
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
    navigate(`/cards/${card.id}`)
  }

  const handleCreate = () => {
    navigate('/cards/new')
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
            onClick={handleCreate}
          >
            Создать карточку
          </button>
        </div>
      </div>

      {error && <div className="page__error">{error}</div>}

      <div className="page__content">
        {loading ? (
          <div className="page__loading">Загрузка...</div>
        ) : (
          <>
            <CardsTable
              cards={cards}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onActivate={handleActivate}
            />
            {total > 0 && (
              <div className="cards-page__pagination">
                <div className="cards-page__pagination-info">
                  Показано {skip + 1}-{Math.min(skip + limit, total)} из {total}
                </div>
                <div className="cards-page__pagination-controls">
                  <button
                    className="page__button"
                    onClick={handlePrevPage}
                    disabled={!hasPrev || loading}
                  >
                    Предыдущая
                  </button>
                  <button
                    className="page__button"
                    onClick={handleNextPage}
                    disabled={!hasNext || loading}
                  >
                    Следующая
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
