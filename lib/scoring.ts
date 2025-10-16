// Client-side scoring utilities

import type { Candidate, Preferences } from "./types"

// CO₂ emission constants (kg per km per passenger)
const CO2_PER_KM: Record<string, number> = {
  train: 0.014,
  flight: 0.255,
  bus: 0.068,
  car: 0.192,
  ferry: 0.115,
}

// Estimate distance between two cities (rough heuristic)
function estimateDistance(from: string, to: string): number {
  // TODO: Replace with actual distance calculation or use from_loc/to_loc
  // For now, return a default value
  return 500 // km
}

export function estimateCO2(candidate: Candidate): number {
  if (candidate.co2_kg !== undefined) {
    return candidate.co2_kg
  }

  // Heuristic calculation
  const distance = estimateDistance(candidate.legs[0]?.from || "", candidate.legs[candidate.legs.length - 1]?.to || "")
  const co2PerKm = CO2_PER_KM[candidate.mode] || 0.1
  return distance * co2PerKm
}

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0
  return (value - min) / (max - min)
}

export function calculateScore(candidate: Candidate, allCandidates: Candidate[], prefs: Preferences): number {
  // If score is already provided, use it
  if (candidate.score !== undefined) {
    return candidate.score
  }

  // Extract values
  const duration = candidate.duration_min || 0
  const price = candidate.price_eur || 0
  const transfers = candidate.transfers || 0
  const co2 = candidate.co2_kg || estimateCO2(candidate)

  // Find min/max for normalization
  const durations = allCandidates.map((c) => c.duration_min || 0)
  const prices = allCandidates.map((c) => c.price_eur || 0)
  const transferCounts = allCandidates.map((c) => c.transfers || 0)
  const co2Values = allCandidates.map((c) => c.co2_kg || estimateCO2(c))

  const minDuration = Math.min(...durations)
  const maxDuration = Math.max(...durations)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const minTransfers = Math.min(...transferCounts)
  const maxTransfers = Math.max(...transferCounts)
  const minCO2 = Math.min(...co2Values)
  const maxCO2 = Math.max(...co2Values)

  // Normalize values (0 = best, 1 = worst)
  const normDuration = normalize(duration, minDuration, maxDuration)
  const normPrice = normalize(price, minPrice, maxPrice)
  const normTransfers = normalize(transfers, minTransfers, maxTransfers)
  const normCO2 = normalize(co2, minCO2, maxCO2)

  // Calculate weighted score (higher is better)
  const totalWeight = prefs.w_time + prefs.w_price + prefs.w_co2 + prefs.w_transfers
  const score =
    1 -
    (prefs.w_time * normDuration +
      prefs.w_price * normPrice +
      prefs.w_transfers * normTransfers +
      prefs.w_co2 * normCO2) /
      totalWeight

  return Math.max(0, Math.min(1, score))
}

export function sortCandidates(candidates: Candidate[], prefs: Preferences): Candidate[] {
  return [...candidates]
    .map((c) => ({
      ...c,
      score: calculateScore(c, candidates, prefs),
      co2_kg: c.co2_kg || estimateCO2(c),
    }))
    .sort((a, b) => (b.score || 0) - (a.score || 0))
}
