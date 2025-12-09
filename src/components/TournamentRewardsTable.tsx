import { TournamentReward } from '../api/types'
import './TournamentRewardsTable.css'

interface TournamentRewardsTableProps {
  rewards: TournamentReward[]
  loading?: boolean
}

export const TournamentRewardsTable = ({ rewards, loading }: TournamentRewardsTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU')
  }

  const formatAmount = (amount: string) => {
    // Форматируем большое число для лучшей читаемости
    if (amount.length > 20) {
      return `${amount.slice(0, 20)}...`
    }
    return amount
  }

  if (loading) {
    return (
      <div className="tournament-rewards-table">
        <div className="tournament-rewards-table__loading">Загрузка призов...</div>
      </div>
    )
  }

  return (
    <div className="tournament-rewards-table">
      {rewards.length === 0 ? (
        <div className="tournament-rewards-table__empty">Нет призов</div>
      ) : (
        <div className="tournament-rewards-table__container">
          <table className="tournament-rewards-table__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Позиция от</th>
                <th>Позиция до</th>
                <th>ID типа награды</th>
                <th>Сумма награды</th>
                <th>Создано</th>
              </tr>
            </thead>
            <tbody>
              {rewards.map((reward) => (
                <tr key={reward.id}>
                  <td>{reward.id}</td>
                  <td>{reward.position_from}</td>
                  <td>{reward.position_to}</td>
                  <td>{reward.reward_type_id}</td>
                  <td className="tournament-rewards-table__amount" title={reward.reward_amount}>
                    {formatAmount(reward.reward_amount)}
                  </td>
                  <td>{formatDate(reward.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
