import { useState, useEffect } from 'react'
import { Card, CreateCardDto, UpdateCardDto, Rarity } from '../api/types'
import { tokensApi } from '../api/tokensApi'
import { raritiesApi } from '../api/raritiesApi'
import { Token } from '../api/types'
import './CardForm.css'

interface CardFormProps {
  card?: Card | null
  onSubmit: (data: CreateCardDto | UpdateCardDto) => Promise<void>
  onCancel: () => void
}

export const CardForm = ({ card, onSubmit, onCancel }: CardFormProps) => {
  const [tokens, setTokens] = useState<Token[]>([])
  const [rarities, setRarities] = useState<Rarity[]>([])
  const [loadingTokens, setLoadingTokens] = useState(true)
  const [loadingRarities, setLoadingRarities] = useState(true)
  const [formData, setFormData] = useState<CreateCardDto>({
    token_id: 0,
    rarity_id: 0,
    design_type: '',
    background_image_url: '',
    is_active: true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTokens()
    loadRarities()
  }, [])

  useEffect(() => {
    if (card) {
      setFormData({
        token_id: card.token_id,
        rarity_id: card.rarity_id,
        design_type: card.design_type,
        background_image_url: card.background_image_url,
        is_active: card.is_active,
      })
    } else {
      setFormData({
        token_id: 0,
        rarity_id: 0,
        design_type: '',
        background_image_url: '',
        is_active: true,
      })
    }
  }, [card])

  const loadTokens = async () => {
    try {
      setLoadingTokens(true)
      const data = await tokensApi.getAll()
      setTokens(data.items)
    } catch (err) {
      console.error('Ошибка при загрузке токенов:', err)
    } finally {
      setLoadingTokens(false)
    }
  }

  const loadRarities = async () => {
    try {
      setLoadingRarities(true)
      const data = await raritiesApi.getAll()
      setRarities(data.items)
    } catch (err) {
      console.error('Ошибка при загрузке рарностей:', err)
    } finally {
      setLoadingRarities(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.token_id) {
      setError('Выберите токен')
      return
    }

    if (!formData.rarity_id) {
      setError('Выберите редкость')
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
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'token_id' || name === 'rarity_id'
            ? Number(value)
            : value,
    }))
  }

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <h3 className="card-form__title">{card ? 'Редактировать карточку' : 'Создать карточку'}</h3>

      {error && <div className="card-form__error">{error}</div>}

      <div className="card-form__field">
        <label htmlFor="token_id">Токен *</label>
        <select
          id="token_id"
          name="token_id"
          value={formData.token_id}
          onChange={handleChange}
          required
          disabled={loadingTokens}
        >
          <option value={0}>Выберите токен</option>
          {tokens.map((token) => (
            <option key={token.id} value={token.id}>
              {token.name} ({token.symbol})
            </option>
          ))}
        </select>
        {loadingTokens && <span className="card-form__loading">Загрузка токенов...</span>}
      </div>

      <div className="card-form__field">
        <label htmlFor="rarity_id">Редкость *</label>
        <select
          id="rarity_id"
          name="rarity_id"
          value={formData.rarity_id}
          onChange={handleChange}
          required
          disabled={loadingRarities}
        >
          <option value={0}>Выберите редкость</option>
          {rarities.map((rarity) => (
            <option key={rarity.id} value={rarity.id}>
              {rarity.name}
            </option>
          ))}
        </select>
        {loadingRarities && <span className="card-form__loading">Загрузка рарностей...</span>}
      </div>

      <div className="card-form__field">
        <label htmlFor="design_type">Тип дизайна *</label>
        <select
          id="design_type"
          name="design_type"
          value={formData.design_type}
          onChange={handleChange}
          required
        >
          <option value="">Выберите тип дизайна</option>
          <option value="classic">Classic</option>
          <option value="neon">Neon</option>
          <option value="retro">Retro</option>
          <option value="galaxy">Galaxy</option>
          <option value="minimalist">Minimalist</option>
          <option value="cyberpunk">Cyberpunk</option>
        </select>
      </div>

      <div className="card-form__field">
        <label htmlFor="background_image_url">URL фонового изображения</label>
        <input
          id="background_image_url"
          name="background_image_url"
          type="url"
          value={formData.background_image_url}
          onChange={handleChange}
          placeholder="https://example.com/image.png"
        />
      </div>

      <div className="card-form__field card-form__field--checkbox">
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

      <div className="card-form__actions">
        <button
          type="button"
          className="card-form__button card-form__button--cancel"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="card-form__button card-form__button--submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : card ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  )
}

