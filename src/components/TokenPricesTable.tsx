import { TokenPrice } from '../api/types'
import './TokenPricesTable.css'

interface TokenPricesTableProps {
  prices: TokenPrice[]
  loading?: boolean
}

export const TokenPricesTable = ({ prices, loading }: TokenPricesTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU')
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  const formatPercent = (num: number) => {
    const sign = num >= 0 ? '+' : ''
    return `${sign}${num.toFixed(2)}%`
  }

  const getChangeClass = (change: number) => {
    if (change > 0) return 'token-prices-table__change--positive'
    if (change < 0) return 'token-prices-table__change--negative'
    return ''
  }

  if (loading) {
    return (
      <div className="token-prices-table">
        <div className="token-prices-table__loading">Загрузка цен...</div>
      </div>
    )
  }

  return (
    <div className="token-prices-table">
      <h3 className="token-prices-table__title">История цен</h3>
      {prices.length === 0 ? (
        <div className="token-prices-table__empty">Нет данных о ценах</div>
      ) : (
        <div className="token-prices-table__container">
          <table className="token-prices-table__table">
            <thead>
              <tr>
                <th>Цена</th>
                <th>Рыночная капитализация</th>
                <th>Изменение за 24ч</th>
                <th>Количество источников</th>
                <th>Время</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((price) => (
                <tr key={price.id}>
                  <td className="token-prices-table__price">{formatCurrency(price.price)}</td>
                  <td className="token-prices-table__market-cap">{formatNumber(price.market_cap)}</td>
                  <td>
                    <span className={`token-prices-table__change ${getChangeClass(price.change_24h)}`}>
                      {formatPercent(price.change_24h)}
                    </span>
                  </td>
                  <td>{price.sources_count}</td>
                  <td className="token-prices-table__timestamp">{formatDate(price.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
