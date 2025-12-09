import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { packTypesApi } from '../api/packTypesApi'
import { PackType, CreatePackTypeDto, UpdatePackTypeDto } from '../api/types'
import { PackTypeForm } from '../components/PackTypeForm'
import './Page.css'
import './PackTypeEditPage.css'

export const PackTypeEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [packType, setPackType] = useState<PackType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isEditMode = id !== undefined && id !== 'new'

  useEffect(() => {
    if (isEditMode && id) {
      loadPackType()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadPackType = async () => {
    if (!id || id === 'new') return

    try {
      setLoading(true)
      setError('')
      const data = await packTypesApi.getById(Number(id))
      setPackType(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке типа пака')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: CreatePackTypeDto | UpdatePackTypeDto) => {
    try {
      if (isEditMode && packType) {
        await packTypesApi.update(packType.id, data as UpdatePackTypeDto)
      } else {
        await packTypesApi.create(data as CreatePackTypeDto)
      }
      navigate('/pack-types')
    } catch (err) {
      throw err // Пробрасываем ошибку в PackTypeForm
    }
  }

  const handleCancel = () => {
    navigate('/pack-types')
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
      <div className="pack-type-edit-page__form-container">
        <PackTypeForm packType={packType} onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  )
}
