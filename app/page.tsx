import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚂</span>
            <span className="text-xl font-bold">TravelMAId</span>
          </div>
          <Link href="/plan">
            <Button>Plan Your Trip</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
            Plan smarter trips across Europe
          </h1>
          <p className="text-xl text-muted-foreground text-balance">
            Find the fastest, cheapest, or greenest way to travel. Compare trains, flights, buses, cars, and ferries in
            seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/plan">
              <Button size="lg" className="w-full sm:w-auto">
                Start Planning
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="p-6 space-y-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">⏱️</div>
            <h3 className="text-xl font-semibold">In a hurry?</h3>
            <p className="text-muted-foreground">
              Find the fastest routes with minimal transfers. Get there on time, every time.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">💰</div>
            <h3 className="text-xl font-semibold">On a budget?</h3>
            <p className="text-muted-foreground">
              Compare prices across all transport modes. Save money without compromising quality.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">🌱</div>
            <h3 className="text-xl font-semibold">Love the planet?</h3>
            <p className="text-muted-foreground">
              See CO₂ emissions for every option. Choose sustainable travel that makes a difference.
            </p>
          </Card>
        </div>
      </section>

      {/* Transport Modes Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold">All transport modes in one place</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <span className="text-xl">🚂</span>
              <span className="font-medium">Train</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <span className="text-xl">✈️</span>
              <span className="font-medium">Flight</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <span className="text-xl">🚌</span>
              <span className="font-medium">Bus</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-500/10 text-gray-600 dark:text-gray-400">
              <span className="text-xl">🚗</span>
              <span className="font-medium">Car</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <span className="text-xl">⛴️</span>
              <span className="font-medium">Ferry</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-3xl mx-auto p-8 md:p-12 text-center space-y-6 bg-primary text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">Ready to plan your next adventure?</h2>
          <p className="text-lg opacity-90">Get personalized travel recommendations in seconds</p>
          <Link href="/plan">
            <Button size="lg" variant="secondary" className="mt-4">
              Plan Your Trip Now
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>Built with Next.js, TailwindCSS, and AI-powered multi-agent orchestration</p>
        </div>
      </footer>
    </div>
  )
}
