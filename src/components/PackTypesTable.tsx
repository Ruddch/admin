import { PackType } from '../api/types'
import './PackTypesTable.css'

interface PackTypesTableProps {
  packTypes: PackType[]
  onEdit: (packType: PackType) => void
  onDelete: (id: number) => void
}

export const PackTypesTable = ({ packTypes, onEdit, onDelete }: PackTypesTableProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleString('ru-RU')
  }

  const formatPrice = (price: string) => {
    if (price.length > 20) {
      return `${price.slice(0, 20)}...`
    }
    return price
  }

  return (
    <div className="pack-types-table">
      <table className="pack-types-table__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Описание</th>
            <th>Карт в паке</th>
            <th>Цена</th>
            <th>Валюта</th>
            <th>Тираж</th>
            <th>Доступен с</th>
            <th>Доступен до</th>
            <th>Активен</th>
            <th>Создан</th>
            <th>Обновлен</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {packTypes.length === 0 ? (
            <tr>
              <td colSpan={13} className="pack-types-table__empty">
                Нет типов паков
              </td>
            </tr>
          ) : (
            packTypes.map((packType) => (
              <tr key={packType.id}>
                <td>{packType.id}</td>
                <td>{packType.name}</td>
                <td className="pack-types-table__description">{packType.description}</td>
                <td>{packType.cards_per_pack}</td>
                <td className="pack-types-table__price" title={packType.price}>
                  {formatPrice(packType.price)}
                </td>
                <td>{packType.currency}</td>
                <td>{packType.supply ?? '—'}</td>
                <td>{formatDate(packType.available_from)}</td>
                <td>{formatDate(packType.available_until)}</td>
                <td>
                  <span
                    className={`pack-types-table__status ${
                      packType.is_active
                        ? 'pack-types-table__status--active'
                        : 'pack-types-table__status--inactive'
                    }`}
                  >
                    {packType.is_active ? 'Да' : 'Нет'}
                  </span>
                </td>
                <td>{formatDate(packType.created_at)}</td>
                <td>{formatDate(packType.updated_at)}</td>
                <td>
                  <div className="pack-types-table__actions">
                    <button
                      className="pack-types-table__button pack-types-table__button--edit"
                      onClick={() => onEdit(packType)}
                    >
                      Редактировать
                    </button>
                    <button
                      className="pack-types-table__button pack-types-table__button--delete"
                      onClick={() => onDelete(packType.id)}
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

