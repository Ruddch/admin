import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { packTypesApi } from '../api/packTypesApi'
import { PackType } from '../api/types'
import { PackTypesTable } from '../components/PackTypesTable'
import './Page.css'
import './PackTypesPage.css'

const DEFAULT_LIMIT = 20

export const PackTypesPage = () => {
  const navigate = useNavigate()
  const [packTypes, setPackTypes] = useState<PackType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [skip, setSkip] = useState<number>(0)
  const [limit] = useState<number>(DEFAULT_LIMIT)
  const [total, setTotal] = useState<number>(0)
  const [hasNext, setHasNext] = useState<boolean>(false)
  const [hasPrev, setHasPrev] = useState<boolean>(false)

  useEffect(() => {
    loadPackTypes()
  }, [skip])

  const loadPackTypes = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await packTypesApi.getAll(skip, limit)
      setPackTypes(data.items)
      setTotal(data.total)
      setHasNext(data.has_next)
      setHasPrev(data.has_prev)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке типов паков')
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
    if (!confirm('Вы уверены, что хотите удалить этот тип пака?')) {
      return
    }

    try {
      await packTypesApi.delete(id)
      await loadPackTypes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при удалении типа пака')
    }
  }

  const handleEdit = (packType: PackType) => {
    navigate(`/pack-types/${packType.id}`)
  }

  const handleCreate = () => {
    navigate('/pack-types/new')
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Pack Types Settings</h1>
        <div className="page__actions">
          <button
            className="page__button page__button--primary"
            onClick={handleCreate}
          >
            Создать тип пака
          </button>
        </div>
      </div>

      {error && <div className="page__error">{error}</div>}

      <div className="page__content">
        {loading ? (
          <div className="page__loading">Загрузка...</div>
        ) : (
          <>
            <PackTypesTable packTypes={packTypes} onEdit={handleEdit} onDelete={handleDelete} />
            {total > 0 && (
              <div className="pack-types-page__pagination">
                <div className="pack-types-page__pagination-info">
                  Показано {skip + 1}-{Math.min(skip + limit, total)} из {total}
                </div>
                <div className="pack-types-page__pagination-controls">
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
