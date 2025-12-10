import { useState, useEffect } from 'react'
import { TournamentPrize, CreateTournamentPrizeDto, UpdateTournamentPrizeDto, Tournament, RewardType } from '../api/types'
import { tournamentsApi } from '../api/tournamentsApi'
import { rewardTypesApi } from '../api/rewardTypesApi'
import './TournamentPrizeForm.css'

interface TournamentPrizeFormProps {
  prize?: TournamentPrize | null
  tournamentId?: number
  onSubmit: (data: CreateTournamentPrizeDto | UpdateTournamentPrizeDto) => Promise<void>
  onCancel: () => void
}

export const TournamentPrizeForm = ({ prize, tournamentId, onSubmit, onCancel }: TournamentPrizeFormProps) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loadingTournaments, setLoadingTournaments] = useState(true)
  const [rewardTypes, setRewardTypes] = useState<RewardType[]>([])
  const [loadingRewardTypes, setLoadingRewardTypes] = useState(true)
  const [formData, setFormData] = useState<CreateTournamentPrizeDto>({
    tournament_id: tournamentId || 0,
    position_from: 0,
    position_to: 0,
    reward_type_id: 0,
    reward_amount: 0,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!tournamentId) {
      loadTournaments()
    }
    loadRewardTypes()
  }, [tournamentId])

  useEffect(() => {
    if (prize) {
      setFormData({
        tournament_id: prize.tournament_id,
        position_from: prize.position_from,
        position_to: prize.position_to,
        reward_type_id: prize.reward_type_id,
        reward_amount: Number(prize.reward_amount) || 0,
      })
    } else {
      setFormData({
        tournament_id: tournamentId || 0,
        position_from: 0,
        position_to: 0,
        reward_type_id: 0,
        reward_amount: 0,
      })
    }
  }, [prize, tournamentId])

  const loadTournaments = async () => {
    try {
      setLoadingTournaments(true)
      const data = await tournamentsApi.getAll(undefined, 0, 1000) // Загружаем много турниров для выбора
      setTournaments(data.items)
    } catch (err) {
      console.error('Ошибка при загрузке турниров:', err)
    } finally {
      setLoadingTournaments(false)
    }
  }

  const loadRewardTypes = async () => {
    try {
      setLoadingRewardTypes(true)
      const data = await rewardTypesApi.getAll(0, 1000) // Загружаем много типов наград для выбора
      setRewardTypes(data.items)
    } catch (err) {
      console.error('Ошибка при загрузке типов наград:', err)
    } finally {
      setLoadingRewardTypes(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.tournament_id || formData.tournament_id <= 0) {
      setError('Укажите ID турнира')
      return
    }

    if (!formData.reward_type_id || formData.reward_type_id <= 0) {
      setError('Выберите тип награды')
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при сохранении')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  return (
    <form className="tournament-prize-form" onSubmit={handleSubmit}>
      <h3 className="tournament-prize-form__title">{prize ? 'Редактировать приз' : 'Создать приз'}</h3>

      {error && <div className="tournament-prize-form__error">{error}</div>}

      {!tournamentId && (
        <div className="tournament-prize-form__field">
          <label htmlFor="tournament_id">Турнир *</label>
          <select
            id="tournament_id"
            name="tournament_id"
            value={formData.tournament_id}
            onChange={handleChange}
            required
            disabled={loadingTournaments}
          >
            <option value={0}>Выберите турнир</option>
            {tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                Турнир #{tournament.tournament_number} ({tournament.status})
              </option>
            ))}
          </select>
          {loadingTournaments && <span className="tournament-prize-form__loading">Загрузка турниров...</span>}
        </div>
      )}

      <div className="tournament-prize-form__field">
        <label htmlFor="position_from">Позиция от *</label>
        <input
          id="position_from"
          name="position_from"
          type="number"
          value={formData.position_from}
          onChange={handleChange}
          required
          min="0"
          step="1"
          placeholder="Введите позицию от"
        />
      </div>

      <div className="tournament-prize-form__field">
        <label htmlFor="position_to">Позиция до *</label>
        <input
          id="position_to"
          name="position_to"
          type="number"
          value={formData.position_to}
          onChange={handleChange}
          required
          min="0"
          step="1"
          placeholder="Введите позицию до"
        />
      </div>

      <div className="tournament-prize-form__field">
        <label htmlFor="reward_type_id">ID типа награды *</label>
        <select
          id="reward_type_id"
          name="reward_type_id"
          value={formData.reward_type_id}
          onChange={handleChange}
          required
          disabled={loadingRewardTypes}
        >
          <option value={0}>Выберите тип награды</option>
          {rewardTypes.map((rewardType) => (
            <option key={rewardType.id} value={rewardType.id}>
              {rewardType.name} ({rewardType.reward_category})
            </option>
          ))}
        </select>
        {loadingRewardTypes && <span className="tournament-prize-form__loading">Загрузка типов наград...</span>}
      </div>

      <div className="tournament-prize-form__field">
        <label htmlFor="reward_amount">Сумма награды *</label>
        <input
          id="reward_amount"
          name="reward_amount"
          type="number"
          value={formData.reward_amount}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          placeholder="Введите сумму награды"
        />
      </div>

      <div className="tournament-prize-form__actions">
        <button
          type="button"
          className="tournament-prize-form__button tournament-prize-form__button--cancel"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="tournament-prize-form__button tournament-prize-form__button--submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : prize ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  )
}
