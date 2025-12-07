import { useState, useEffect } from 'react'
import { tournamentsApi, TournamentsFilters } from '../api/tournamentsApi'
import { Tournament, CreateTournamentDto, UpdateTournamentDto } from '../api/types'
import { TournamentsTable } from '../components/TournamentsTable'
import { TournamentForm } from '../components/TournamentForm'
import './Page.css'
import './TournamentsPage.css'

export const TournamentsPage = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [statsSummary, setStatsSummary] = useState<string>('')
  const [filters, setFilters] = useState<TournamentsFilters>({
    status_filter: null,
    active_only: false,
  })

  useEffect(() => {
    loadTournaments()
    loadStatsSummary()
  }, [filters])

  const loadTournaments = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await tournamentsApi.getAll(filters)
      setTournaments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке турниров')
    } finally {
      setLoading(false)
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

  const handleCreate = async (data: CreateTournamentDto | UpdateTournamentDto) => {
    await tournamentsApi.create(data as CreateTournamentDto)
    await loadTournaments()
    await loadStatsSummary()
    setShowForm(false)
  }

  const handleUpdate = async (data: CreateTournamentDto | UpdateTournamentDto) => {
    if (!editingTournament) return
    await tournamentsApi.update(editingTournament.id, data as UpdateTournamentDto)
    await loadTournaments()
    await loadStatsSummary()
    setEditingTournament(null)
    setShowForm(false)
  }

  const handleEdit = (tournament: Tournament) => {
    setEditingTournament(tournament)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingTournament(null)
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
            onClick={() => {
              setEditingTournament(null)
              setShowForm(true)
            }}
          >
            Создать турнир
          </button>
        </div>
      </div>

      {error && <div className="page__error">{error}</div>}

      {showForm && (
        <div className="tournaments-page__form-container">
          <TournamentForm
            tournament={editingTournament}
            onSubmit={editingTournament ? handleUpdate : handleCreate}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div className="page__content">
        {loading ? (
          <div className="page__loading">Загрузка...</div>
        ) : (
          <TournamentsTable tournaments={tournaments} onEdit={handleEdit} />
        )}
      </div>
    </div>
  )
}
