"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  className?: string
}

export function PullToRefresh({ onRefresh, children, className }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = React.useState(false)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [pullDistance, setPullDistance] = React.useState(0)
  const startY = React.useRef(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const threshold = 80

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current === 0 || isRefreshing) return

    const currentY = e.touches[0].clientY
    const distance = currentY - startY.current

    if (distance > 0 && containerRef.current && containerRef.current.scrollTop === 0) {
      setIsPulling(true)
      setPullDistance(Math.min(distance, threshold * 1.5))
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }
    setIsPulling(false)
    setPullDistance(0)
    startY.current = 0
  }

  const pullProgress = Math.min((pullDistance / threshold) * 100, 100)

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-auto", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 z-50"
        style={{
          height: isPulling || isRefreshing ? "60px" : "0px",
          opacity: isPulling || isRefreshing ? 1 : 0,
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <Loader2
            className={cn("h-6 w-6 text-primary", isRefreshing && "animate-spin")}
            style={{
              transform: `rotate(${pullProgress * 3.6}deg)`,
            }}
          />
          <p className="text-xs text-muted-foreground">
            {isRefreshing ? "Opdaterer..." : pullProgress >= 100 ? "Slip for at opdatere" : "Træk for at opdatere"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: isPulling || isRefreshing ? `translateY(${Math.min(pullDistance, 60)}px)` : "translateY(0)",
          transition: isPulling ? "none" : "transform 0.3s ease",
        }}
      >
        {children}
      </div>
    </div>
  )
}
