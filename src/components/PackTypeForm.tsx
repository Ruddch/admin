import { useState, useEffect } from 'react'
import { PackType, CreatePackTypeDto, UpdatePackTypeDto } from '../api/types'
import './PackTypeForm.css'

interface PackTypeFormProps {
  packType?: PackType | null
  onSubmit: (data: CreatePackTypeDto | UpdatePackTypeDto) => Promise<void>
  onCancel: () => void
}

export const PackTypeForm = ({ packType, onSubmit, onCancel }: PackTypeFormProps) => {
  const [formData, setFormData] = useState<CreatePackTypeDto>({
    name: '',
    description: '',
    image_url: '',
    header_image_url: '',
    cards_per_pack: 0,
    price: 0,
    currency: '',
    supply: undefined,
    available_from: undefined,
    available_until: undefined,
    guaranteed_slots: undefined,
    is_active: true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (packType) {
      const formatDateForInput = (isoDate: string | null | undefined) => {
        if (!isoDate) return undefined
        const date = new Date(isoDate)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`
      }

      setFormData({
        name: packType.name,
        description: packType.description,
        image_url: packType.image_url,
        header_image_url: packType.header_image_url,
        cards_per_pack: packType.cards_per_pack,
        price: Number(packType.price) || 0,
        currency: packType.currency,
        supply: packType.supply ?? undefined,
        available_from: formatDateForInput(packType.available_from),
        available_until: formatDateForInput(packType.available_until),
        guaranteed_slots: packType.guaranteed_slots || undefined,
        is_active: packType.is_active,
      })
    } else {
      setFormData({
        name: '',
        description: '',
        image_url: '',
        header_image_url: '',
        cards_per_pack: 0,
        price: 0,
        currency: '',
        supply: undefined,
        available_from: undefined,
        available_until: undefined,
        guaranteed_slots: undefined,
        is_active: true,
      })
    }
  }, [packType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // Удаляем пустые необязательные поля перед отправкой
      const dataToSubmit: CreatePackTypeDto | UpdatePackTypeDto = {
        ...formData,
        supply: formData.supply === undefined ? undefined : formData.supply,
        available_from: formData.available_from || undefined,
        available_until: formData.available_until || undefined,
        guaranteed_slots: formData.guaranteed_slots || undefined,
      }
      await onSubmit(dataToSubmit)
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
            ? (value === '' ? undefined : Number(value))
            : type === 'datetime-local'
              ? (value === '' ? undefined : value)
              : value === ''
                ? undefined
                : value,
    }))
  }

  return (
    <form className="pack-type-form" onSubmit={handleSubmit}>
      <h3 className="pack-type-form__title">{packType ? 'Редактировать тип пака' : 'Создать тип пака'}</h3>

      {error && <div className="pack-type-form__error">{error}</div>}

      <div className="pack-type-form__field">
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

      <div className="pack-type-form__field">
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

      <div className="pack-type-form__field">
        <label htmlFor="image_url">URL изображения *</label>
        <input
          id="image_url"
          name="image_url"
          type="url"
          value={formData.image_url}
          onChange={handleChange}
          required
          placeholder="https://example.com/image.png"
        />
      </div>

      <div className="pack-type-form__field">
        <label htmlFor="header_image_url">URL изображения заголовка *</label>
        <input
          id="header_image_url"
          name="header_image_url"
          type="url"
          value={formData.header_image_url}
          onChange={handleChange}
          required
          placeholder="https://example.com/header.png"
        />
      </div>

      <div className="pack-type-form__field">
        <label htmlFor="cards_per_pack">Карт в паке *</label>
        <input
          id="cards_per_pack"
          name="cards_per_pack"
          type="number"
          value={formData.cards_per_pack}
          onChange={handleChange}
          required
          min="1"
          step="1"
          placeholder="Введите количество карт"
        />
      </div>

      <div className="pack-type-form__field">
        <label htmlFor="price">Цена *</label>
        <input
          id="price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          placeholder="Введите цену"
        />
      </div>

      <div className="pack-type-form__field">
        <label htmlFor="currency">Валюта *</label>
        <input
          id="currency"
          name="currency"
          type="text"
          value={formData.currency}
          onChange={handleChange}
          required
          placeholder="Введите валюту"
        />
      </div>

      <div className="pack-type-form__field">
        <label htmlFor="supply">Тираж</label>
        <input
          id="supply"
          name="supply"
          type="number"
          value={formData.supply ?? ''}
          onChange={handleChange}
          min="0"
          step="1"
          placeholder="Введите тираж (необязательно)"
        />
      </div>

      <div className="pack-type-form__field">
        <label htmlFor="available_from">Доступен с</label>
        <input
          id="available_from"
          name="available_from"
          type="datetime-local"
          value={formData.available_from ?? ''}
          onChange={handleChange}
        />
      </div>

      <div className="pack-type-form__field">
        <label htmlFor="available_until">Доступен до</label>
        <input
          id="available_until"
          name="available_until"
          type="datetime-local"
          value={formData.available_until ?? ''}
          onChange={handleChange}
        />
      </div>

      <div className="pack-type-form__field">
        <label htmlFor="guaranteed_slots">Гарантированные слоты</label>
        <input
          id="guaranteed_slots"
          name="guaranteed_slots"
          type="text"
          value={formData.guaranteed_slots ?? ''}
          onChange={handleChange}
          placeholder="Введите гарантированные слоты (необязательно)"
        />
      </div>

      <div className="pack-type-form__field pack-type-form__field--checkbox">
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

      <div className="pack-type-form__actions">
        <button
          type="button"
          className="pack-type-form__button pack-type-form__button--cancel"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="pack-type-form__button pack-type-form__button--submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : packType ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  )
}
