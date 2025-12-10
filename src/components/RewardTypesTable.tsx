import { RewardType } from '../api/types'
import './RewardTypesTable.css'

interface RewardTypesTableProps {
  rewardTypes: RewardType[]
  onEdit: (rewardType: RewardType) => void
  onDelete: (id: number) => void
}

export const RewardTypesTable = ({ rewardTypes, onEdit, onDelete }: RewardTypesTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU')
  }

  const formatAmount = (amount: string) => {
    if (amount.length > 20) {
      return `${amount.slice(0, 20)}...`
    }
    return amount
  }

  return (
    <div className="reward-types-table">
      <table className="reward-types-table__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Описание</th>
            <th>Категория</th>
            <th>Сумма по умолчанию</th>
            <th>Тип валюты</th>
            <th>Можно получить</th>
            <th>Истекает через (дней)</th>
            <th>Активен</th>
            <th>Создан</th>
            <th>Обновлен</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {rewardTypes.length === 0 ? (
            <tr>
              <td colSpan={12} className="reward-types-table__empty">
                Нет типов наград
              </td>
            </tr>
          ) : (
            rewardTypes.map((rewardType) => (
              <tr key={rewardType.id}>
                <td>{rewardType.id}</td>
                <td>{rewardType.name}</td>
                <td className="reward-types-table__description">{rewardType.description}</td>
                <td>{rewardType.reward_category}</td>
                <td className="reward-types-table__amount" title={rewardType.default_amount}>
                  {formatAmount(rewardType.default_amount)}
                </td>
                <td>{rewardType.currency_type}</td>
                <td>
                  <span
                    className={`reward-types-table__status ${
                      rewardType.is_claimable
                        ? 'reward-types-table__status--claimable'
                        : 'reward-types-table__status--not-claimable'
                    }`}
                  >
                    {rewardType.is_claimable ? 'Да' : 'Нет'}
                  </span>
                </td>
                <td>{rewardType.expires_after_days}</td>
                <td>
                  <span
                    className={`reward-types-table__status ${
                      rewardType.is_active
                        ? 'reward-types-table__status--active'
                        : 'reward-types-table__status--inactive'
                    }`}
                  >
                    {rewardType.is_active ? 'Да' : 'Нет'}
                  </span>
                </td>
                <td>{formatDate(rewardType.created_at)}</td>
                <td>{formatDate(rewardType.updated_at)}</td>
                <td>
                  <div className="reward-types-table__actions">
                    <button
                      className="reward-types-table__button reward-types-table__button--edit"
                      onClick={() => onEdit(rewardType)}
                    >
                      Редактировать
                    </button>
                    <button
                      className="reward-types-table__button reward-types-table__button--delete"
                      onClick={() => onDelete(rewardType.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
