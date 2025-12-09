import { useState, useEffect } from 'react'
import { Rarity, CreateRarityDto, UpdateRarityDto } from '../api/types'
import './RarityForm.css'

interface RarityFormProps {
  rarity?: Rarity | null
  onSubmit: (data: CreateRarityDto | UpdateRarityDto) => Promise<void>
  onCancel: () => void
}

export const RarityForm = ({ rarity, onSubmit, onCancel }: RarityFormProps) => {
  const [formData, setFormData] = useState<CreateRarityDto>({
    name: '',
    description: '',
    score_bonus: 0,
    color: '#000000',
    is_active: true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (rarity) {
      setFormData({
        name: rarity.name,
        description: rarity.description,
        score_bonus: rarity.score_bonus,
        color: rarity.color,
        is_active: rarity.is_active,
      })
    } else {
      setFormData({
        name: '',
        description: '',
        score_bonus: 0,
        color: '#000000',
        is_active: true,
      })
    }
  }, [rarity])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await onSubmit(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при сохранении')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'score_bonus'
            ? Number(value)
            : value,
    }))
  }

  return (
    <form className="rarity-form" onSubmit={handleSubmit}>
      <h3 className="rarity-form__title">{rarity ? 'Редактировать рарность' : 'Создать рарность'}</h3>

      {error && <div className="rarity-form__error">{error}</div>}

      <div className="rarity-form__field">
        <label htmlFor="name">Название *</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Введите название"
        />
      </div>

      <div className="rarity-form__field">
        <label htmlFor="description">Описание *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Введите описание"
          rows={3}
        />
      </div>

      <div className="rarity-form__field">
        <label htmlFor="score_bonus">Бонус к очкам *</label>
        <input
          id="score_bonus"
          name="score_bonus"
          type="number"
          value={formData.score_bonus}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          placeholder="Введите бонус к очкам"
        />
      </div>

      <div className="rarity-form__field">
        <label htmlFor="color">Цвет *</label>
        <div className="rarity-form__color-input">
          <input
            id="color"
            name="color"
            type="color"
            value={formData.color}
            onChange={handleChange}
            required
            className="rarity-form__color-picker"
          />
          <input
            type="text"
            value={formData.color}
            onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
            placeholder="#000000"
            className="rarity-form__color-text"
          />
        </div>
      </div>

      <div className="rarity-form__field rarity-form__field--checkbox">
        <label htmlFor="is_active">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            checked={formData.is_active}
            onChange={handleChange}
          />
          <span>Активна</span>
        </label>
      </div>

      <div className="rarity-form__actions">
        <button
          type="button"
          className="rarity-form__button rarity-form__button--cancel"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="rarity-form__button rarity-form__button--submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : rarity ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  )
}
