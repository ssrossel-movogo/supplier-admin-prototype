"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bookmark, Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export interface FilterView {
  id: string
  name: string
  filters: Record<string, any>
  count?: number
}

interface SavedFiltersProps {
  views?: FilterView[]
  activeView?: string
  onSelectView: (view: FilterView) => void
  onSaveView: (name: string, filters: Record<string, any>) => void
  onDeleteView: (id: string) => void
  currentFilters: Record<string, any>
}

export function SavedFilters({
  views = [], // Added default empty array to prevent undefined errors
  activeView,
  onSelectView,
  onSaveView,
  onDeleteView,
  currentFilters,
}: SavedFiltersProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [viewName, setViewName] = React.useState("")

  const handleSave = () => {
    if (viewName.trim()) {
      onSaveView(viewName, currentFilters)
      setViewName("")
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Bookmark className="h-4 w-4" />
            Gemte Visninger
            {views.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {views.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          {views.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Ingen gemte visninger</div>
          ) : (
            <>
              {views.map((view) => (
                <DropdownMenuItem
                  key={view.id}
                  onClick={() => onSelectView(view)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Bookmark className={`h-4 w-4 ${activeView === view.id ? "fill-current" : ""}`} />
                    <span>{view.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {view.count !== undefined && (
                      <Badge variant="secondary" className="text-xs">
                        {view.count}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteView(view.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Plus className="h-4 w-4" />
                Gem Nuværende Visning
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gem Filtervisning</DialogTitle>
                <DialogDescription>Giv din filtervisning et navn for at gemme den til senere brug.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="view-name">Visningsnavn</Label>
                  <Input
                    id="view-name"
                    placeholder="F.eks. Aktive udlejninger i København"
                    value={viewName}
                    onChange={(e) => setViewName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuller
                </Button>
                <Button onClick={handleSave}>Gem Visning</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
