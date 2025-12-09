import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tournamentsApi } from '../api/tournamentsApi'
import { TournamentPrize, CreateTournamentPrizeDto, UpdateTournamentPrizeDto } from '../api/types'
import { TournamentPrizeForm } from '../components/TournamentPrizeForm'
import './Page.css'
import './PrizeEditPage.css'

export const PrizeEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [prize, setPrize] = useState<TournamentPrize | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isEditMode = id !== undefined && id !== 'new'

  useEffect(() => {
    if (isEditMode && id) {
      loadPrize()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadPrize = async () => {
    if (!id || id === 'new') return

    try {
      setLoading(true)
      setError('')
      const data = await tournamentsApi.getPrizeById(Number(id))
      setPrize(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке приза')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: CreateTournamentPrizeDto | UpdateTournamentPrizeDto) => {
    try {
      if (isEditMode && prize) {
        await tournamentsApi.updatePrize(prize.id, data as UpdateTournamentPrizeDto)
      } else {
        await tournamentsApi.createPrize(data as CreateTournamentPrizeDto)
      }
      navigate('/prizes')
    } catch (err) {
      throw err // Пробрасываем ошибку в TournamentPrizeForm
    }
  }

  const handleCancel = () => {
    navigate('/prizes')
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
      <div className="prize-edit-page__form-container">
        <TournamentPrizeForm
          prize={prize}
          tournamentId={isEditMode && prize ? prize.tournament_id : undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
