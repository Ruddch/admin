import { useState, useEffect } from 'react'
import { Token, CreateTokenDto, UpdateTokenDto } from '../api/types'
import './TokenForm.css'

interface TokenFormProps {
  token?: Token | null
  onSubmit: (data: CreateTokenDto | UpdateTokenDto) => Promise<void>
  onCancel: () => void
}

export const TokenForm = ({ token, onSubmit, onCancel }: TokenFormProps) => {
  const [formData, setFormData] = useState<CreateTokenDto>({
    name: '',
    symbol: '',
    weight: 0,
    image_url: '',
    is_active: true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (token) {
      setFormData({
        name: token.name,
        symbol: token.symbol,
        weight: token.weight,
        image_url: token.image_url,
        is_active: token.is_active,
      })
    } else {
      setFormData({
        name: '',
        symbol: '',
        weight: 0,
        image_url: '',
        is_active: true,
      })
    }
  }, [token])

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
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }))
  }

  return (
    <form className="token-form" onSubmit={handleSubmit}>
      <h3 className="token-form__title">{token ? 'Редактировать токен' : 'Создать токен'}</h3>

      {error && <div className="token-form__error">{error}</div>}

      <div className="token-form__field">
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

      <div className="token-form__field">
        <label htmlFor="symbol">Символ *</label>
        <input
          id="symbol"
          name="symbol"
          type="text"
          value={formData.symbol}
          onChange={handleChange}
          required
          placeholder="Введите символ"
        />
      </div>

      <div className="token-form__field">
        <label htmlFor="weight">Вес *</label>
        <input
          id="weight"
          name="weight"
          type="number"
          value={formData.weight}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          placeholder="Введите вес"
        />
      </div>

      <div className="token-form__field">
        <label htmlFor="image_url">URL изображения</label>
        <input
          id="image_url"
          name="image_url"
          type="url"
          value={formData.image_url}
          onChange={handleChange}
          placeholder="https://example.com/image.png"
        />
      </div>

      <div className="token-form__field token-form__field--checkbox">
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

      <div className="token-form__actions">
        <button
          type="button"
          className="token-form__button token-form__button--cancel"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="token-form__button token-form__button--submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : token ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  )
}

