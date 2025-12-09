import { Token } from '../api/types'
import './TokensTable.css'

interface TokensTableProps {
  tokens: Token[]
  onEdit: (token: Token) => void
  onDelete: (id: number) => void
  onViewPrices: (token: Token) => void
}

export const TokensTable = ({ tokens, onEdit, onDelete, onViewPrices }: TokensTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU')
  }

  return (
    <div className="tokens-table">
      <table className="tokens-table__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Символ</th>
            <th>Вес</th>
            <th>Изображение</th>
            <th>Активен</th>
            <th>Создан</th>
            <th>Обновлен</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {tokens.length === 0 ? (
            <tr>
              <td colSpan={9} className="tokens-table__empty">
                Нет токенов
              </td>
            </tr>
          ) : (
            tokens.map((token) => (
              <tr key={token.id}>
                <td>{token.id}</td>
                <td>{token.name}</td>
                <td>{token.symbol}</td>
                <td>{token.weight}</td>
                <td>
                  {token.image_url ? (
                    <img
                      src={token.image_url}
                      alt={token.name}
                      className="tokens-table__image"
                    />
                  ) : (
                    <span className="tokens-table__no-image">Нет</span>
                  )}
                </td>
                <td>
                  <span
                    className={`tokens-table__status ${
                      token.is_active ? 'tokens-table__status--active' : 'tokens-table__status--inactive'
                    }`}
                  >
                    {token.is_active ? 'Да' : 'Нет'}
                  </span>
                </td>
                <td>{formatDate(token.created_at)}</td>
                <td>{formatDate(token.updated_at)}</td>
                <td>
                  <div className="tokens-table__actions">
                    <button
                      className="tokens-table__button tokens-table__button--edit"
                      onClick={() => onEdit(token)}
                    >
                      Редактировать
                    </button>
                    <button
                      className="tokens-table__button tokens-table__button--prices"
                      onClick={() => onViewPrices(token)}
                    >
                      История цен
                    </button>
                    <button
                      className="tokens-table__button tokens-table__button--delete"
                      onClick={() => onDelete(token.id)}
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

