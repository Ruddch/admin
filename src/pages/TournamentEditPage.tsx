import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tournamentsApi } from '../api/tournamentsApi'
import { Tournament, CreateTournamentDto, UpdateTournamentDto } from '../api/types'
import { TournamentForm } from '../components/TournamentForm'
import './Page.css'
import './TournamentEditPage.css'

export const TournamentEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isEditMode = id !== undefined && id !== 'new'

  useEffect(() => {
    if (isEditMode && id) {
      loadTournament()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadTournament = async () => {
    if (!id || id === 'new') return

    try {
      setLoading(true)
      setError('')
      const data = await tournamentsApi.getById(Number(id))
      setTournament(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке турнира')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: CreateTournamentDto | UpdateTournamentDto) => {
    try {
      if (isEditMode && tournament) {
        await tournamentsApi.update(tournament.id, data as UpdateTournamentDto)
      } else {
        await tournamentsApi.create(data as CreateTournamentDto)
      }
      navigate('/tournaments')
    } catch (err) {
      throw err // Пробрасываем ошибку в TournamentForm
    }
  }

  const handleCancel = () => {
    navigate('/tournaments')
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
      <div className="tournament-edit-page__form-container">
        <TournamentForm tournament={tournament} onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  )
}
