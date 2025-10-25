"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type DateStatus = "available" | "rented" | "blackout" | "today"

interface RentalPeriod {
  startDate: string
  endDate: string
  customer?: string
}

interface BlackoutPeriod {
  startDate: string
  endDate: string
  reason: string
}

interface EquipmentCalendarProps {
  rentals?: RentalPeriod[]
  blackouts?: BlackoutPeriod[]
}

export function EquipmentCalendar({ rentals = [], blackouts = [] }: EquipmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  // Month names in Danish
  const monthNames = [
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

  const dayNames = ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"]

  const getDateStatus = (day: number): DateStatus => {
    const date = new Date(year, month, day)
    const dateStr = date.toISOString().split("T")[0]
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)

    // Check if today
    if (date.getTime() === today.getTime()) {
      return "today"
    }

    // Check if in blackout period
    for (const blackout of blackouts) {
      const start = new Date(blackout.startDate)
      const end = new Date(blackout.endDate)
      start.setHours(0, 0, 0, 0)
      end.setHours(0, 0, 0, 0)
      if (date >= start && date <= end) {
        return "blackout"
      }
    }

    // Check if rented
    for (const rental of rentals) {
      const start = new Date(rental.startDate)
      const end = new Date(rental.endDate)
      start.setHours(0, 0, 0, 0)
      end.setHours(0, 0, 0, 0)
      if (date >= start && date <= end) {
        return "rented"
      }
    }

    return "available"
  }

  const getDateInfo = (day: number) => {
    const date = new Date(year, month, day)
    const status = getDateStatus(day)

    if (status === "rented") {
      const rental = rentals.find((r) => {
        const start = new Date(r.startDate)
        const end = new Date(r.endDate)
        start.setHours(0, 0, 0, 0)
        end.setHours(0, 0, 0, 0)
        date.setHours(0, 0, 0, 0)
        return date >= start && date <= end
      })
      return rental?.customer || "Udlejet"
    }

    if (status === "blackout") {
      const blackout = blackouts.find((b) => {
        const start = new Date(b.startDate)
        const end = new Date(b.endDate)
        start.setHours(0, 0, 0, 0)
        end.setHours(0, 0, 0, 0)
        date.setHours(0, 0, 0, 0)
        return date >= start && date <= end
      })
      return blackout?.reason || "Utilgængelig"
    }

    return null
  }

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Generate calendar days
  const calendarDays = []

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {monthNames[month]} {year}
        </h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            I dag
          </Button>
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-green-500" />
          <span>Tilgængelig</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-blue-500" />
          <span>Udlejet</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-red-500" />
          <span>Utilgængelig</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border-2 border-primary" />
          <span>I dag</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg overflow-hidden">
        {/* Day names header */}
        <div className="grid grid-cols-7 bg-muted">
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square border-r border-b bg-muted/30" />
            }

            const status = getDateStatus(day)
            const info = getDateInfo(day)

            return (
              <div
                key={day}
                className={cn(
                  "aspect-square border-r border-b last:border-r-0 p-2 relative group cursor-pointer hover:bg-accent/50 transition-colors",
                  status === "available" && "bg-green-50 dark:bg-green-950/20",
                  status === "rented" && "bg-blue-50 dark:bg-blue-950/20",
                  status === "blackout" && "bg-red-50 dark:bg-red-950/20",
                  status === "today" && "ring-2 ring-primary ring-inset",
                )}
              >
                <div className="flex flex-col h-full">
                  <span className={cn("text-sm font-medium", status === "today" && "text-primary")}>{day}</span>
                  {info && <span className="text-xs text-muted-foreground mt-1 line-clamp-2">{info}</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
