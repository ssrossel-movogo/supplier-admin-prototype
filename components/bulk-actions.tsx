"use client"

import type * as React from "react"
import { Button } from "@/components/ui/button"
import { CheckSquare, Trash2, Download, Mail, Archive, X } from "lucide-react"

interface BulkActionsProps {
  selectedCount: number
  onClearSelection: () => void
  onDelete?: () => void
  onExport?: () => void
  onEmail?: () => void
  onArchive?: () => void
  customActions?: Array<{
    label: string
    icon: React.ReactNode
    onClick: () => void
    variant?: "default" | "destructive"
  }>
}

export function BulkActions({
  selectedCount,
  onClearSelection,
  onDelete,
  onExport,
  onEmail,
  onArchive,
  customActions = [],
}: BulkActionsProps) {
  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-card border rounded-lg shadow-lg p-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-primary" />
          <span className="font-medium">
            {selectedCount} {selectedCount === 1 ? "element" : "elementer"} valgt
          </span>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-2">
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4" />
              Eksporter
            </Button>
          )}

          {onEmail && (
            <Button variant="outline" size="sm" onClick={onEmail}>
              <Mail className="h-4 w-4" />
              Send Email
            </Button>
          )}

          {onArchive && (
            <Button variant="outline" size="sm" onClick={onArchive}>
              <Archive className="h-4 w-4" />
              Arkiver
            </Button>
          )}

          {customActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant === "destructive" ? "destructive" : "outline"}
              size="sm"
              onClick={action.onClick}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}

          {onDelete && (
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
              Slet
            </Button>
          )}

          <div className="h-6 w-px bg-border" />

          <Button variant="ghost" size="icon-sm" onClick={onClearSelection}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
