"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Candidate } from "@/lib/types"
import { formatDuration, formatPrice, formatCO2, formatTime } from "@/lib/utils/format"

interface OptionCardProps {
  candidate: Candidate
  onBook: (candidate: Candidate) => void
  isBooking?: boolean
}

const MODE_EMOJIS = {
  train: "🚂",
  flight: "✈️",
  bus: "🚌",
  car: "🚗",
  ferry: "⛴️",
}

const MODE_COLORS = {
  train: "bg-blue-500",
  flight: "bg-sky-500",
  bus: "bg-orange-500",
  car: "bg-gray-500",
  ferry: "bg-teal-500",
}

export function OptionCard({ candidate, onBook, isBooking }: OptionCardProps) {
  const emoji = MODE_EMOJIS[candidate.mode]
  const colorClass = MODE_COLORS[candidate.mode]

  const firstLeg = candidate.legs[0]
  const lastLeg = candidate.legs[candidate.legs.length - 1]

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg ${colorClass} flex items-center justify-center text-white text-xl`}>
              {emoji}
            </div>
            <div>
              <h3 className="font-semibold capitalize">{candidate.mode}</h3>
              <p className="text-sm text-muted-foreground">
                {firstLeg?.from} → {lastLeg?.to}
              </p>
            </div>
          </div>
          {candidate.score !== undefined && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Match Score</p>
              <p className="text-lg font-bold">{(candidate.score * 100).toFixed(0)}%</p>
            </div>
          )}
        </div>

        {/* Score Bar */}
        {candidate.score !== undefined && <Progress value={candidate.score * 100} className="h-2" />}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-xs">⏱️</span>
              <span className="text-xs">Duration</span>
            </div>
            <p className="font-semibold">{candidate.duration_min ? formatDuration(candidate.duration_min) : "—"}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-xs">€</span>
              <span className="text-xs">Price</span>
            </div>
            <p className="font-semibold">{candidate.price_eur ? formatPrice(candidate.price_eur) : "—"}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-xs">🌱</span>
              <span className="text-xs">CO₂</span>
            </div>
            <p className="font-semibold">{candidate.co2_kg ? formatCO2(candidate.co2_kg) : "—"}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-xs">🔄</span>
              <span className="text-xs">Transfers</span>
            </div>
            <p className="font-semibold">{candidate.transfers ?? 0}</p>
          </div>
        </div>

        {/* Journey Details */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">{formatTime(firstLeg?.dep_time)}</span>
          <span className="text-muted-foreground">→</span>
          <span className="font-medium">{formatTime(lastLeg?.arr_time)}</span>
          {candidate.legs.length > 1 && (
            <Badge variant="secondary" className="ml-auto">
              {candidate.legs.length} legs
            </Badge>
          )}
        </div>

        {/* Carrier Info */}
        {firstLeg?.carrier && (
          <p className="text-sm text-muted-foreground">
            {firstLeg.carrier} {firstLeg.service_no && `• ${firstLeg.service_no}`}
          </p>
        )}

        {/* Book Button */}
        <Button onClick={() => onBook(candidate)} disabled={isBooking} className="w-full">
          {isBooking ? "Booking..." : "Book This Option"}
        </Button>
      </div>
    </Card>
  )
}
