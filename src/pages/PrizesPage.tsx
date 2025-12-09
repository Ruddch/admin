import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { tournamentsApi } from '../api/tournamentsApi'
import { TournamentPrize } from '../api/types'
import { TournamentPrizesTable } from '../components/TournamentPrizesTable'
import './Page.css'
import './PrizesPage.css'

const DEFAULT_LIMIT = 20

export const PrizesPage = () => {
  const navigate = useNavigate()
  const [prizes, setPrizes] = useState<TournamentPrize[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [skip, setSkip] = useState<number>(0)
  const [limit] = useState<number>(DEFAULT_LIMIT)
  const [total, setTotal] = useState<number>(0)
  const [hasNext, setHasNext] = useState<boolean>(false)
  const [hasPrev, setHasPrev] = useState<boolean>(false)

  useEffect(() => {
    loadPrizes()
  }, [skip])

  const loadPrizes = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await tournamentsApi.getPrizes(null, skip, limit)
      setPrizes(data.items)
      setTotal(data.total)
      setHasNext(data.has_next)
      setHasPrev(data.has_prev)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке призов')
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
    if (!confirm('Вы уверены, что хотите удалить этот приз?')) {
      return
    }

    try {
      await tournamentsApi.deletePrize(id)
      await loadPrizes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при удалении приза')
    }
  }

  const handleEdit = (prize: TournamentPrize) => {
    navigate(`/prizes/${prize.id}`)
  }

  const handleCreate = () => {
    navigate('/prizes/new')
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Prizes Settings</h1>
        <div className="page__actions">
          <button
            className="page__button page__button--primary"
            onClick={handleCreate}
          >
            Создать приз
          </button>
        </div>
      </div>

      {error && <div className="page__error">{error}</div>}

      <div className="page__content">
        {loading ? (
          <div className="page__loading">Загрузка...</div>
        ) : (
          <>
            <TournamentPrizesTable prizes={prizes} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
            {total > 0 && (
              <div className="prizes-page__pagination">
                <div className="prizes-page__pagination-info">
                  Показано {skip + 1}-{Math.min(skip + limit, total)} из {total}
                </div>
                <div className="prizes-page__pagination-controls">
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
