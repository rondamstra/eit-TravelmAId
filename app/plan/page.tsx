"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatBox } from "@/components/ChatBox"
import { PreferenceControls } from "@/components/PreferenceControls"
import { LoadingOverlay } from "@/components/LoadingOverlay"
import { useToast } from "@/hooks/use-toast"
import { chatWithAgent } from "@/lib/api"
import type { Preferences } from "@/lib/types"

export default function PlanPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [departTime, setDepartTime] = useState("")
  const [arriveTime, setArriveTime] = useState("")

  // Preferences state
  const [preferences, setPreferences] = useState<Preferences>({
    w_time: 0.3,
    w_price: 0.3,
    w_co2: 0.3,
    w_transfers: 0.1,
  })

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!from.trim() || !to.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both departure and destination cities",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Build natural language query
      let text = `From ${from} to ${to}`
      if (departTime) text += `, departing at ${departTime}`
      if (arriveTime) text += `, arriving by ${arriveTime}`

      const response = await chatWithAgent({ text, prefs: preferences })

      // Store results in sessionStorage for the results page
      sessionStorage.setItem("travelResults", JSON.stringify(response))
      sessionStorage.setItem("travelPreferences", JSON.stringify(preferences))

      router.push("/results")
    } catch (error) {
      console.error("Error fetching travel options:", error)
      toast({
        title: "Error",
        description: "Failed to fetch travel options. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChatSubmit = async (text: string) => {
    setIsLoading(true)

    try {
      const response = await chatWithAgent({ text, prefs: preferences })

      // Store results in sessionStorage
      sessionStorage.setItem("travelResults", JSON.stringify(response))
      sessionStorage.setItem("travelPreferences", JSON.stringify(preferences))

      router.push("/results")
    } catch (error) {
      console.error("Error fetching travel options:", error)
      toast({
        title: "Error",
        description: "Failed to fetch travel options. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <span>← Back to Home</span>
          </Link>
          <h1 className="text-xl font-bold">Plan Your Trip</h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Main Planning Card */}
          <Card className="p-6">
            <Tabs defaultValue="form" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="form">Structured Form</TabsTrigger>
                <TabsTrigger value="chat">Natural Language</TabsTrigger>
              </TabsList>

              <TabsContent value="form" className="space-y-6 mt-6">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="from">From</Label>
                      <Input
                        id="from"
                        placeholder="Amsterdam"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="to">To</Label>
                      <Input
                        id="to"
                        placeholder="Paris"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="depart-time">Depart Time (optional)</Label>
                      <Input
                        id="depart-time"
                        type="datetime-local"
                        value={departTime}
                        onChange={(e) => setDepartTime(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="arrive-time">Arrive By (optional)</Label>
                      <Input
                        id="arrive-time"
                        type="datetime-local"
                        value={arriveTime}
                        onChange={(e) => setArriveTime(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Searching..." : "Find Travel Options"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="chat" className="mt-6">
                <ChatBox onSubmit={handleChatSubmit} isLoading={isLoading} />
              </TabsContent>
            </Tabs>
          </Card>

          {/* Preferences Card */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Your Preferences</h2>
            <PreferenceControls preferences={preferences} onChange={setPreferences} />
          </Card>

          {/* Info Card */}
          <Card className="p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Adjust your preferences to find the perfect balance between speed, cost, and environmental impact. Our
              AI-powered system will compare options across all transport modes.
            </p>
          </Card>
        </div>
      </div>
      <LoadingOverlay isVisible={isLoading} message="Finding travel options..." />
    </div>
  )
}
