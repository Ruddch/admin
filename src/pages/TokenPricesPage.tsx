import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tokensApi } from '../api/tokensApi'
import { Token, TokenPrice } from '../api/types'
import { TokenPricesTable } from '../components/TokenPricesTable'
import './Page.css'
import './TokenPricesPage.css'

const DEFAULT_LIMIT = 20

export const TokenPricesPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [token, setToken] = useState<Token | null>(null)
  const [prices, setPrices] = useState<TokenPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [skip, setSkip] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const [hasNext, setHasNext] = useState<boolean>(false)
  const [hasPrev, setHasPrev] = useState<boolean>(false)

  useEffect(() => {
    if (id) {
      loadToken()
      loadPrices()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (id) {
      loadPrices()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip])

  const loadToken = async () => {
    if (!id) return

    try {
      const data = await tokensApi.getById(Number(id))
      setToken(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке токена')
    }
  }

  const loadPrices = async () => {
    if (!id) return

    try {
      setLoading(true)
      setError('')
      const data = await tokensApi.getPrices(Number(id), skip, DEFAULT_LIMIT)
      setPrices(data.items)
      setTotal(data.total)
      setHasNext(data.has_next)
      setHasPrev(data.has_prev)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке цен')
    } finally {
      setLoading(false)
    }
  }

  const handleNextPage = () => {
    if (hasNext) {
      setSkip((prev) => prev + DEFAULT_LIMIT)
    }
  }

  const handlePrevPage = () => {
    if (hasPrev) {
      setSkip((prev) => Math.max(0, prev - DEFAULT_LIMIT))
    }
  }

  const handleBack = () => {
    navigate('/tokens')
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">
          История цен {token && `- ${token.name} (${token.symbol})`}
        </h1>
        <button className="page__button" onClick={handleBack}>
          Назад к списку
        </button>
      </div>

      {error && <div className="page__error">{error}</div>}

      <div className="page__content">
        <TokenPricesTable prices={prices} loading={loading} />
        {total > 0 && (
          <div className="token-prices-page__pagination">
            <div className="token-prices-page__pagination-info">
              Показано {skip + 1}-{Math.min(skip + DEFAULT_LIMIT, total)} из {total}
            </div>
            <div className="token-prices-page__pagination-controls">
              <button
                className="page__button"
                onClick={handlePrevPage}
                disabled={!hasPrev || loading}
              >
                Предыдущая
              </button>
              <button
                className="page__button"
                onClick={handleNextPage}
                disabled={!hasNext || loading}
              >
                Следующая
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
