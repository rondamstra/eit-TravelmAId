"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import type { Preferences } from "@/lib/types"

interface PreferenceControlsProps {
  preferences: Preferences
  onChange: (prefs: Preferences) => void
}

export function PreferenceControls({ preferences, onChange }: PreferenceControlsProps) {
  const updatePreference = (key: keyof Preferences, value: number | boolean) => {
    onChange({ ...preferences, [key]: value })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="speed-slider" className="flex items-center gap-2">
            <span>⏱️</span>
            Speed Priority
          </Label>
          <span className="text-sm text-muted-foreground">{preferences.w_time.toFixed(1)}</span>
        </div>
        <Slider
          id="speed-slider"
          min={0}
          max={1}
          step={0.1}
          value={[preferences.w_time]}
          onValueChange={([value]) => updatePreference("w_time", value)}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">Higher values prioritize faster routes</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="budget-slider" className="flex items-center gap-2">
            <span>💰</span>
            Budget Priority
          </Label>
          <span className="text-sm text-muted-foreground">{preferences.w_price.toFixed(1)}</span>
        </div>
        <Slider
          id="budget-slider"
          min={0}
          max={1}
          step={0.1}
          value={[preferences.w_price]}
          onValueChange={([value]) => updatePreference("w_price", value)}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">Higher values prioritize cheaper options</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="planet-slider" className="flex items-center gap-2">
            <span>🌱</span>
            Planet Priority
          </Label>
          <span className="text-sm text-muted-foreground">{preferences.w_co2.toFixed(1)}</span>
        </div>
        <Slider
          id="planet-slider"
          min={0}
          max={1}
          step={0.1}
          value={[preferences.w_co2]}
          onValueChange={([value]) => updatePreference("w_co2", value)}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">Higher values prioritize lower CO₂ emissions</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="transfers-slider" className="flex items-center gap-2">
            <span>🔄</span>
            Transfers Priority
          </Label>
          <span className="text-sm text-muted-foreground">{preferences.w_transfers.toFixed(1)}</span>
        </div>
        <Slider
          id="transfers-slider"
          min={0}
          max={1}
          step={0.1}
          value={[preferences.w_transfers]}
          onValueChange={([value]) => updatePreference("w_transfers", value)}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">Higher values prioritize fewer transfers</p>
      </div>

      <div className="pt-4 border-t space-y-4">
        <div className="space-y-2">
          <Label htmlFor="max-price">Maximum Price (optional)</Label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">€</span>
            <Input
              id="max-price"
              type="number"
              placeholder="No limit"
              value={preferences.max_price || ""}
              onChange={(e) => updatePreference("max_price", e.target.value ? Number(e.target.value) : undefined)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="avoid-flights"
            checked={preferences.avoid_flights || false}
            onCheckedChange={(checked) => updatePreference("avoid_flights", checked as boolean)}
          />
          <Label htmlFor="avoid-flights" className="text-sm font-normal cursor-pointer">
            Avoid flights
          </Label>
        </div>
      </div>
    </div>
  )
}
