import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { tokensApi } from '../api/tokensApi'
import { Token } from '../api/types'
import { TokensTable } from '../components/TokensTable'
import './Page.css'
import './TokensPage.css'

const DEFAULT_LIMIT = 20

export const TokensPage = () => {
  const navigate = useNavigate()
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [schedulerStatus, setSchedulerStatus] = useState<string>('')
  const [activeOnly, setActiveOnly] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [symbol, setSymbol] = useState<string>('')
  const [weightFrom, setWeightFrom] = useState<string>('')
  const [weightTo, setWeightTo] = useState<string>('')
  const [skip, setSkip] = useState<number>(0)
  const [limit] = useState<number>(DEFAULT_LIMIT)
  const [total, setTotal] = useState<number>(0)
  const [hasNext, setHasNext] = useState<boolean>(false)
  const [hasPrev, setHasPrev] = useState<boolean>(false)

  useEffect(() => {
    setSkip(0) // Сбрасываем на первую страницу при изменении фильтра
  }, [activeOnly, name, symbol, weightFrom, weightTo])

  useEffect(() => {
    loadTokens()
    loadSchedulerStatus()
  }, [activeOnly, skip, name, symbol, weightFrom, weightTo])

  const loadTokens = async () => {
    try {
      setLoading(true)
      setError('')
      const weightFromNum = weightFrom ? Number(weightFrom) : null
      const weightToNum = weightTo ? Number(weightTo) : null
      const data = await tokensApi.getAll(
        activeOnly,
        skip,
        limit,
        name || null,
        symbol || null,
        weightFromNum,
        weightToNum
      )
      setTokens(data.items)
      setTotal(data.total)
      setHasNext(data.has_next)
      setHasPrev(data.has_prev)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке токенов')
    } finally {
      setLoading(false)
    }
  }

  const handleClearFilters = () => {
    setName('')
    setSymbol('')
    setWeightFrom('')
    setWeightTo('')
    setActiveOnly(false)
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

  const loadSchedulerStatus = async () => {
    try {
      const status = await tokensApi.getSchedulerStatus()
      // Преобразуем объект в строку, если это объект
      setSchedulerStatus(typeof status === 'string' ? status : JSON.stringify(status))
    } catch (err) {
      console.error('Ошибка при загрузке статуса планировщика:', err)
    }
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
    navigate(`/tokens/${token.id}`)
  }

  const handleViewPrices = (token: Token) => {
    navigate(`/tokens/${token.id}/prices`)
  }

  const handleCreate = () => {
    navigate('/tokens/new')
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
            onClick={handleCreate}
          >
            Создать токен
          </button>
        </div>
      </div>

      <div className="tokens-page__filters-section">
        <div className="tokens-page__filters">
          <div className="tokens-page__filter-group">
            <label className="tokens-page__filter-label">
              <span className="tokens-page__filter-label-text">Поиск по названию</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="name"
                className="tokens-page__filter-input"
              />
            </label>
          </div>

          <div className="tokens-page__filter-group">
            <label className="tokens-page__filter-label">
              <span className="tokens-page__filter-label-text">Фильтр по символу</span>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="symbol"
                className="tokens-page__filter-input"
              />
            </label>
          </div>

          <div className="tokens-page__filter-group">
            <label className="tokens-page__filter-label">
              <span className="tokens-page__filter-label-text">Вес от</span>
              <input
                type="number"
                value={weightFrom}
                onChange={(e) => setWeightFrom(e.target.value)}
                placeholder="weight_from"
                className="tokens-page__filter-input"
                min="0"
                step="0.01"
              />
            </label>
          </div>

          <div className="tokens-page__filter-group">
            <label className="tokens-page__filter-label">
              <span className="tokens-page__filter-label-text">Вес до</span>
              <input
                type="number"
                value={weightTo}
                onChange={(e) => setWeightTo(e.target.value)}
                placeholder="weight_to"
                className="tokens-page__filter-input"
                min="0"
                step="0.01"
              />
            </label>
          </div>

          <div className="tokens-page__filter-group tokens-page__filter-group--checkbox">
            <label className="tokens-page__filter-label tokens-page__filter-label--checkbox">
              <input
                type="checkbox"
                checked={activeOnly}
                onChange={(e) => setActiveOnly(e.target.checked)}
                className="tokens-page__filter-checkbox"
              />
              <span>Только активные</span>
            </label>
          </div>

          <button
            className="tokens-page__filter-clear"
            onClick={handleClearFilters}
          >
            Очистить фильтры
          </button>
        </div>
      </div>

      {error && <div className="page__error">{error}</div>}

      <div className="page__content">
        {loading ? (
          <div className="page__loading">Загрузка...</div>
        ) : (
          <>
            <TokensTable tokens={tokens} onEdit={handleEdit} onDelete={handleDelete} onViewPrices={handleViewPrices} />
            {total > 0 && (
              <div className="tokens-page__pagination">
                <div className="tokens-page__pagination-info">
                  Показано {skip + 1}-{Math.min(skip + limit, total)} из {total}
                </div>
                <div className="tokens-page__pagination-controls">
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
