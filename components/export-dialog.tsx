"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Download } from "lucide-react"

interface ExportDialogProps {
  trigger?: React.ReactNode
  onExport: (format: string, columns: string[]) => void
  availableColumns?: Array<{ id: string; label: string }>
}

export function ExportDialog({ trigger, onExport, availableColumns = [] }: ExportDialogProps) {
  const [format, setFormat] = React.useState("csv")
  const [selectedColumns, setSelectedColumns] = React.useState<string[]>(availableColumns?.map((col) => col.id) || [])

  React.useEffect(() => {
    if (availableColumns && availableColumns.length > 0) {
      setSelectedColumns(availableColumns.map((col) => col.id))
    }
  }, [availableColumns])

  const handleToggleColumn = (columnId: string) => {
    setSelectedColumns((prev) => (prev.includes(columnId) ? prev.filter((id) => id !== columnId) : [...prev, columnId]))
  }

  const handleSelectAll = () => {
    setSelectedColumns(availableColumns?.map((col) => col.id) || [])
  }

  const handleDeselectAll = () => {
    setSelectedColumns([])
  }

  const handleExport = () => {
    onExport(format, selectedColumns)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Eksporter
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Eksporter Data</DialogTitle>
          <DialogDescription>Vælg format og kolonner til eksport</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label>Eksportformat</Label>
            <RadioGroup value={format} onValueChange={setFormat}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="font-normal cursor-pointer">
                  CSV (.csv)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel" className="font-normal cursor-pointer">
                  Excel (.xlsx)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="font-normal cursor-pointer">
                  PDF (.pdf)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Column Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Kolonner</Label>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                  Vælg alle
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDeselectAll}>
                  Fravælg alle
                </Button>
              </div>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto border rounded-md p-3">
              {availableColumns && availableColumns.length > 0 ? (
                availableColumns.map((column) => (
                  <div key={column.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={column.id}
                      checked={selectedColumns.includes(column.id)}
                      onCheckedChange={() => handleToggleColumn(column.id)}
                    />
                    <Label htmlFor={column.id} className="font-normal cursor-pointer">
                      {column.label}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Ingen kolonner tilgængelige</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => {}}>
            Annuller
          </Button>
          <Button onClick={handleExport} disabled={selectedColumns.length === 0}>
            <Download className="h-4 w-4" />
            Eksporter ({selectedColumns.length} kolonner)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
