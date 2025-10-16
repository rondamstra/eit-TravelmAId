"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Candidate } from "@/lib/types"
import { formatDuration, formatPrice, formatCO2 } from "@/lib/utils/format"

interface ResultsTableProps {
  candidates: Candidate[]
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

export function ResultsTable({ candidates, onBook, isBooking }: ResultsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mode</TableHead>
            <TableHead>Route</TableHead>
            <TableHead className="text-right">Duration</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">CO₂</TableHead>
            <TableHead className="text-right">Transfers</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                No travel options found
              </TableCell>
            </TableRow>
          ) : (
            candidates.map((candidate, index) => {
              const emoji = MODE_EMOJIS[candidate.mode]
              const firstLeg = candidate.legs[0]
              const lastLeg = candidate.legs[candidate.legs.length - 1]

              return (
                <TableRow key={candidate.id || index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{emoji}</span>
                      <span className="capitalize">{candidate.mode}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {firstLeg?.from} → {lastLeg?.to}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {candidate.duration_min ? formatDuration(candidate.duration_min) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {candidate.price_eur ? formatPrice(candidate.price_eur) : "—"}
                  </TableCell>
                  <TableCell className="text-right">{candidate.co2_kg ? formatCO2(candidate.co2_kg) : "—"}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{candidate.transfers ?? 0}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {candidate.score !== undefined ? (
                      <span className="font-medium">{(candidate.score * 100).toFixed(0)}%</span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => onBook(candidate)} disabled={isBooking}>
                      Book
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
