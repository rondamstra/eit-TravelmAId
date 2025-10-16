# EIT TravelMAId - Multi-Agent Travel Planner

A hackathon MVP for planning European trips using AI-powered multi-agent orchestration. Compare train, flight, bus, car, and ferry options based on speed, budget, and environmental impact.

## Features

- **Smart Trip Planning**: Natural language input or structured form
- **Multi-Modal Comparison**: Train, flight, bus, car, and ferry options
- **Preference-Based Scoring**: Optimize for speed, budget, or planet
- **Real-Time Booking**: Book your preferred option instantly
- **CO₂ Tracking**: See environmental impact of each option

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4 + shadcn/ui
- **State Management**: React Query
- **Icons**: lucide-react

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

\`\`\`bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your NEXT_PUBLIC_API_URL

# Run development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API base URL (optional, uses mock data if not set)

## Backend API

The app expects the following REST endpoints:

- `POST /chat` - Get travel options
  - Body: `{ text: string, prefs: Preferences }`
  - Returns: `{ query, candidates[], recommendation }`

- `POST /book` - Book a travel option
  - Body: `{ option: Candidate, user: string }`
  - Returns: `{ booking_id, status }`

- `GET /itinerary/{id}` - Get booking details
  - Returns: `{ booking_id, status, option, user, booked_at }`

If the API is unavailable, the app uses mock data for demonstration.

## Project Structure

\`\`\`
app/
  page.tsx              # Landing page
  plan/page.tsx         # Trip planning form
  results/page.tsx      # Search results
  itinerary/[id]/page.tsx  # Booking confirmation
components/
  ChatBox.tsx           # Natural language input
  PreferenceControls.tsx  # Speed/Budget/Planet sliders
  OptionCard.tsx        # Travel option display
  ResultsTable.tsx      # Results table view
lib/
  api.ts                # API client
  types.ts              # TypeScript definitions
  scoring.ts            # Client-side scoring
  utils/format.ts       # Formatting utilities
\`\`\`

## TODO

- [ ] Add map visualization for route legs
- [ ] Replace CO₂ heuristics with real per-leg data from backend
- [ ] Add user authentication
- [ ] Implement saved trips
- [ ] Add more transport modes (rideshare, bike)

## License

MIT
