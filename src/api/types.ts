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

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  skip: number
  limit: number
  has_next: boolean
  has_prev: boolean
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

// Типы для цен токенов
export interface TokenPrice {
  id: number
  token_id: number
  price: number
  market_cap: number
  change_24h: number
  sources_count: number
  timestamp: string
}

// Типы для карточек
export interface Card {
  id: number
  token_id: number
  rarity_id: number
  design_type: string
  background_image_url: string
  is_active: boolean
  created_at: string
  updated_at: string
  token_name: string
  token_symbol: string
  rarity_name: string
  rarity_color: string
  // Для обратной совместимости
  rarity?: string
}

export interface CreateCardDto {
  token_id: number
  rarity_id: number
  design_type: string
  background_image_url: string
  is_active: boolean
}

export interface UpdateCardDto {
  token_id?: number
  rarity_id?: number
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
  weight_limit: number
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

// Типы для рарностей
export interface Rarity {
  id: number
  name: string
  description: string
  score_bonus: number
  color: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateRarityDto {
  name: string
  description: string
  score_bonus: number
  color: string
  is_active: boolean
}

export interface UpdateRarityDto {
  name?: string
  description?: string
  score_bonus?: number
  color?: string
  is_active?: boolean
}

// Типы для типов паков
export interface PackType {
  id: number
  name: string
  description: string
  image_url: string
  header_image_url: string
  cards_per_pack: number
  price: string
  currency: string
  supply: number | null
  available_from: string | null
  available_until: string | null
  guaranteed_slots: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreatePackTypeDto {
  name: string
  description: string
  image_url: string
  header_image_url: string
  cards_per_pack: number
  price: number
  currency: string
  supply?: number
  available_from?: string
  available_until?: string
  guaranteed_slots?: string
  is_active: boolean
}

export interface UpdatePackTypeDto {
  name?: string
  description?: string
  image_url?: string
  header_image_url?: string
  cards_per_pack?: number
  price?: number
  currency?: string
  supply?: number
  available_from?: string
  available_until?: string
  guaranteed_slots?: string
  is_active?: boolean
}

// Типы для колод турнира
export interface TournamentDeck {
  id: number
  tournament_id: number
  user_id: number
  deck_composition: string
  deck_hash: string
  submitted_at: string
  is_valid: boolean
  is_active: boolean
  validation_errors: string
  transaction_hash: string
}

// Типы для призов турнира (results)
export interface TournamentReward {
  id: number
  tournament_id: number
  position_from: number
  position_to: number
  reward_type_id: number
  reward_amount: string
  created_at: string
}

// Типы для конфигурации призов турнира (prizes)
export interface TournamentPrize {
  id: number
  tournament_id: number
  position_from: number
  position_to: number
  reward_type_id: number
  reward_amount: string
  created_at: string
}

export interface CreateTournamentPrizeDto {
  tournament_id: number
  position_from: number
  position_to: number
  reward_type_id: number
  reward_amount: number
}

export interface UpdateTournamentPrizeDto {
  position_from?: number
  position_to?: number
  reward_type_id?: number
  reward_amount?: number
}

