import { Token, CreateTokenDto, UpdateTokenDto } from './types'
import { apiClient } from './apiClient'

export const tokensApi = {
  getAll: async (activeOnly?: boolean): Promise<Token[]> => {
    const params = new URLSearchParams()
    if (activeOnly !== undefined) {
      params.append('active_only', String(activeOnly))
    }
    const queryString = params.toString()
    const url = queryString ? `/panel/tokens/?${queryString}` : '/panel/tokens/'
    
    return apiClient<Token[]>(url, {
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
}

