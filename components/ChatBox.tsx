"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ChatBoxProps {
  onSubmit: (text: string) => void
  isLoading?: boolean
}

export function ChatBox({ onSubmit, isLoading }: ChatBoxProps) {
  const [text, setText] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim() && !isLoading) {
      onSubmit(text.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Describe your trip... e.g., 'From Amsterdam to Paris, arrive before 12:00, budget 150€, prefer low CO₂'"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[100px] resize-none"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          Try: "From Berlin to Rome, leaving tomorrow morning, cheapest option" or "Paris to London, fastest route"
        </p>
      </div>
      <Button type="submit" disabled={!text.trim() || isLoading} className="w-full">
        {isLoading ? "Finding options..." : "Find Travel Options"}
      </Button>
    </form>
  )
}
