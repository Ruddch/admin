import { Card, CreateCardDto, UpdateCardDto, PaginatedResponse } from './types'
import { apiClient } from './apiClient'

export interface CardsFilters {
  active_only?: boolean
  token_id?: number | null
  rarity?: string | null
}

export const cardsApi = {
  getAll: async (filters?: CardsFilters, skip?: number, limit?: number): Promise<PaginatedResponse<Card>> => {
    const params = new URLSearchParams()
    
    if (filters?.active_only !== undefined) {
      params.append('active_only', String(filters.active_only))
    }
    if (filters?.token_id !== undefined && filters.token_id !== null) {
      params.append('token_id', String(filters.token_id))
    }
    if (filters?.rarity !== undefined && filters.rarity !== null && filters.rarity !== '') {
      params.append('rarity', filters.rarity)
    }
    if (skip !== undefined) {
      params.append('skip', String(skip))
    }
    if (limit !== undefined) {
      params.append('limit', String(limit))
    }
    
    const queryString = params.toString()
    const url = queryString ? `/management/cards/?${queryString}` : '/management/cards/'
    
    return apiClient<PaginatedResponse<Card>>(url, {
      method: 'GET',
    })
  },

  getById: async (id: number): Promise<Card> => {
    return apiClient<Card>(`/management/cards/${id}`, {
      method: 'GET',
    })
  },

  create: async (data: CreateCardDto): Promise<Card> => {
    return apiClient<Card>('/management/cards/', {
      method: 'POST',
      body: data,
    })
  },

  update: async (id: number, data: UpdateCardDto): Promise<Card> => {
    return apiClient<Card>(`/management/cards/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  delete: async (id: number): Promise<string> => {
    return apiClient<string>(`/management/cards/${id}`, {
      method: 'DELETE',
    })
  },

  activate: async (id: number): Promise<string> => {
    return apiClient<string>(`/management/cards/${id}/activate`, {
      method: 'POST',
    })
  },

  getReferenceOptions: async (): Promise<string> => {
    return apiClient<string>('/management/cards/reference/options', {
      method: 'GET',
    })
  },
}

