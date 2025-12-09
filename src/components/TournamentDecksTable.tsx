import { TournamentDeck } from '../api/types'
import './TournamentDecksTable.css'

interface TournamentDecksTableProps {
  decks: TournamentDeck[]
  loading?: boolean
}

export const TournamentDecksTable = ({ decks, loading }: TournamentDecksTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU')
  }

  if (loading) {
    return (
      <div className="tournament-decks-table">
        <div className="tournament-decks-table__loading">Загрузка колод...</div>
      </div>
    )
  }

  return (
    <div className="tournament-decks-table">
      {decks.length === 0 ? (
        <div className="tournament-decks-table__empty">Нет колод</div>
      ) : (
        <div className="tournament-decks-table__container">
          <table className="tournament-decks-table__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>ID пользователя</th>
                <th>Состав колоды</th>
                <th>Хеш колоды</th>
                <th>Валидна</th>
                <th>Активна</th>
                <th>Ошибки валидации</th>
                <th>Хеш транзакции</th>
                <th>Отправлена</th>
              </tr>
            </thead>
            <tbody>
              {decks.map((deck) => (
                <tr key={deck.id}>
                  <td>{deck.id}</td>
                  <td>{deck.user_id}</td>
                  <td className="tournament-decks-table__composition">{deck.deck_composition}</td>
                  <td className="tournament-decks-table__hash">{deck.deck_hash}</td>
                  <td>
                    <span
                      className={`tournament-decks-table__status ${
                        deck.is_valid
                          ? 'tournament-decks-table__status--valid'
                          : 'tournament-decks-table__status--invalid'
                      }`}
                    >
                      {deck.is_valid ? 'Да' : 'Нет'}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`tournament-decks-table__status ${
                        deck.is_active
                          ? 'tournament-decks-table__status--active'
                          : 'tournament-decks-table__status--inactive'
                      }`}
                    >
                      {deck.is_active ? 'Да' : 'Нет'}
                    </span>
                  </td>
                  <td className="tournament-decks-table__errors">
                    {deck.validation_errors || '-'}
                  </td>
                  <td className="tournament-decks-table__hash">{deck.transaction_hash || '-'}</td>
                  <td>{formatDate(deck.submitted_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
