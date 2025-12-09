import { Rarity, CreateRarityDto, UpdateRarityDto, PaginatedResponse } from './types'
import { apiClient } from './apiClient'

export const raritiesApi = {
  getAll: async (skip?: number, limit?: number): Promise<PaginatedResponse<Rarity>> => {
    const params = new URLSearchParams()
    if (skip !== undefined) {
      params.append('skip', String(skip))
    }
    if (limit !== undefined) {
      params.append('limit', String(limit))
    }
    const queryString = params.toString()
    const url = queryString ? `/panel/rarities/?${queryString}` : '/panel/rarities/'
    
    return apiClient<PaginatedResponse<Rarity>>(url, {
      method: 'GET',
    })
  },

  getById: async (id: number): Promise<Rarity> => {
    return apiClient<Rarity>(`/panel/rarities/${id}`, {
      method: 'GET',
    })
  },

  create: async (data: CreateRarityDto): Promise<Rarity> => {
    return apiClient<Rarity>('/panel/rarities/', {
      method: 'POST',
      body: data,
    })
  },

  update: async (id: number, data: UpdateRarityDto): Promise<Rarity> => {
    return apiClient<Rarity>(`/panel/rarities/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  delete: async (id: number): Promise<void> => {
    return apiClient<void>(`/panel/rarities/${id}`, {
      method: 'DELETE',
    })
  },
}
