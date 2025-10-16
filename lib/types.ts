// Core type definitions for the travel planner

export type TransportMode = "train" | "flight" | "bus" | "car" | "ferry"

export interface Leg {
  from: string
  to: string
  dep_time?: string
  arr_time?: string
  carrier?: string
  service_no?: string
  from_loc?: { lat: number; lon: number }
  to_loc?: { lat: number; lon: number }
}

export interface Candidate {
  id?: string
  mode: TransportMode
  legs: Leg[]
  price_eur?: number
  duration_min?: number
  co2_kg?: number
  transfers?: number
  score?: number
  eta?: string
}

export interface Preferences {
  w_time: number
  w_price: number
  w_co2: number
  w_transfers: number
  max_price?: number
  avoid_flights?: boolean
}

export interface Query {
  from: string
  to: string
  depart_time?: string
  arrive_time?: string
  preferences: Preferences
}

export interface ChatRequest {
  text: string
  prefs: Preferences
}

export interface ChatResponse {
  query: Query
  candidates: Candidate[]
  recommendation?: number
}

export interface BookingRequest {
  option: Candidate
  user: string
}

export interface BookingResponse {
  booking_id: string
  status: string
}

export interface ItineraryResponse {
  booking_id: string
  status: string
  option: Candidate
  user: string
  booked_at?: string
}
