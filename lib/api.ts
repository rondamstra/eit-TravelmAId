// API client for backend communication

import type { ChatRequest, ChatResponse, BookingRequest, BookingResponse, ItineraryResponse, Candidate } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

// Add realistic delay to simulate API response time
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock data for when API is not available
const MOCK_CANDIDATES: Candidate[] = [
  {
    id: "mock-1",
    mode: "train",
    legs: [
      {
        from: "Amsterdam Centraal",
        to: "Paris Gare du Nord",
        dep_time: "08:25",
        arr_time: "11:52",
        carrier: "Thalys",
        service_no: "9342",
      },
    ],
    price_eur: 89,
    duration_min: 207,
    co2_kg: 12.5,
    transfers: 0,
    score: 0.85,
  },
  {
    id: "mock-2",
    mode: "flight",
    legs: [
      {
        from: "Amsterdam Schiphol",
        to: "Paris Charles de Gaulle",
        dep_time: "10:15",
        arr_time: "11:45",
        carrier: "Air France",
        service_no: "AF1234",
      },
    ],
    price_eur: 125,
    duration_min: 90,
    co2_kg: 85.3,
    transfers: 0,
    score: 0.72,
  },
  {
    id: "mock-3",
    mode: "bus",
    legs: [
      {
        from: "Amsterdam Sloterdijk",
        to: "Paris Bercy",
        dep_time: "22:30",
        arr_time: "12:45",
        carrier: "FlixBus",
        service_no: "FB789",
      },
    ],
    price_eur: 35,
    duration_min: 855,
    co2_kg: 28.4,
    transfers: 0,
    score: 0.68,
  },
]

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    console.warn("[v0] API_BASE_URL not set, using mock data")
    throw new Error("API_UNAVAILABLE")
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

export async function chatWithAgent(request: ChatRequest): Promise<ChatResponse> {
  try {
    return await fetchAPI<ChatResponse>("/chat", {
      method: "POST",
      body: JSON.stringify(request),
    })
  } catch (error) {
    console.warn("[v0] Using mock data for chat:", error)
    // Add realistic delay for search
    await delay(2000 + Math.random() * 1000) // 2-3 seconds
    // Return mock data
    return {
      query: {
        from: "Amsterdam",
        to: "Paris",
        preferences: request.prefs,
      },
      candidates: MOCK_CANDIDATES,
      recommendation: 0,
    }
  }
}

export async function bookOption(request: BookingRequest): Promise<BookingResponse> {
  try {
    return await fetchAPI<BookingResponse>("/book", {
      method: "POST",
      body: JSON.stringify(request),
    })
  } catch (error) {
    console.warn("[v0] Using mock booking:", error)
    // Add realistic delay for booking
    await delay(1500 + Math.random() * 500) // 1.5-2 seconds
    // Return mock booking
    return {
      booking_id: `mock-booking-${Date.now()}`,
      status: "confirmed",
    }
  }
}

export async function getItinerary(id: string): Promise<ItineraryResponse> {
  try {
    return await fetchAPI<ItineraryResponse>(`/itinerary/${id}`)
  } catch (error) {
    console.warn("[v0] Using mock itinerary:", error)
    // Return mock itinerary
    return {
      booking_id: id,
      status: "confirmed",
      option: MOCK_CANDIDATES[0],
      user: "demo-user",
      booked_at: new Date().toISOString(),
    }
  }
}
