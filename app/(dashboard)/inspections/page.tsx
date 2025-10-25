"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "@/components/ui/input-group"
import { ClipboardCheck, Search, MoreVertical, Eye, CheckCircle2, Clock, AlertTriangle, Calendar } from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { ExportDialog } from "@/components/export-dialog"
import { BulkActions } from "@/components/bulk-actions"

// Mock data
const mockInspections = [
  {
    id: "1",
    equipment: "Caterpillar 320 Gravemaskine",
    type: "check-in",
    scheduledDate: "2024-11-17",
    scheduledTime: "09:00",
    customer: "Jensen Entreprise",
    status: "scheduled",
    inspector: "John Doe",
  },
  {
    id: "2",
    equipment: "Volvo EC220 Gravemaskine",
    type: "check-out",
    scheduledDate: "2024-11-17",
    scheduledTime: "11:30",
    customer: "Andersen Byg",
    status: "scheduled",
    inspector: "Jane Smith",
  },
  {
    id: "3",
    equipment: "Bobcat S650 Kompaktlæsser",
    type: "check-in",
    scheduledDate: "2024-11-17",
    scheduledTime: "14:00",
    customer: "Nielsen A/S",
    status: "overdue",
    inspector: "John Doe",
  },
]

const mockCompletedInspections = [
  {
    id: "1",
    equipment: "JCB 3CX Rendegraver",
    type: "check-in",
    completedDate: "2024-11-16",
    completedTime: "10:30",
    customer: "Mortensen Byg",
    status: "completed",
    inspector: "Jane Smith",
    issues: 0,
  },
  {
    id: "2",
    equipment: "Komatsu PC210 Gravemaskine",
    type: "check-out",
    completedDate: "2024-11-15",
    completedTime: "15:45",
    customer: "Petersen A/S",
    status: "completed",
    inspector: "John Doe",
    issues: 2,
  },
]

const statusConfig = {
  scheduled: { label: "Planlagt", variant: "secondary" as const, icon: Calendar },
  overdue: { label: "Forfalden", variant: "destructive" as const, icon: AlertTriangle },
  "in-progress": { label: "I Gang", variant: "default" as const, icon: Clock },
  completed: { label: "Afsluttet", variant: "outline" as const, icon: CheckCircle2 },
}

const typeConfig = {
  "check-in": { label: "Ind-Check", color: "text-chart-3" },
  "check-out": { label: "Ud-Check", color: "text-chart-4" },
  periodic: { label: "Periodisk", color: "text-chart-2" },
}

export default function InspectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const toggleSelectAll = (items: typeof mockInspections) => {
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map((item) => item.id))
    }
  }

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleExport = (format: string, columns: string[]) => {
    console.log("[v0] Exporting inspections:", { format, columns })
  }

  const exportColumns = [
    { id: "equipment", label: "Udstyr" },
    { id: "type", label: "Type" },
    { id: "customer", label: "Kunde" },
    { id: "date", label: "Dato" },
    { id: "time", label: "Tid" },
    { id: "inspector", label: "Inspektør" },
    { id: "status", label: "Status" },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inspektioner</h1>
          <p className="text-muted-foreground mt-1">Administrer udstyrsinspektioner og tjek</p>
        </div>
        <ExportDialog onExport={handleExport} availableColumns={exportColumns} />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">I Dag</CardTitle>
            <Calendar className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockInspections.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Planlagte inspektioner</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forfaldne</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockInspections.filter((i) => i.status === "overdue").length}</div>
            <p className="text-xs text-destructive font-medium mt-1">Kræver handling</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Afsluttede</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCompletedInspections.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Denne uge</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Med Problemer</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCompletedInspections.filter((i) => i.issues > 0).length}</div>
            <p className="text-xs text-muted-foreground mt-1">Kræver opfølgning</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <InputGroup>
                <InputGroupAddon>
                  <Search className="h-4 w-4" />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Søg efter inspektioner, udstyr eller kunder..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton onClick={() => setSearchQuery("")}>Ryd</InputGroupButton>
                  </InputGroupAddon>
                )}
              </InputGroup>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="scheduled">Planlagt</SelectItem>
                  <SelectItem value="overdue">Forfalden</SelectItem>
                  <SelectItem value="in-progress">I Gang</SelectItem>
                  <SelectItem value="completed">Afsluttet</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Typer</SelectItem>
                  <SelectItem value="check-in">Ind-Check</SelectItem>
                  <SelectItem value="check-out">Ud-Check</SelectItem>
                  <SelectItem value="periodic">Periodisk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Toolbar */}
      {selectedItems.length > 0 && (
        <BulkActions
          selectedCount={selectedItems.length}
          onClearSelection={() => setSelectedItems([])}
          onExport={() => console.log("[v0] Export selected items")}
          onDelete={() => {
            console.log("[v0] Delete selected items")
            setSelectedItems([])
          }}
        />
      )}

      {/* Tabs */}
      <Tabs defaultValue="scheduled" className="space-y-4">
        <TabsList className="inline-flex w-full overflow-x-auto">
          <TabsTrigger value="scheduled" className="flex-shrink-0">
            Planlagte ({mockInspections.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-shrink-0">
            Afsluttede ({mockCompletedInspections.length})
          </TabsTrigger>
        </TabsList>

        {/* Scheduled Inspections */}
        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedItems.length === mockInspections.length}
                      onCheckedChange={() => toggleSelectAll(mockInspections)}
                      aria-label="Vælg alle"
                    />
                  </TableHead>
                  <TableHead>Udstyr</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Dato</TableHead>
                  <TableHead>Tid</TableHead>
                  <TableHead>Inspektør</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInspections.map((inspection) => (
                  <TableRow key={inspection.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(inspection.id)}
                        onCheckedChange={() => toggleSelectItem(inspection.id)}
                        aria-label={`Vælg ${inspection.equipment}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/inspections/${inspection.id}`} className="hover:underline">
                        {inspection.equipment}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={typeConfig[inspection.type as keyof typeof typeConfig].color}>
                        {typeConfig[inspection.type as keyof typeof typeConfig].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{inspection.customer}</TableCell>
                    <TableCell>{inspection.scheduledDate}</TableCell>
                    <TableCell>{inspection.scheduledTime}</TableCell>
                    <TableCell className="text-muted-foreground">{inspection.inspector}</TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[inspection.status as keyof typeof statusConfig].variant}>
                        {statusConfig[inspection.status as keyof typeof statusConfig].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Åbn menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/inspections/${inspection.id}`}>
                              <Eye className="h-4 w-4" />
                              Se Detaljer
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle2 className="h-4 w-4" />
                            Start Inspektion
                          </DropdownMenuItem>
                          <DropdownMenuItem>Omplan</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Annuller</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Completed Inspections */}
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Udstyr</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Afsluttet</TableHead>
                  <TableHead>Tid</TableHead>
                  <TableHead>Inspektør</TableHead>
                  <TableHead>Problemer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCompletedInspections.map((inspection) => (
                  <TableRow key={inspection.id}>
                    <TableCell className="font-medium">
                      <Link href={`/inspections/${inspection.id}`} className="hover:underline">
                        {inspection.equipment}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={typeConfig[inspection.type as keyof typeof typeConfig].color}>
                        {typeConfig[inspection.type as keyof typeof typeConfig].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{inspection.customer}</TableCell>
                    <TableCell>{inspection.completedDate}</TableCell>
                    <TableCell>{inspection.completedTime}</TableCell>
                    <TableCell className="text-muted-foreground">{inspection.inspector}</TableCell>
                    <TableCell>
                      {inspection.issues > 0 ? (
                        <Badge variant="destructive">{inspection.issues} problem(er)</Badge>
                      ) : (
                        <Badge variant="secondary">Ingen</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[inspection.status as keyof typeof statusConfig].variant}>
                        {statusConfig[inspection.status as keyof typeof statusConfig].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Åbn menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/inspections/${inspection.id}`}>
                              <Eye className="h-4 w-4" />
                              Se Rapport
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
