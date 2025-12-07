import { Tournament, CreateTournamentDto, UpdateTournamentDto } from './types'
import { apiClient } from './apiClient'

export interface TournamentsFilters {
  status_filter?: string | null
  active_only?: boolean
}

export const tournamentsApi = {
  getAll: async (filters?: TournamentsFilters): Promise<Tournament[]> => {
    const params = new URLSearchParams()
    
    if (filters?.status_filter !== undefined && filters.status_filter !== null && filters.status_filter !== '') {
      params.append('status_filter', filters.status_filter)
    }
    if (filters?.active_only !== undefined) {
      params.append('active_only', String(filters.active_only))
    }
    
    const queryString = params.toString()
    const url = queryString ? `/panel/tournaments/?${queryString}` : '/panel/tournaments/'
    
    return apiClient<Tournament[]>(url, {
      method: 'GET',
    })
  },

  getById: async (id: number): Promise<Tournament> => {
    return apiClient<Tournament>(`/panel/tournaments/${id}`, {
      method: 'GET',
    })
  },

  create: async (data: CreateTournamentDto): Promise<Tournament> => {
    return apiClient<Tournament>('/panel/tournaments/', {
      method: 'POST',
      body: data,
    })
  },

  update: async (id: number, data: UpdateTournamentDto): Promise<Tournament> => {
    return apiClient<Tournament>(`/panel/tournaments/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  getStatsSummary: async (): Promise<string> => {
    return apiClient<string>('/panel/tournaments/stats/summary', {
      method: 'GET',
    })
  },
}

