"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface Booking {
  id: string
  startDate: Date
  endDate: Date
  customer: string
  status: "confirmed" | "pending"
}

interface BlackoutDate {
  id: string
  startDate: Date
  endDate: Date
  reason: string
}

interface AvailabilityCalendarProps {
  bookings?: Booking[]
  blackoutDates?: BlackoutDate[]
  onAddBlackout?: (blackout: Omit<BlackoutDate, "id">) => void
  onRemoveBlackout?: (id: string) => void
}

const DAYS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"]
const MONTHS = [
  "Januar",
  "Februar",
  "Marts",
  "April",
  "Maj",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "December",
]

export function AvailabilityCalendar({
  bookings = [],
  blackoutDates = [],
  onAddBlackout,
  onRemoveBlackout,
}: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [selectedDates, setSelectedDates] = React.useState<Date[]>([])
  const [isAddingBlackout, setIsAddingBlackout] = React.useState(false)
  const [blackoutReason, setBlackoutReason] = React.useState("")

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7 // Adjust for Monday start

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  const isDateInRange = (date: Date, start: Date, end: Date) => {
    const time = date.getTime()
    return time >= start.getTime() && time <= end.getTime()
  }

  const getDateStatus = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (date < today) {
      return "past"
    }

    // Check if date is in a blackout period
    const isBlackout = blackoutDates.some((blackout) => isDateInRange(date, blackout.startDate, blackout.endDate))
    if (isBlackout) {
      return "blackout"
    }

    // Check if date is in a confirmed booking
    const confirmedBooking = bookings.find(
      (booking) => booking.status === "confirmed" && isDateInRange(date, booking.startDate, booking.endDate),
    )
    if (confirmedBooking) {
      return "booked"
    }

    // Check if date is in a pending booking
    const pendingBooking = bookings.find(
      (booking) => booking.status === "pending" && isDateInRange(date, booking.startDate, booking.endDate),
    )
    if (pendingBooking) {
      return "pending"
    }

    return "available"
  }

  const handleDateClick = (date: Date) => {
    const status = getDateStatus(date)
    if (status === "past") return

    const isSelected = selectedDates.some((d) => isSameDay(d, date))
    if (isSelected) {
      setSelectedDates(selectedDates.filter((d) => !isSameDay(d, date)))
    } else {
      setSelectedDates([...selectedDates, date])
    }
  }

  const handleAddBlackout = () => {
    if (selectedDates.length === 0 || !blackoutReason.trim()) return

    const sortedDates = [...selectedDates].sort((a, b) => a.getTime() - b.getTime())
    const startDate = sortedDates[0]
    const endDate = sortedDates[sortedDates.length - 1]

    onAddBlackout?.({
      startDate,
      endDate,
      reason: blackoutReason,
    })

    setSelectedDates([])
    setBlackoutReason("")
    setIsAddingBlackout(false)
  }

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const status = getDateStatus(date)
    const isSelected = selectedDates.some((d) => isSameDay(d, date))
    const isToday = isSameDay(date, new Date())

    const booking = bookings.find((b) => isDateInRange(date, b.startDate, b.endDate))
    const blackout = blackoutDates.find((b) => isDateInRange(date, b.startDate, b.endDate))

    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(date)}
        disabled={status === "past"}
        className={cn(
          "aspect-square p-2 text-sm rounded-lg transition-colors relative",
          "hover:bg-accent hover:text-accent-foreground",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          status === "available" && "bg-background",
          status === "booked" && "bg-blue-100 text-blue-900 hover:bg-blue-200",
          status === "pending" && "bg-yellow-100 text-yellow-900 hover:bg-yellow-200",
          status === "blackout" && "bg-red-100 text-red-900 hover:bg-red-200",
          isSelected && "ring-2 ring-primary ring-offset-2",
          isToday && "font-bold",
        )}
        title={
          booking ? `${booking.customer} (${booking.status})` : blackout ? `Blackout: ${blackout.reason}` : undefined
        }
      >
        {day}
        {isToday && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />}
      </button>,
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tilgængelighed</CardTitle>
            <CardDescription>Administrer bookinger og blackout-datoer</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-[140px] text-center font-medium">
              {MONTHS[month]} {year}
            </div>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-background border" />
            <span>Tilgængelig</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-100" />
            <span>Booket</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-100" />
            <span>Afventer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100" />
            <span>Blackout</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
          {days}
        </div>

        {/* Actions */}
        {selectedDates.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="text-sm">
              <span className="font-medium">{selectedDates.length}</span> dag(e) valgt
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedDates([])}>
                Ryd
              </Button>
              <Button size="sm" onClick={() => setIsAddingBlackout(true)}>
                <Plus className="h-4 w-4" />
                Tilføj Blackout
              </Button>
            </div>
          </div>
        )}

        {/* Blackout Dates List */}
        {blackoutDates.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Blackout Perioder</h4>
            <div className="space-y-2">
              {blackoutDates.map((blackout) => (
                <div key={blackout.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">
                        {blackout.startDate.toLocaleDateString("da-DK")} -{" "}
                        {blackout.endDate.toLocaleDateString("da-DK")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{blackout.reason}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onRemoveBlackout?.(blackout.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Add Blackout Dialog */}
      <Dialog open={isAddingBlackout} onOpenChange={setIsAddingBlackout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tilføj Blackout Periode</DialogTitle>
            <DialogDescription>
              Marker udstyr som utilgængeligt for de valgte datoer. Dette vil forhindre nye bookinger.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Periode</Label>
              <div className="text-sm text-muted-foreground">
                {selectedDates.length > 0 ? (
                  <>
                    {Math.min(...selectedDates.map((d) => d.getTime())) ===
                    Math.max(...selectedDates.map((d) => d.getTime())) ? (
                      new Date(Math.min(...selectedDates.map((d) => d.getTime()))).toLocaleDateString("da-DK")
                    ) : (
                      <>
                        {new Date(Math.min(...selectedDates.map((d) => d.getTime()))).toLocaleDateString("da-DK")} -{" "}
                        {new Date(Math.max(...selectedDates.map((d) => d.getTime()))).toLocaleDateString("da-DK")}
                      </>
                    )}
                  </>
                ) : (
                  "Ingen datoer valgt"
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Årsag</Label>
              <Textarea
                id="reason"
                placeholder="F.eks. Vedligeholdelse, Reparation, Sæsonlukket..."
                value={blackoutReason}
                onChange={(e) => setBlackoutReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingBlackout(false)}>
              Annuller
            </Button>
            <Button onClick={handleAddBlackout} disabled={!blackoutReason.trim()}>
              Tilføj Blackout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
