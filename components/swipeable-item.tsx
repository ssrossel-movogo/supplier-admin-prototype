"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SwipeAction {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: "default" | "destructive" | "success"
}

interface SwipeableItemProps {
  children: React.ReactNode
  leftActions?: SwipeAction[]
  rightActions?: SwipeAction[]
  className?: string
}

export function SwipeableItem({ children, leftActions = [], rightActions = [], className }: SwipeableItemProps) {
  const [swipeDistance, setSwipeDistance] = React.useState(0)
  const [isSwiping, setIsSwiping] = React.useState(false)
  const startX = React.useRef(0)
  const currentX = React.useRef(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const maxSwipe = 200

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    currentX.current = e.touches[0].clientX
    setIsSwiping(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return

    currentX.current = e.touches[0].clientX
    const distance = currentX.current - startX.current

    // Limit swipe distance
    const limitedDistance = Math.max(Math.min(distance, maxSwipe), -maxSwipe)
    setSwipeDistance(limitedDistance)
  }

  const handleTouchEnd = () => {
    setIsSwiping(false)

    // If swiped far enough, keep actions visible
    if (Math.abs(swipeDistance) > 80) {
      setSwipeDistance(swipeDistance > 0 ? maxSwipe : -maxSwipe)
    } else {
      setSwipeDistance(0)
    }
  }

  const handleActionClick = (action: SwipeAction) => {
    action.onClick()
    setSwipeDistance(0)
  }

  const getActionColor = (variant?: string) => {
    switch (variant) {
      case "destructive":
        return "bg-destructive text-white hover:bg-destructive/90"
      case "success":
        return "bg-chart-3 text-white hover:bg-chart-3/90"
      default:
        return "bg-primary text-primary-foreground hover:bg-primary/90"
    }
  }

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {/* Left actions */}
      {leftActions.length > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 flex items-center"
          style={{
            width: `${maxSwipe}px`,
            transform: `translateX(-${maxSwipe}px)`,
          }}
        >
          {leftActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action)}
              className={cn(
                "flex-1 h-full flex flex-col items-center justify-center gap-1 transition-colors",
                getActionColor(action.variant),
              )}
            >
              {action.icon}
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Right actions */}
      {rightActions.length > 0 && (
        <div
          className="absolute right-0 top-0 bottom-0 flex items-center"
          style={{
            width: `${maxSwipe}px`,
            transform: `translateX(${maxSwipe}px)`,
          }}
        >
          {rightActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action)}
              className={cn(
                "flex-1 h-full flex flex-col items-center justify-center gap-1 transition-colors",
                getActionColor(action.variant),
              )}
            >
              {action.icon}
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${swipeDistance}px)`,
          transition: isSwiping ? "none" : "transform 0.3s ease",
        }}
        className="bg-background"
      >
        {children}
      </div>
    </div>
  )
}
