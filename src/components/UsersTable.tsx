import { User } from '../api/types'
import './UsersTable.css'

interface UsersTableProps {
  users: User[]
  onEdit: (user: User) => void
}

export const UsersTable = ({ users, onEdit }: UsersTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU')
  }

  return (
    <div className="users-table">
      <table className="users-table__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Никнейм</th>
            <th>Кошелек</th>
            <th>Реферальная ссылка</th>
            <th>Аватар</th>
            <th>Активен</th>
            <th>Дней с регистрации</th>
            <th>Создан</th>
            <th>Обновлен</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={10} className="users-table__empty">
                Нет пользователей
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nickname || '-'}</td>
                <td>
                  <div className="users-table__wallet">
                    <span className="users-table__wallet-short" title={user.wallet_address}>
                      {user.wallet_short}
                    </span>
                  </div>
                </td>
                <td>{user.referral_route || '-'}</td>
                <td>
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.nickname}
                      className="users-table__avatar"
                    />
                  ) : (
                    <span className="users-table__no-avatar">Нет</span>
                  )}
                </td>
                <td>
                  <span
                    className={`users-table__status ${
                      user.is_active
                        ? 'users-table__status--active'
                        : 'users-table__status--inactive'
                    }`}
                  >
                    {user.is_active ? 'Да' : 'Нет'}
                  </span>
                </td>
                <td>{user.days_since_registration}</td>
                <td>{formatDate(user.created_at)}</td>
                <td>{formatDate(user.updated_at)}</td>
                <td>
                  <button
                    className="users-table__button users-table__button--edit"
                    onClick={() => onEdit(user)}
                  >
                    Редактировать
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

