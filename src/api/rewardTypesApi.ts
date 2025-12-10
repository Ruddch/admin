import { RewardType, CreateRewardTypeDto, UpdateRewardTypeDto, PaginatedResponse } from './types'
import { apiClient } from './apiClient'

export const rewardTypesApi = {
  getAll: async (skip?: number, limit?: number): Promise<PaginatedResponse<RewardType>> => {
    const params = new URLSearchParams()
    if (skip !== undefined) {
      params.append('skip', String(skip))
    }
    if (limit !== undefined) {
      params.append('limit', String(limit))
    }
    const queryString = params.toString()
    const url = queryString ? `/panel/reward-types/?${queryString}` : '/panel/reward-types/'
    
    return apiClient<PaginatedResponse<RewardType>>(url, {
      method: 'GET',
    })
  },

  getById: async (id: number): Promise<RewardType> => {
    return apiClient<RewardType>(`/panel/reward-types/${id}`, {
      method: 'GET',
    })
  },

  create: async (data: CreateRewardTypeDto): Promise<RewardType> => {
    return apiClient<RewardType>('/panel/reward-types/', {
      method: 'POST',
      body: data,
    })
  },

  update: async (id: number, data: UpdateRewardTypeDto): Promise<RewardType> => {
    return apiClient<RewardType>(`/panel/reward-types/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  delete: async (id: number): Promise<void> => {
    return apiClient<void>(`/panel/reward-types/${id}`, {
      method: 'DELETE',
    })
  },
}
