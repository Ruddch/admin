import { useState, useEffect } from 'react'
import { User, UpdateUserDto } from '../api/types'
import './UserForm.css'

interface UserFormProps {
  user: User
  onSubmit: (data: UpdateUserDto) => Promise<void>
  onCancel: () => void
}

export const UserForm = ({ user, onSubmit, onCancel }: UserFormProps) => {
  const [formData, setFormData] = useState<UpdateUserDto>({
    nickname: '',
    referral_route: '',
    avatar_url: '',
    is_active: true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setFormData({
      nickname: user.nickname || '',
      referral_route: user.referral_route || '',
      avatar_url: user.avatar_url || '',
      is_active: user.is_active,
    })
  }, [user])

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h3 className="user-form__title">Редактировать пользователя</h3>

      <div className="user-form__info">
        <div className="user-form__info-item">
          <strong>ID:</strong> {user.id}
        </div>
        <div className="user-form__info-item">
          <strong>Кошелек:</strong> {user.wallet_address}
        </div>
        <div className="user-form__info-item">
          <strong>Дней с регистрации:</strong> {user.days_since_registration}
        </div>
      </div>

      {error && <div className="user-form__error">{error}</div>}

      <div className="user-form__field">
        <label htmlFor="nickname">Никнейм</label>
        <input
          id="nickname"
          name="nickname"
          type="text"
          value={formData.nickname}
          onChange={handleChange}
          placeholder="Введите никнейм"
        />
      </div>

      <div className="user-form__field">
        <label htmlFor="referral_route">Реферальная ссылка</label>
        <input
          id="referral_route"
          name="referral_route"
          type="text"
          value={formData.referral_route}
          onChange={handleChange}
          placeholder="Введите реферальную ссылку"
        />
      </div>

      <div className="user-form__field">
        <label htmlFor="avatar_url">URL аватара</label>
        <input
          id="avatar_url"
          name="avatar_url"
          type="url"
          value={formData.avatar_url}
          onChange={handleChange}
          placeholder="https://example.com/avatar.png"
        />
      </div>

      <div className="user-form__field user-form__field--checkbox">
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

      <div className="user-form__actions">
        <button
          type="button"
          className="user-form__button user-form__button--cancel"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="user-form__button user-form__button--submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </form>
  )
}

