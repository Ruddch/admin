import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tournamentsApi } from '../api/tournamentsApi'
import { Tournament, TournamentPrize, CreateTournamentPrizeDto, UpdateTournamentPrizeDto } from '../api/types'
import { TournamentDecksTable } from '../components/TournamentDecksTable'
import { TournamentRewardsTable } from '../components/TournamentRewardsTable'
import { TournamentPrizesTable } from '../components/TournamentPrizesTable'
import { TournamentPrizeForm } from '../components/TournamentPrizeForm'
import './Page.css'
import './TournamentDetailsPage.css'

const DEFAULT_LIMIT = 20

type TabType = 'decks' | 'rewards' | 'prizes'

export const TournamentDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('decks')
  const [decks, setDecks] = useState<any[]>([])
  const [rewards, setRewards] = useState<any[]>([])
  const [prizes, setPrizes] = useState<TournamentPrize[]>([])
  const [loading, setLoading] = useState(true)
  const [decksLoading, setDecksLoading] = useState(true)
  const [rewardsLoading, setRewardsLoading] = useState(true)
  const [prizesLoading, setPrizesLoading] = useState(true)
  const [error, setError] = useState('')
  const [decksSkip, setDecksSkip] = useState<number>(0)
  const [rewardsSkip, setRewardsSkip] = useState<number>(0)
  const [prizesSkip, setPrizesSkip] = useState<number>(0)
  const [decksTotal, setDecksTotal] = useState<number>(0)
  const [rewardsTotal, setRewardsTotal] = useState<number>(0)
  const [prizesTotal, setPrizesTotal] = useState<number>(0)
  const [decksHasNext, setDecksHasNext] = useState<boolean>(false)
  const [rewardsHasNext, setRewardsHasNext] = useState<boolean>(false)
  const [prizesHasNext, setPrizesHasNext] = useState<boolean>(false)
  const [decksHasPrev, setDecksHasPrev] = useState<boolean>(false)
  const [rewardsHasPrev, setRewardsHasPrev] = useState<boolean>(false)
  const [prizesHasPrev, setPrizesHasPrev] = useState<boolean>(false)
  const [editingPrize, setEditingPrize] = useState<TournamentPrize | null>(null)
  const [showPrizeForm, setShowPrizeForm] = useState(false)

  useEffect(() => {
    if (id) {
      loadTournament()
      loadDecks()
      loadRewards()
      loadPrizes()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (id && activeTab === 'decks') {
      loadDecks()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decksSkip, activeTab])

  useEffect(() => {
    if (id && activeTab === 'rewards') {
      loadRewards()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewardsSkip, activeTab])

  useEffect(() => {
    if (id && activeTab === 'prizes') {
      loadPrizes()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prizesSkip, activeTab])

  const loadTournament = async () => {
    if (!id) return

    try {
      setLoading(true)
      setError('')
      const data = await tournamentsApi.getById(Number(id))
      setTournament(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке турнира')
    } finally {
      setLoading(false)
    }
  }

  const loadDecks = async () => {
    if (!id) return

    try {
      setDecksLoading(true)
      const data = await tournamentsApi.getDecks(Number(id), decksSkip, DEFAULT_LIMIT)
      setDecks(data.items)
      setDecksTotal(data.total)
      setDecksHasNext(data.has_next)
      setDecksHasPrev(data.has_prev)
    } catch (err) {
      console.error('Ошибка при загрузке колод:', err)
    } finally {
      setDecksLoading(false)
    }
  }

  const loadRewards = async () => {
    if (!id) return

    try {
      setRewardsLoading(true)
      const data = await tournamentsApi.getResults(Number(id), rewardsSkip, DEFAULT_LIMIT)
      setRewards(data.items)
      setRewardsTotal(data.total)
      setRewardsHasNext(data.has_next)
      setRewardsHasPrev(data.has_prev)
    } catch (err) {
      console.error('Ошибка при загрузке призов:', err)
    } finally {
      setRewardsLoading(false)
    }
  }

  const handleDecksNextPage = () => {
    if (decksHasNext) {
      setDecksSkip((prev) => prev + DEFAULT_LIMIT)
    }
  }

  const handleDecksPrevPage = () => {
    if (decksHasPrev) {
      setDecksSkip((prev) => Math.max(0, prev - DEFAULT_LIMIT))
    }
  }

  const handleRewardsNextPage = () => {
    if (rewardsHasNext) {
      setRewardsSkip((prev) => prev + DEFAULT_LIMIT)
    }
  }

  const handleRewardsPrevPage = () => {
    if (rewardsHasPrev) {
      setRewardsSkip((prev) => Math.max(0, prev - DEFAULT_LIMIT))
    }
  }

  const loadPrizes = async () => {
    if (!id) return

    try {
      setPrizesLoading(true)
      const data = await tournamentsApi.getPrizes(Number(id), prizesSkip, DEFAULT_LIMIT)
      setPrizes(data.items)
      setPrizesTotal(data.total)
      setPrizesHasNext(data.has_next)
      setPrizesHasPrev(data.has_prev)
    } catch (err) {
      console.error('Ошибка при загрузке призов:', err)
    } finally {
      setPrizesLoading(false)
    }
  }

  const handlePrizesNextPage = () => {
    if (prizesHasNext) {
      setPrizesSkip((prev) => prev + DEFAULT_LIMIT)
    }
  }

  const handlePrizesPrevPage = () => {
    if (prizesHasPrev) {
      setPrizesSkip((prev) => Math.max(0, prev - DEFAULT_LIMIT))
    }
  }

  const handleCreatePrize = () => {
    setEditingPrize(null)
    setShowPrizeForm(true)
  }

  const handleEditPrize = (prize: TournamentPrize) => {
    setEditingPrize(prize)
    setShowPrizeForm(true)
  }

  const handleDeletePrize = async (prizeId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот приз?')) {
      return
    }

    try {
      await tournamentsApi.deletePrize(prizeId)
      await loadPrizes()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка при удалении приза')
    }
  }

  const handlePrizeSubmit = async (data: CreateTournamentPrizeDto | UpdateTournamentPrizeDto) => {
    try {
      if (editingPrize) {
        await tournamentsApi.updatePrize(editingPrize.id, data as UpdateTournamentPrizeDto)
      } else {
        await tournamentsApi.createPrize(data as CreateTournamentPrizeDto)
      }
      await loadPrizes()
      setShowPrizeForm(false)
      setEditingPrize(null)
    } catch (err) {
      throw err
    }
  }

  const handlePrizeCancel = () => {
    setShowPrizeForm(false)
    setEditingPrize(null)
  }

  const handleBack = () => {
    navigate('/tournaments')
  }


  if (loading) {
    return (
      <div className="page">
        <div className="page__loading">Загрузка...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <div className="page__error">{error}</div>
        <button className="page__button" onClick={handleBack}>
          Вернуться к списку
        </button>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">
          Детали турнира {tournament && `#${tournament.tournament_number}`}
        </h1>
        <button className="page__button" onClick={handleBack}>
          Назад к списку
        </button>
      </div>

      <div className="tournament-details">
        <div className="tournament-details__tabs">
          <button
            className={`tournament-details__tab ${activeTab === 'decks' ? 'tournament-details__tab--active' : ''}`}
            onClick={() => setActiveTab('decks')}
          >
            Колоды
          </button>
          <button
            className={`tournament-details__tab ${activeTab === 'rewards' ? 'tournament-details__tab--active' : ''}`}
            onClick={() => setActiveTab('rewards')}
          >
            Результаты
          </button>
          <button
            className={`tournament-details__tab ${activeTab === 'prizes' ? 'tournament-details__tab--active' : ''}`}
            onClick={() => setActiveTab('prizes')}
          >
            Управление призами
          </button>
        </div>

        {activeTab === 'decks' && (
          <div className="tournament-details__section">
            <h2 className="tournament-details__section-title">Колоды</h2>
            <TournamentDecksTable decks={decks} loading={decksLoading} />
            {decksTotal > 0 && (
              <div className="tournament-details__pagination">
                <div className="tournament-details__pagination-info">
                  Показано {decksSkip + 1}-{Math.min(decksSkip + DEFAULT_LIMIT, decksTotal)} из {decksTotal}
                </div>
                <div className="tournament-details__pagination-controls">
                  <button
                    className="page__button"
                    onClick={handleDecksPrevPage}
                    disabled={!decksHasPrev || decksLoading}
                  >
                    Предыдущая
                  </button>
                  <button
                    className="page__button"
                    onClick={handleDecksNextPage}
                    disabled={!decksHasNext || decksLoading}
                  >
                    Следующая
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="tournament-details__section">
            <h2 className="tournament-details__section-title">Результаты</h2>
            <TournamentRewardsTable rewards={rewards} loading={rewardsLoading} />
            {rewardsTotal > 0 && (
              <div className="tournament-details__pagination">
                <div className="tournament-details__pagination-info">
                  Показано {rewardsSkip + 1}-{Math.min(rewardsSkip + DEFAULT_LIMIT, rewardsTotal)} из {rewardsTotal}
                </div>
                <div className="tournament-details__pagination-controls">
                  <button
                    className="page__button"
                    onClick={handleRewardsPrevPage}
                    disabled={!rewardsHasPrev || rewardsLoading}
                  >
                    Предыдущая
                  </button>
                  <button
                    className="page__button"
                    onClick={handleRewardsNextPage}
                    disabled={!rewardsHasNext || rewardsLoading}
                  >
                    Следующая
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'prizes' && (
          <div className="tournament-details__section">
            <div className="tournament-details__section-header">
              <h2 className="tournament-details__section-title">Управление призами</h2>
              <button
                className="page__button page__button--primary"
                onClick={handleCreatePrize}
              >
                Создать приз
              </button>
            </div>

            {showPrizeForm && tournament && (
              <div className="tournament-details__form-container">
                <TournamentPrizeForm
                  prize={editingPrize}
                  tournamentId={tournament.id}
                  onSubmit={handlePrizeSubmit}
                  onCancel={handlePrizeCancel}
                />
              </div>
            )}

            <TournamentPrizesTable
              prizes={prizes}
              loading={prizesLoading}
              onEdit={handleEditPrize}
              onDelete={handleDeletePrize}
            />
            {prizesTotal > 0 && (
              <div className="tournament-details__pagination">
                <div className="tournament-details__pagination-info">
                  Показано {prizesSkip + 1}-{Math.min(prizesSkip + DEFAULT_LIMIT, prizesTotal)} из {prizesTotal}
                </div>
                <div className="tournament-details__pagination-controls">
                  <button
                    className="page__button"
                    onClick={handlePrizesPrevPage}
                    disabled={!prizesHasPrev || prizesLoading}
                  >
                    Предыдущая
                  </button>
                  <button
                    className="page__button"
                    onClick={handlePrizesNextPage}
                    disabled={!prizesHasNext || prizesLoading}
                  >
                    Следующая
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
