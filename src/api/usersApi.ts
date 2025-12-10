import { User, UpdateUserDto, PaginatedResponse } from './types'
import { apiClient } from './apiClient'

export const usersApi = {
  getAll: async (skip?: number, limit?: number): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams()
    if (skip !== undefined) {
      params.append('skip', String(skip))
    }
    if (limit !== undefined) {
      params.append('limit', String(limit))
    }
    const queryString = params.toString()
    const url = queryString ? `/panel/users/?${queryString}` : '/panel/users/'
    
    const response = await apiClient<PaginatedResponse<User> | User[]>(url, {
      method: 'GET',
    })

    // Обработка случая, когда API возвращает старый формат (массив)
    if (Array.isArray(response)) {
      return {
        items: response,
        total: response.length,
        skip: skip || 0,
        limit: limit || response.length,
        has_next: false,
        has_prev: false,
      }
    }

    // Новый формат с пагинацией
    return response
  },

  getById: async (id: number): Promise<User> => {
    return apiClient<User>(`/panel/users/${id}`, {
      method: 'GET',
    })
  },

  update: async (id: number, data: UpdateUserDto): Promise<User> => {
    return apiClient<User>(`/panel/users/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  getStatsSummary: async (): Promise<string> => {
    return apiClient<string>('/panel/users/stats/summary', {
      method: 'GET',
    })
  },

  searchDuplicates: async (): Promise<string> => {
    return apiClient<string>('/panel/users/search/duplicates', {
      method: 'GET',
    })
  },
}

