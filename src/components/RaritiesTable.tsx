import { Rarity } from '../api/types'
import './RaritiesTable.css'

interface RaritiesTableProps {
  rarities: Rarity[]
  onEdit: (rarity: Rarity) => void
  onDelete: (id: number) => void
}

export const RaritiesTable = ({ rarities, onEdit, onDelete }: RaritiesTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU')
  }

  return (
    <div className="rarities-table">
      <table className="rarities-table__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Описание</th>
            <th>Бонус к очкам</th>
            <th>Цвет</th>
            <th>Активна</th>
            <th>Создана</th>
            <th>Обновлена</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {rarities.length === 0 ? (
            <tr>
              <td colSpan={9} className="rarities-table__empty">
                Нет рарностей
              </td>
            </tr>
          ) : (
            rarities.map((rarity) => (
              <tr key={rarity.id}>
                <td>{rarity.id}</td>
                <td>
                  <span
                    style={{
                      color: rarity.color,
                      fontWeight: 600,
                    }}
                  >
                    {rarity.name}
                  </span>
                </td>
                <td>{rarity.description}</td>
                <td>{rarity.score_bonus}</td>
                <td>
                  <div className="rarities-table__color">
                    <span
                      className="rarities-table__color-swatch"
                      style={{ backgroundColor: rarity.color }}
                    />
                    <span>{rarity.color}</span>
                  </div>
                </td>
                <td>
                  <span
                    className={`rarities-table__status ${
                      rarity.is_active
                        ? 'rarities-table__status--active'
                        : 'rarities-table__status--inactive'
                    }`}
                  >
                    {rarity.is_active ? 'Да' : 'Нет'}
                  </span>
                </td>
                <td>{formatDate(rarity.created_at)}</td>
                <td>{formatDate(rarity.updated_at)}</td>
                <td>
                  <div className="rarities-table__actions">
                    <button
                      className="rarities-table__button rarities-table__button--edit"
                      onClick={() => onEdit(rarity)}
                    >
                      Редактировать
                    </button>
                    <button
                      className="rarities-table__button rarities-table__button--delete"
                      onClick={() => onDelete(rarity.id)}
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
