"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getItinerary } from "@/lib/api"
import { formatDuration, formatPrice, formatCO2, formatTime } from "@/lib/utils/format"
import type { ItineraryResponse } from "@/lib/types"
import {
  CheckCircle2,
  Train,
  Plane,
  Bus,
  Car,
  Ship,
  Clock,
  Euro,
  Leaf,
  MapPin,
  ArrowRight,
  Loader2,
} from "lucide-react"

const MODE_ICONS = {
  train: Train,
  flight: Plane,
  bus: Bus,
  car: Car,
  ferry: Ship,
}

const MODE_COLORS = {
  train: "bg-blue-500",
  flight: "bg-sky-500",
  bus: "bg-orange-500",
  car: "bg-gray-500",
  ferry: "bg-teal-500",
}

export default function ItineraryPage() {
  const params = useParams()
  const bookingId = params.id as string
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadItinerary() {
      try {
        const data = await getItinerary(bookingId)
        setItinerary(data)
      } catch (err) {
        console.error("[v0] Error loading itinerary:", err)
        setError("Failed to load booking details")
      } finally {
        setIsLoading(false)
      }
    }

    loadItinerary()
  }, [bookingId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center space-y-4">
          <p className="text-muted-foreground">{error || "Booking not found"}</p>
          <Link href="/plan">
            <Button>Plan New Trip</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const { option } = itinerary
  const Icon = MODE_ICONS[option.mode]
  const colorClass = MODE_COLORS[option.mode]
  const firstLeg = option.legs[0]
  const lastLeg = option.legs[option.legs.length - 1]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-center">Booking Confirmation</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-6">
          {/* Success Message */}
          <Card className="p-8 text-center space-y-4 bg-primary/5 border-primary/20">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
              <p className="text-muted-foreground">Your trip has been successfully booked</p>
            </div>
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
              <p className="text-lg font-mono font-semibold">{itinerary.booking_id}</p>
            </div>
          </Card>

          {/* Trip Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Trip Summary</h3>

            <div className="space-y-6">
              {/* Transport Mode */}
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-lg ${colorClass} flex items-center justify-center text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold capitalize text-lg">{option.mode}</p>
                  <p className="text-sm text-muted-foreground">
                    {firstLeg?.from} → {lastLeg?.to}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Key Details */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {option.duration_min ? formatDuration(option.duration_min) : "—"}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Euro className="h-4 w-4" />
                    <span className="text-sm">Total Price</span>
                  </div>
                  <p className="text-lg font-semibold">{option.price_eur ? formatPrice(option.price_eur) : "—"}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Leaf className="h-4 w-4" />
                    <span className="text-sm">CO₂ Emissions</span>
                  </div>
                  <p className="text-lg font-semibold">{option.co2_kg ? formatCO2(option.co2_kg) : "—"}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Transfers</span>
                  </div>
                  <p className="text-lg font-semibold">{option.transfers ?? 0}</p>
                </div>
              </div>

              <Separator />

              {/* Journey Timeline */}
              <div>
                <h4 className="font-semibold mb-3">Journey Details</h4>
                <div className="space-y-3">
                  {option.legs.map((leg, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        {index < option.legs.length - 1 && <div className="w-0.5 h-12 bg-border" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{leg.from}</span>
                          {leg.dep_time && (
                            <Badge variant="outline" className="text-xs">
                              {formatTime(leg.dep_time)}
                            </Badge>
                          )}
                        </div>
                        {leg.carrier && (
                          <p className="text-sm text-muted-foreground">
                            {leg.carrier} {leg.service_no && `• ${leg.service_no}`}
                          </p>
                        )}
                        {index < option.legs.length - 1 && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <ArrowRight className="h-3 w-3" />
                            <span>Transfer</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-start gap-3">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{lastLeg?.to}</span>
                        {lastLeg?.arr_time && (
                          <Badge variant="outline" className="text-xs">
                            {formatTime(lastLeg.arr_time)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Booking Info */}
          <Card className="p-6 bg-muted/50">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="default" className="bg-green-500">
                  {itinerary.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booked by</span>
                <span className="font-medium">{itinerary.user}</span>
              </div>
              {itinerary.booked_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booked at</span>
                  <span className="font-medium">{new Date(itinerary.booked_at).toLocaleString()}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/plan" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Plan Another Trip
              </Button>
            </Link>
            <Button className="flex-1" onClick={() => window.print()}>
              Print Confirmation
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
