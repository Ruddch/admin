import { Tournament } from '../api/types'
import './TournamentsTable.css'

interface TournamentsTableProps {
  tournaments: Tournament[]
  onEdit: (tournament: Tournament) => void
  onViewDetails: (tournament: Tournament) => void
}

export const TournamentsTable = ({ tournaments, onEdit, onViewDetails }: TournamentsTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU')
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      registration: 'Регистрация',
      active: 'Активен',
      finished: 'Завершен',
    }
    return labels[status] || status
  }

  return (
    <div className="tournaments-table">
      <table className="tournaments-table__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Номер</th>
            <th>Статус</th>
            <th>Дата начала</th>
            <th>Дата окончания</th>
            <th>Длительность (дней)</th>
            <th>Активен</th>
            <th>Создан</th>
            <th>Обновлен</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {tournaments.length === 0 ? (
            <tr>
              <td colSpan={10} className="tournaments-table__empty">
                Нет турниров
              </td>
            </tr>
          ) : (
            tournaments.map((tournament) => (
              <tr key={tournament.id}>
                <td>{tournament.id}</td>
                <td>{tournament.tournament_number}</td>
                <td>
                  <span
                    className={`tournaments-table__status tournaments-table__status--${tournament.status}`}
                  >
                    {getStatusLabel(tournament.status)}
                  </span>
                </td>
                <td>{formatDate(tournament.start_date)}</td>
                <td>{formatDate(tournament.end_date)}</td>
                <td>{tournament.duration_days}</td>
                <td>
                  <span
                    className={`tournaments-table__status ${
                      tournament.is_active
                        ? 'tournaments-table__status--active'
                        : 'tournaments-table__status--inactive'
                    }`}
                  >
                    {tournament.is_active ? 'Да' : 'Нет'}
                  </span>
                </td>
                <td>{formatDate(tournament.created_at)}</td>
                <td>{formatDate(tournament.updated_at)}</td>
                <td>
                  <div className="tournaments-table__actions">
                    <button
                      className="tournaments-table__button tournaments-table__button--details"
                      onClick={() => onViewDetails(tournament)}
                    >
                      Детали
                    </button>
                    <button
                      className="tournaments-table__button tournaments-table__button--edit"
                      onClick={() => onEdit(tournament)}
                    >
                      Редактировать
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

