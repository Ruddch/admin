import { apiConfig } from './config'
import { cookies } from '../utils/cookies'

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  body?: unknown
  token?: string | null
}

const TOKEN_COOKIE = 'admin_access_token'

export const apiClient = async <T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const { method = 'GET', headers = {}, body, token } = options

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  }

  // Берем токен из cookies, если не передан явно
  const authToken = token ?? cookies.get(TOKEN_COOKIE)
  if (authToken) {
    requestHeaders['Authorization'] = `Bearer ${authToken}`
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  }

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`${apiConfig.baseURL}${endpoint}`, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Ошибка запроса' }))
    throw new Error(error.message || `Ошибка ${response.status}`)
  }

  return response.json()
}

