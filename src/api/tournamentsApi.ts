import { Tournament, CreateTournamentDto, UpdateTournamentDto, PaginatedResponse, TournamentDeck, TournamentReward, TournamentPrize, CreateTournamentPrizeDto, UpdateTournamentPrizeDto } from './types'
import { apiClient } from './apiClient'

export interface TournamentsFilters {
  status_filter?: string | null
  active_only?: boolean
}

export const tournamentsApi = {
  getAll: async (filters?: TournamentsFilters, skip?: number, limit?: number): Promise<PaginatedResponse<Tournament>> => {
    const params = new URLSearchParams()
    
    if (filters?.status_filter !== undefined && filters.status_filter !== null && filters.status_filter !== '') {
      params.append('status_filter', filters.status_filter)
    }
    if (filters?.active_only !== undefined) {
      params.append('active_only', String(filters.active_only))
    }
    if (skip !== undefined) {
      params.append('skip', String(skip))
    }
    if (limit !== undefined) {
      params.append('limit', String(limit))
    }
    
    const queryString = params.toString()
    const url = queryString ? `/panel/tournaments/?${queryString}` : '/panel/tournaments/'
    
    return apiClient<PaginatedResponse<Tournament>>(url, {
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

  getDecks: async (tournamentId: number, skip?: number, limit?: number): Promise<PaginatedResponse<TournamentDeck>> => {
    const params = new URLSearchParams()
    params.append('tournament_id', String(tournamentId))
    if (skip !== undefined) {
      params.append('skip', String(skip))
    }
    if (limit !== undefined) {
      params.append('limit', String(limit))
    }
    return apiClient<PaginatedResponse<TournamentDeck>>(`/panel/tournament-decks/decks?${params.toString()}`, {
      method: 'GET',
    })
  },

  getResults: async (tournamentId: number, skip?: number, limit?: number): Promise<PaginatedResponse<TournamentReward>> => {
    const params = new URLSearchParams()
    params.append('tournament_id', String(tournamentId))
    if (skip !== undefined) {
      params.append('skip', String(skip))
    }
    if (limit !== undefined) {
      params.append('limit', String(limit))
    }
    return apiClient<PaginatedResponse<TournamentReward>>(`/panel/tournament-decks/results?${params.toString()}`, {
      method: 'GET',
    })
  },

  getPrizes: async (tournamentId?: number | null, skip?: number, limit?: number): Promise<PaginatedResponse<TournamentPrize>> => {
    const params = new URLSearchParams()
    if (tournamentId !== undefined && tournamentId !== null) {
      params.append('tournament_id', String(tournamentId))
    }
    if (skip !== undefined) {
      params.append('skip', String(skip))
    }
    if (limit !== undefined) {
      params.append('limit', String(limit))
    }
    const queryString = params.toString()
    const url = queryString ? `/panel/tournament-prizes/?${queryString}` : '/panel/tournament-prizes/'
    return apiClient<PaginatedResponse<TournamentPrize>>(url, {
      method: 'GET',
    })
  },

  getPrizeById: async (prizeId: number): Promise<TournamentPrize> => {
    return apiClient<TournamentPrize>(`/panel/tournament-prizes/${prizeId}`, {
      method: 'GET',
    })
  },

  createPrize: async (data: CreateTournamentPrizeDto): Promise<TournamentPrize> => {
    return apiClient<TournamentPrize>('/panel/tournament-prizes/', {
      method: 'POST',
      body: data,
    })
  },

  updatePrize: async (prizeId: number, data: UpdateTournamentPrizeDto): Promise<TournamentPrize> => {
    return apiClient<TournamentPrize>(`/panel/tournament-prizes/${prizeId}`, {
      method: 'PUT',
      body: data,
    })
  },

  deletePrize: async (prizeId: number): Promise<void> => {
    return apiClient<void>(`/panel/tournament-prizes/${prizeId}`, {
      method: 'DELETE',
    })
  },
}

