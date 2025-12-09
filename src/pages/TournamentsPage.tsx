import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { tournamentsApi, TournamentsFilters } from '../api/tournamentsApi'
import { Tournament } from '../api/types'
import { TournamentsTable } from '../components/TournamentsTable'
import './Page.css'
import './TournamentsPage.css'

const DEFAULT_LIMIT = 20

export const TournamentsPage = () => {
  const navigate = useNavigate()
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statsSummary, setStatsSummary] = useState<string>('')
  const [filters, setFilters] = useState<TournamentsFilters>({
    status_filter: null,
    active_only: false,
  })
  const [skip, setSkip] = useState<number>(0)
  const [limit] = useState<number>(DEFAULT_LIMIT)
  const [total, setTotal] = useState<number>(0)
  const [hasNext, setHasNext] = useState<boolean>(false)
  const [hasPrev, setHasPrev] = useState<boolean>(false)

  useEffect(() => {
    setSkip(0) // Сбрасываем на первую страницу при изменении фильтра
  }, [filters])

  useEffect(() => {
    loadTournaments()
    loadStatsSummary()
  }, [filters, skip])

  const loadTournaments = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await tournamentsApi.getAll(filters, skip, limit)
      setTournaments(data.items)
      setTotal(data.total)
      setHasNext(data.has_next)
      setHasPrev(data.has_prev)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке турниров')
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

  const loadStatsSummary = async () => {
    try {
      const summary = await tournamentsApi.getStatsSummary()
      // Преобразуем объект в строку, если это объект
      setStatsSummary(typeof summary === 'string' ? summary : JSON.stringify(summary))
    } catch (err) {
      console.error('Ошибка при загрузке статистики:', err)
    }
  }

  const handleEdit = (tournament: Tournament) => {
    navigate(`/tournaments/${tournament.id}`)
  }

  const handleViewDetails = (tournament: Tournament) => {
    navigate(`/tournaments/${tournament.id}/details`)
  }

  const handleCreate = () => {
    navigate('/tournaments/new')
  }

  const handleFilterChange = (key: keyof TournamentsFilters, value: string | boolean | null) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      status_filter: null,
      active_only: false,
    })
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Tournaments Settings</h1>
        <div className="page__actions">
          <div className="tournaments-page__filters">
            <select
              className="tournaments-page__filter-select"
              value={filters.status_filter || ''}
              onChange={(e) => handleFilterChange('status_filter', e.target.value || null)}
            >
              <option value="">Все статусы</option>
              <option value="registration">Регистрация</option>
              <option value="ongoing">Активен</option>
              <option value="finished">Завершен</option>
            </select>
            <label className="tournaments-page__filter-label">
              <input
                type="checkbox"
                checked={filters.active_only || false}
                onChange={(e) => handleFilterChange('active_only', e.target.checked)}
                className="tournaments-page__filter-checkbox"
              />
              <span>Только активные</span>
            </label>
            {(filters.status_filter || filters.active_only) && (
              <button
                className="tournaments-page__filter-clear"
                onClick={clearFilters}
                title="Очистить фильтры"
              >
                ✕
              </button>
            )}
          </div>
          {statsSummary && (
            <div className="tournaments-page__stats">
              <span className="tournaments-page__stats-text">{statsSummary}</span>
            </div>
          )}
          <button
            className="page__button page__button--primary"
            onClick={handleCreate}
          >
            Создать турнир
          </button>
        </div>
      </div>

      {error && <div className="page__error">{error}</div>}

      <div className="page__content">
        {loading ? (
          <div className="page__loading">Загрузка...</div>
        ) : (
          <>
            <TournamentsTable tournaments={tournaments} onEdit={handleEdit} onViewDetails={handleViewDetails} />
            {total > 0 && (
              <div className="tournaments-page__pagination">
                <div className="tournaments-page__pagination-info">
                  Показано {skip + 1}-{Math.min(skip + limit, total)} из {total}
                </div>
                <div className="tournaments-page__pagination-controls">
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
