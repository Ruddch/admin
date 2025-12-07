import { useState, useEffect } from 'react'
import { Tournament, CreateTournamentDto, UpdateTournamentDto } from '../api/types'
import './TournamentForm.css'

interface TournamentFormProps {
  tournament?: Tournament | null
  onSubmit: (data: CreateTournamentDto | UpdateTournamentDto) => Promise<void>
  onCancel: () => void
}

export const TournamentForm = ({ tournament, onSubmit, onCancel }: TournamentFormProps) => {
  const [formData, setFormData] = useState<CreateTournamentDto>({
    tournament_number: 0,
    status: 'registration',
    start_date: '',
    end_date: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (tournament) {
      // Преобразуем ISO дату в формат datetime-local (YYYY-MM-DDTHH:mm)
      const formatDateForInput = (isoDate: string) => {
        const date = new Date(isoDate)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`
      }

      setFormData({
        tournament_number: tournament.tournament_number,
        status: tournament.status,
        start_date: formatDateForInput(tournament.start_date),
        end_date: formatDateForInput(tournament.end_date),
      })
    } else {
      setFormData({
        tournament_number: 0,
        status: 'registration',
        start_date: '',
        end_date: '',
      })
    }
  }, [tournament])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.tournament_number || formData.tournament_number <= 0) {
      setError('Номер турнира должен быть больше 0')
      return
    }

    if (!formData.start_date || !formData.end_date) {
      setError('Заполните даты начала и окончания')
      return
    }

    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      setError('Дата окончания должна быть позже даты начала')
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
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'tournament_number' ? Number(value) : value,
    }))
  }

  return (
    <form className="tournament-form" onSubmit={handleSubmit}>
      <h3 className="tournament-form__title">
        {tournament ? 'Редактировать турнир' : 'Создать турнир'}
      </h3>

      {error && <div className="tournament-form__error">{error}</div>}

      <div className="tournament-form__field">
        <label htmlFor="tournament_number">Номер турнира *</label>
        <input
          id="tournament_number"
          name="tournament_number"
          type="number"
          value={formData.tournament_number}
          onChange={handleChange}
          required
          min="1"
          placeholder="Введите номер турнира"
        />
      </div>

      <div className="tournament-form__field">
        <label htmlFor="status">Статус *</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="registration">Регистрация</option>
          <option value="active">Активен</option>
          <option value="finished">Завершен</option>
        </select>
      </div>

      <div className="tournament-form__field">
        <label htmlFor="start_date">Дата начала *</label>
        <input
          id="start_date"
          name="start_date"
          type="datetime-local"
          value={formData.start_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="tournament-form__field">
        <label htmlFor="end_date">Дата окончания *</label>
        <input
          id="end_date"
          name="end_date"
          type="datetime-local"
          value={formData.end_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="tournament-form__actions">
        <button
          type="button"
          className="tournament-form__button tournament-form__button--cancel"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="tournament-form__button tournament-form__button--submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : tournament ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  )
}

