// Formatting utilities

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export function formatPrice(euros: number): string {
  return `€${euros.toFixed(0)}`
}

export function formatCO2(kg: number): string {
  return `${kg.toFixed(1)} kg CO₂`
}

export function formatTime(time?: string): string {
  if (!time) return "—"
  return time
}

export function getModeColor(mode: string): string {
  const colors: Record<string, string> = {
    train: "bg-blue-500",
    flight: "bg-sky-500",
    bus: "bg-orange-500",
    car: "bg-gray-500",
    ferry: "bg-teal-500",
  }
  return colors[mode] || "bg-gray-500"
}

export function getModeIcon(mode: string): string {
  const icons: Record<string, string> = {
    train: "🚄",
    flight: "✈️",
    bus: "🚌",
    car: "🚗",
    ferry: "⛴️",
  }
  return icons[mode] || "🚗"
}
