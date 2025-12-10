import { useState, useEffect } from 'react'
import { RewardType, CreateRewardTypeDto, UpdateRewardTypeDto } from '../api/types'
import './RewardTypeForm.css'

interface RewardTypeFormProps {
  rewardType?: RewardType | null
  onSubmit: (data: CreateRewardTypeDto | UpdateRewardTypeDto) => Promise<void>
  onCancel: () => void
}

export const RewardTypeForm = ({ rewardType, onSubmit, onCancel }: RewardTypeFormProps) => {
  const [formData, setFormData] = useState<CreateRewardTypeDto>({
    name: '',
    description: '',
    reward_category: '',
    default_amount: 0,
    currency_type: '',
    is_claimable: true,
    expires_after_days: 0,
    is_active: true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (rewardType) {
      setFormData({
        name: rewardType.name,
        description: rewardType.description,
        reward_category: rewardType.reward_category,
        default_amount: Number(rewardType.default_amount) || 0,
        currency_type: rewardType.currency_type,
        is_claimable: rewardType.is_claimable,
        expires_after_days: rewardType.expires_after_days,
        is_active: rewardType.is_active,
      })
    } else {
      setFormData({
        name: '',
        description: '',
        reward_category: '',
        default_amount: 0,
        currency_type: '',
        is_claimable: true,
        expires_after_days: 0,
        is_active: true,
      })
    }
  }, [rewardType])

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
          : type === 'number'
            ? Number(value)
            : value,
    }))
  }

  return (
    <form className="reward-type-form" onSubmit={handleSubmit}>
      <h3 className="reward-type-form__title">
        {rewardType ? 'Редактировать тип награды' : 'Создать тип награды'}
      </h3>

      {error && <div className="reward-type-form__error">{error}</div>}

      <div className="reward-type-form__field">
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

      <div className="reward-type-form__field">
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

      <div className="reward-type-form__field">
        <label htmlFor="reward_category">Категория награды *</label>
        <input
          id="reward_category"
          name="reward_category"
          type="text"
          value={formData.reward_category}
          onChange={handleChange}
          required
          placeholder="Введите категорию"
        />
      </div>

      <div className="reward-type-form__field">
        <label htmlFor="default_amount">Сумма по умолчанию *</label>
        <input
          id="default_amount"
          name="default_amount"
          type="number"
          value={formData.default_amount}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          placeholder="Введите сумму"
        />
      </div>

      <div className="reward-type-form__field">
        <label htmlFor="currency_type">Тип валюты *</label>
        <input
          id="currency_type"
          name="currency_type"
          type="text"
          value={formData.currency_type}
          onChange={handleChange}
          required
          placeholder="Введите тип валюты"
        />
      </div>

      <div className="reward-type-form__field">
        <label htmlFor="expires_after_days">Истекает через (дней) *</label>
        <input
          id="expires_after_days"
          name="expires_after_days"
          type="number"
          value={formData.expires_after_days}
          onChange={handleChange}
          required
          min="0"
          step="1"
          placeholder="Введите количество дней"
        />
      </div>

      <div className="reward-type-form__field reward-type-form__field--checkbox">
        <label htmlFor="is_claimable">
          <input
            id="is_claimable"
            name="is_claimable"
            type="checkbox"
            checked={formData.is_claimable}
            onChange={handleChange}
          />
          <span>Можно получить</span>
        </label>
      </div>

      <div className="reward-type-form__field reward-type-form__field--checkbox">
        <label htmlFor="is_active">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            checked={formData.is_active}
            onChange={handleChange}
          />
          <span>Активен</span>
        </label>
      </div>

      <div className="reward-type-form__actions">
        <button
          type="button"
          className="reward-type-form__button reward-type-form__button--cancel"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="reward-type-form__button reward-type-form__button--submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : rewardType ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  )
}
