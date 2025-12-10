import { PackType, CreatePackTypeDto, UpdatePackTypeDto, PaginatedResponse } from './types'
import { apiClient } from './apiClient'

export const packTypesApi = {
  getAll: async (skip?: number, limit?: number): Promise<PaginatedResponse<PackType>> => {
    const params = new URLSearchParams()
    if (skip !== undefined) {
      params.append('skip', String(skip))
    }
    if (limit !== undefined) {
      params.append('limit', String(limit))
    }
    const queryString = params.toString()
    const url = queryString ? `/panel/pack-types/?${queryString}` : '/panel/pack-types/'
    
    return apiClient<PaginatedResponse<PackType>>(url, {
      method: 'GET',
    })
  },

  getById: async (id: number): Promise<PackType> => {
    return apiClient<PackType>(`/panel/pack-types/${id}`, {
      method: 'GET',
    })
  },

  create: async (data: CreatePackTypeDto): Promise<PackType> => {
    return apiClient<PackType>('/panel/pack-types/', {
      method: 'POST',
      body: data,
    })
  },

  update: async (id: number, data: UpdatePackTypeDto): Promise<PackType> => {
    return apiClient<PackType>(`/panel/pack-types/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  delete: async (id: number): Promise<void> => {
    return apiClient<void>(`/panel/pack-types/${id}`, {
      method: 'DELETE',
    })
  },
}

