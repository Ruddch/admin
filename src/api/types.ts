// Типы для токенов
export interface Token {
  id: number
  name: string
  symbol: string
  weight: number
  image_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateTokenDto {
  name: string
  symbol: string
  weight: number
  image_url: string
  is_active: boolean
}

export interface UpdateTokenDto {
  name?: string
  symbol?: string
  weight?: number
  image_url?: string
  is_active?: boolean
}

// Типы для карточек
export interface Card {
  id: number
  token_id: number
  rarity: string
  design_type: string
  background_image_url: string
  is_active: boolean
  created_at: string
  updated_at: string
  token_name: string
  token_symbol: string
}

export interface CreateCardDto {
  token_id: number
  rarity: string
  design_type: string
  background_image_url: string
  is_active: boolean
}

export interface UpdateCardDto {
  token_id?: number
  rarity?: string
  design_type?: string
  background_image_url?: string
  is_active?: boolean
}

// Типы для турниров
export interface Tournament {
  id: number
  tournament_number: number
  status: 'registration' | 'active' | 'finished'
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
  is_active: boolean
  duration_days: number
}

export interface CreateTournamentDto {
  tournament_number: number
  status: 'registration' | 'active' | 'finished'
  start_date: string
  end_date: string
}

export interface UpdateTournamentDto {
  tournament_number?: number
  status?: 'registration' | 'active' | 'finished'
  start_date?: string
  end_date?: string
}

// Типы для пользователей
export interface User {
  id: number
  wallet_address: string
  nickname: string
  referral_route: string
  avatar_url: string
  is_active: boolean
  created_at: string
  updated_at: string
  wallet_short: string
  days_since_registration: number
}

export interface UpdateUserDto {
  nickname?: string
  referral_route?: string
  avatar_url?: string
  is_active?: boolean
}

