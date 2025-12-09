import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { raritiesApi } from '../api/raritiesApi'
import { Rarity, CreateRarityDto, UpdateRarityDto } from '../api/types'
import { RarityForm } from '../components/RarityForm'
import './Page.css'
import './RarityEditPage.css'

export const RarityEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [rarity, setRarity] = useState<Rarity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isEditMode = id !== undefined && id !== 'new'

  useEffect(() => {
    if (isEditMode && id) {
      loadRarity()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadRarity = async () => {
    if (!id || id === 'new') return

    try {
      setLoading(true)
      setError('')
      const data = await raritiesApi.getById(Number(id))
      setRarity(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке рарности')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: CreateRarityDto | UpdateRarityDto) => {
    try {
      if (isEditMode && rarity) {
        await raritiesApi.update(rarity.id, data as UpdateRarityDto)
      } else {
        await raritiesApi.create(data as CreateRarityDto)
      }
      navigate('/rarities')
    } catch (err) {
      throw err // Пробрасываем ошибку в RarityForm
    }
  }

  const handleCancel = () => {
    navigate('/rarities')
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
      <div className="rarity-edit-page__form-container">
        <RarityForm rarity={rarity} onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  )
}
