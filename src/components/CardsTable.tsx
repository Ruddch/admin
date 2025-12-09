import { Card } from '../api/types'
import './CardsTable.css'

interface CardsTableProps {
  cards: Card[]
  onEdit: (card: Card) => void
  onDelete: (id: number) => void
  onActivate: (id: number) => void
}

export const CardsTable = ({ cards, onEdit, onDelete, onActivate }: CardsTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU')
  }

  return (
    <div className="cards-table">
      <table className="cards-table__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Токен</th>
            <th>Редкость</th>
            <th>Тип дизайна</th>
            <th>Фоновое изображение</th>
            <th>Активна</th>
            <th>Создана</th>
            <th>Обновлена</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {cards.length === 0 ? (
            <tr>
              <td colSpan={9} className="cards-table__empty">
                Нет карточек
              </td>
            </tr>
          ) : (
            cards.map((card) => (
              <tr key={card.id}>
                <td>{card.id}</td>
                <td>
                  <div className="cards-table__token">
                    <span className="cards-table__token-name">{card.token_name}</span>
                    <span className="cards-table__token-symbol">({card.token_symbol})</span>
                  </div>
                </td>
                <td>
                  <span
                    style={{
                      color: card.rarity_color || '#333',
                      fontWeight: 500,
                    }}
                  >
                    {card.rarity_name || card.rarity}
                  </span>
                </td>
                <td>{card.design_type}</td>
                <td>
                  {card.background_image_url ? (
                    <img
                      src={card.background_image_url}
                      alt="Background"
                      className="cards-table__image"
                    />
                  ) : (
                    <span className="cards-table__no-image">Нет</span>
                  )}
                </td>
                <td>
                  <span
                    className={`cards-table__status ${
                      card.is_active
                        ? 'cards-table__status--active'
                        : 'cards-table__status--inactive'
                    }`}
                  >
                    {card.is_active ? 'Да' : 'Нет'}
                  </span>
                </td>
                <td>{formatDate(card.created_at)}</td>
                <td>{formatDate(card.updated_at)}</td>
                <td>
                  <div className="cards-table__actions">
                    {!card.is_active && (
                      <button
                        className="cards-table__button cards-table__button--activate"
                        onClick={() => onActivate(card.id)}
                      >
                        Активировать
                      </button>
                    )}
                    <button
                      className="cards-table__button cards-table__button--edit"
                      onClick={() => onEdit(card)}
                    >
                      Редактировать
                    </button>
                    <button
                      className="cards-table__button cards-table__button--delete"
                      onClick={() => onDelete(card.id)}
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

