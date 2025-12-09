import { TournamentPrize } from '../api/types'
import './TournamentPrizesTable.css'

interface TournamentPrizesTableProps {
  prizes: TournamentPrize[]
  loading?: boolean
  onEdit: (prize: TournamentPrize) => void
  onDelete: (id: number) => void
}

export const TournamentPrizesTable = ({ prizes, loading, onEdit, onDelete }: TournamentPrizesTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU')
  }

  const formatAmount = (amount: string) => {
    if (amount.length > 20) {
      return `${amount.slice(0, 20)}...`
    }
    return amount
  }

  if (loading) {
    return (
      <div className="tournament-prizes-table">
        <div className="tournament-prizes-table__loading">Загрузка призов...</div>
      </div>
    )
  }

  return (
    <div className="tournament-prizes-table">
      {prizes.length === 0 ? (
        <div className="tournament-prizes-table__empty">Нет призов</div>
      ) : (
        <div className="tournament-prizes-table__container">
          <table className="tournament-prizes-table__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>ID турнира</th>
                <th>Позиция от</th>
                <th>Позиция до</th>
                <th>ID типа награды</th>
                <th>Сумма награды</th>
                <th>Создано</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {prizes.map((prize) => (
                <tr key={prize.id}>
                  <td>{prize.id}</td>
                  <td>{prize.tournament_id}</td>
                  <td>{prize.position_from}</td>
                  <td>{prize.position_to}</td>
                  <td>{prize.reward_type_id}</td>
                  <td className="tournament-prizes-table__amount" title={prize.reward_amount}>
                    {formatAmount(prize.reward_amount)}
                  </td>
                  <td>{formatDate(prize.created_at)}</td>
                  <td>
                    <div className="tournament-prizes-table__actions">
                      <button
                        className="tournament-prizes-table__button tournament-prizes-table__button--edit"
                        onClick={() => onEdit(prize)}
                      >
                        Редактировать
                      </button>
                      <button
                        className="tournament-prizes-table__button tournament-prizes-table__button--delete"
                        onClick={() => onDelete(prize.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
