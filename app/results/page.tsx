"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OptionCard } from "@/components/OptionCard"
import { ResultsTable } from "@/components/ResultsTable"
import { LoadingOverlay } from "@/components/LoadingOverlay"
import { useToast } from "@/hooks/use-toast"
import { bookOption } from "@/lib/api"
import { sortCandidates } from "@/lib/scoring"
import type { ChatResponse, Candidate, Preferences } from "@/lib/types"

export default function ResultsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [results, setResults] = useState<ChatResponse | null>(null)
  const [preferences, setPreferences] = useState<Preferences | null>(null)
  const [sortedCandidates, setSortedCandidates] = useState<Candidate[]>([])
  const [sortBy, setSortBy] = useState<string>("score")
  const [isBooking, setIsBooking] = useState(false)

  useEffect(() => {
    // Load results from sessionStorage
    const storedResults = sessionStorage.getItem("travelResults")
    const storedPrefs = sessionStorage.getItem("travelPreferences")

    if (!storedResults) {
      router.push("/plan")
      return
    }

    const parsedResults = JSON.parse(storedResults) as ChatResponse
    const parsedPrefs = storedPrefs ? (JSON.parse(storedPrefs) as Preferences) : null

    setResults(parsedResults)
    setPreferences(parsedPrefs)

    // Sort candidates based on preferences
    if (parsedPrefs) {
      setSortedCandidates(sortCandidates(parsedResults.candidates, parsedPrefs))
    } else {
      setSortedCandidates(parsedResults.candidates)
    }
  }, [router])

  useEffect(() => {
    if (!results || !preferences) return

    // Re-sort when sort option changes
    let sorted = [...results.candidates]

    switch (sortBy) {
      case "score":
        sorted = sortCandidates(sorted, preferences)
        break
      case "price":
        sorted.sort((a, b) => (a.price_eur || 0) - (b.price_eur || 0))
        break
      case "duration":
        sorted.sort((a, b) => (a.duration_min || 0) - (b.duration_min || 0))
        break
      case "co2":
        sorted.sort((a, b) => (a.co2_kg || 0) - (b.co2_kg || 0))
        break
    }

    setSortedCandidates(sorted)
  }, [sortBy, results, preferences])

  const handleBook = async (candidate: Candidate) => {
    setIsBooking(true)

    try {
      const response = await bookOption({
        option: candidate,
        user: "demo-user",
      })

      toast({
        title: "Booking confirmed!",
        description: `Your booking ID is ${response.booking_id}`,
      })

      // Navigate to itinerary page
      router.push(`/itinerary/${response.booking_id}`)
    } catch (error) {
      console.error("Error booking option:", error)
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsBooking(false)
    }
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/plan" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <span>← Back to Planning</span>
          </Link>
          <h1 className="text-xl font-bold">Travel Options</h1>
          <div className="w-32" /> {/* Spacer */}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Query Summary */}
          {results.query && (
            <Card className="p-4 bg-muted/50">
              <p className="text-sm">
                <span className="font-medium">Route:</span> {results.query.from} → {results.query.to}
              </p>
            </Card>
          )}

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Best Match</SelectItem>
                  <SelectItem value="price">Lowest Price</SelectItem>
                  <SelectItem value="duration">Fastest</SelectItem>
                  <SelectItem value="co2">Lowest CO₂</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p className="text-sm text-muted-foreground">
              {sortedCandidates.length} {sortedCandidates.length === 1 ? "option" : "options"} found
            </p>
          </div>

          {/* Results Display */}
          <Tabs defaultValue="cards" className="w-full">
            <TabsList>
              <TabsTrigger value="cards" className="flex items-center gap-2">
                <span>📇</span>
                Cards
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <span>📊</span>
                Table
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cards" className="mt-6">
              {sortedCandidates.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">No travel options found matching your criteria</p>
                  <Link href="/plan">
                    <Button>Try Different Search</Button>
                  </Link>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedCandidates.map((candidate, index) => (
                    <OptionCard
                      key={candidate.id || index}
                      candidate={candidate}
                      onBook={handleBook}
                      isBooking={isBooking}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="table" className="mt-6">
              <ResultsTable candidates={sortedCandidates} onBook={handleBook} isBooking={isBooking} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <LoadingOverlay isVisible={isBooking} message="Processing your booking..." />
    </div>
  )
}
