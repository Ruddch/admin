import { Token, CreateTokenDto, UpdateTokenDto, PaginatedResponse, TokenPrice } from './types'
import { apiClient } from './apiClient'

export const tokensApi = {
  getAll: async (
    activeOnly?: boolean,
    skip?: number,
    limit?: number,
    name?: string | null,
    symbol?: string | null,
    weightFrom?: number | null,
    weightTo?: number | null
  ): Promise<PaginatedResponse<Token>> => {
    const params = new URLSearchParams()
    if (activeOnly !== undefined) {
      params.append('active_only', String(activeOnly))
    }
    if (skip !== undefined) {
      params.append('skip', String(skip))
    }
    if (limit !== undefined) {
      params.append('limit', String(limit))
    }
    if (name !== undefined && name !== null && name !== '') {
      params.append('name', name)
    }
    if (symbol !== undefined && symbol !== null && symbol !== '') {
      params.append('symbol', symbol)
    }
    if (weightFrom !== undefined && weightFrom !== null) {
      params.append('weight_from', String(weightFrom))
    }
    if (weightTo !== undefined && weightTo !== null) {
      params.append('weight_to', String(weightTo))
    }
    const queryString = params.toString()
    const url = queryString ? `/panel/tokens/?${queryString}` : '/panel/tokens/'
    
    return apiClient<PaginatedResponse<Token>>(url, {
      method: 'GET',
    })
  },

  getById: async (id: number): Promise<Token> => {
    return apiClient<Token>(`/panel/tokens/${id}`, {
      method: 'GET',
    })
  },

  create: async (data: CreateTokenDto): Promise<Token> => {
    return apiClient<Token>('/panel/tokens/', {
      method: 'POST',
      body: data,
    })
  },

  update: async (id: number, data: UpdateTokenDto): Promise<Token> => {
    return apiClient<Token>(`/panel/tokens/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  delete: async (id: number): Promise<void> => {
    return apiClient<void>(`/panel/tokens/${id}`, {
      method: 'DELETE',
    })
  },

  getSchedulerStatus: async (): Promise<string> => {
    return apiClient<string>('/panel/tokens/scheduler/status', {
      method: 'GET',
    })
  },

  triggerScheduler: async (): Promise<string> => {
    return apiClient<string>('/panel/tokens/scheduler/trigger', {
      method: 'POST',
    })
  },

  getPrices: async (tokenId: number, skip?: number, limit?: number): Promise<PaginatedResponse<TokenPrice>> => {
    const params = new URLSearchParams()
    if (skip !== undefined) {
      params.append('skip', String(skip))
    }
    if (limit !== undefined) {
      params.append('limit', String(limit))
    }
    const queryString = params.toString()
    const url = queryString 
      ? `/panel/tokens/${tokenId}/prices?${queryString}` 
      : `/panel/tokens/${tokenId}/prices`
    
    return apiClient<PaginatedResponse<TokenPrice>>(url, {
      method: 'GET',
    })
  },
}

