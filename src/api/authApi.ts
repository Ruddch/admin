import { apiConfig } from './config'

export interface LoginDto {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: 'bearer'
  expires_in: number
}

export const authApi = {
  login: async (data: LoginDto): Promise<LoginResponse> => {
    const response = await fetch(`${apiConfig.baseURL}/panel/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Ошибка авторизации' }))
      throw new Error(error.message || 'Ошибка авторизации')
    }

    return response.json()
  },

  logout: async (): Promise<void> => {
    // TODO: Реализовать POST запрос для выхода, если есть endpoint
  },

  refreshToken: async (): Promise<{ token: string }> => {
    // TODO: Реализовать POST запрос для обновления токена, если есть endpoint
    throw new Error('Not implemented')
  },
}

