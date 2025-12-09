import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { raritiesApi } from '../api/raritiesApi'
import { Rarity } from '../api/types'
import { RaritiesTable } from '../components/RaritiesTable'
import './Page.css'
import './RaritiesPage.css'

const DEFAULT_LIMIT = 20

export const RaritiesPage = () => {
  const navigate = useNavigate()
  const [rarities, setRarities] = useState<Rarity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [skip, setSkip] = useState<number>(0)
  const [limit] = useState<number>(DEFAULT_LIMIT)
  const [total, setTotal] = useState<number>(0)
  const [hasNext, setHasNext] = useState<boolean>(false)
  const [hasPrev, setHasPrev] = useState<boolean>(false)

  useEffect(() => {
    loadRarities()
  }, [skip])

  const loadRarities = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await raritiesApi.getAll(skip, limit)
      setRarities(data.items)
      setTotal(data.total)
      setHasNext(data.has_next)
      setHasPrev(data.has_prev)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке рарностей')
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
    if (!confirm('Вы уверены, что хотите удалить эту рарность?')) {
      return
    }

    try {
      await raritiesApi.delete(id)
      await loadRarities()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при удалении рарности')
    }
  }

  const handleEdit = (rarity: Rarity) => {
    navigate(`/rarities/${rarity.id}`)
  }

  const handleCreate = () => {
    navigate('/rarities/new')
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Rarities Settings</h1>
        <div className="page__actions">
          <button
            className="page__button page__button--primary"
            onClick={handleCreate}
          >
            Создать рарность
          </button>
        </div>
      </div>

      {error && <div className="page__error">{error}</div>}

      <div className="page__content">
        {loading ? (
          <div className="page__loading">Загрузка...</div>
        ) : (
          <>
            <RaritiesTable rarities={rarities} onEdit={handleEdit} onDelete={handleDelete} />
            {total > 0 && (
              <div className="rarities-page__pagination">
                <div className="rarities-page__pagination-info">
                  Показано {skip + 1}-{Math.min(skip + limit, total)} из {total}
                </div>
                <div className="rarities-page__pagination-controls">
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
