import { User, UpdateUserDto } from './types'
import { apiClient } from './apiClient'

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    return apiClient<User[]>('/panel/users/', {
      method: 'GET',
    })
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

