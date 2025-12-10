import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { rewardTypesApi } from '../api/rewardTypesApi'
import { RewardType } from '../api/types'
import { RewardTypesTable } from '../components/RewardTypesTable'
import './Page.css'
import './RewardTypesPage.css'

const DEFAULT_LIMIT = 20

export const RewardTypesPage = () => {
  const navigate = useNavigate()
  const [rewardTypes, setRewardTypes] = useState<RewardType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [skip, setSkip] = useState<number>(0)
  const [limit] = useState<number>(DEFAULT_LIMIT)
  const [total, setTotal] = useState<number>(0)
  const [hasNext, setHasNext] = useState<boolean>(false)
  const [hasPrev, setHasPrev] = useState<boolean>(false)

  useEffect(() => {
    loadRewardTypes()
  }, [skip])

  const loadRewardTypes = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await rewardTypesApi.getAll(skip, limit)
      
      // Проверяем, что данные в правильном формате
      if (!data || !Array.isArray(data.items)) {
        throw new Error('Неверный формат данных от сервера')
      }
      
      setRewardTypes(data.items || [])
      setTotal(data.total || 0)
      setHasNext(data.has_next || false)
      setHasPrev(data.has_prev || false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке типов наград')
      setRewardTypes([])
      setTotal(0)
      setHasNext(false)
      setHasPrev(false)
    } finally {
      setLoading(false)
    }
  }

  const handleNextPage = () => {
    if (hasNext) {
      setSkip((prev) => prev + limit)
    }
  }

  const handlePrevPage = () => {
    if (hasPrev) {
      setSkip((prev) => Math.max(0, prev - limit))
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот тип награды?')) {
      return
    }

    try {
      await rewardTypesApi.delete(id)
      await loadRewardTypes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при удалении типа награды')
    }
  }

  const handleEdit = (rewardType: RewardType) => {
    navigate(`/reward-types/${rewardType.id}`)
  }

  const handleCreate = () => {
    navigate('/reward-types/new')
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Reward Types Settings</h1>
        <div className="page__actions">
          <button
            className="page__button page__button--primary"
            onClick={handleCreate}
          >
            Создать тип награды
          </button>
        </div>
      </div>

      {error && <div className="page__error">{error}</div>}

      <div className="page__content">
        {loading ? (
          <div className="page__loading">Загрузка...</div>
        ) : (
          <>
            <RewardTypesTable rewardTypes={rewardTypes} onEdit={handleEdit} onDelete={handleDelete} />
            {total > 0 && (
              <div className="reward-types-page__pagination">
                <div className="reward-types-page__pagination-info">
                  Показано {skip + 1}-{Math.min(skip + limit, total)} из {total}
                </div>
                <div className="reward-types-page__pagination-controls">
                  <button
                    className="page__button"
                    onClick={handlePrevPage}
                    disabled={!hasPrev || loading}
                  >
                    Предыдущая
                  </button>
                  <button
                    className="page__button"
                    onClick={handleNextPage}
                    disabled={!hasNext || loading}
                  >
                    Следующая
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
