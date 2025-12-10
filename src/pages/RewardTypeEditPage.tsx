import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { rewardTypesApi } from '../api/rewardTypesApi'
import { RewardType, CreateRewardTypeDto, UpdateRewardTypeDto } from '../api/types'
import { RewardTypeForm } from '../components/RewardTypeForm'
import './Page.css'
import './RewardTypeEditPage.css'

export const RewardTypeEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [rewardType, setRewardType] = useState<RewardType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isEditMode = id !== undefined && id !== 'new'

  useEffect(() => {
    if (isEditMode && id) {
      loadRewardType()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadRewardType = async () => {
    if (!id || id === 'new') return

    try {
      setLoading(true)
      setError('')
      const data = await rewardTypesApi.getById(Number(id))
      setRewardType(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке типа награды')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: CreateRewardTypeDto | UpdateRewardTypeDto) => {
    try {
      if (isEditMode && rewardType) {
        await rewardTypesApi.update(rewardType.id, data as UpdateRewardTypeDto)
      } else {
        await rewardTypesApi.create(data as CreateRewardTypeDto)
      }
      navigate('/reward-types')
    } catch (err) {
      throw err // Пробрасываем ошибку в RewardTypeForm
    }
  }

  const handleCancel = () => {
    navigate('/reward-types')
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
      <div className="reward-type-edit-page__form-container">
        <RewardTypeForm rewardType={rewardType} onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  )
}
