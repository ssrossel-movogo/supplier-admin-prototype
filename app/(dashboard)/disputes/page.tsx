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
import { AlertTriangle, Search, MoreVertical, Eye, CheckCircle2, XCircle, Clock, DollarSign } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { ExportDialog } from "@/components/export-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { BulkActions } from "@/components/bulk-actions"

// Mock data
const mockDisputes = [
  {
    id: "1",
    equipment: "Volvo EC220 Gravemaskine",
    customer: "Andersen Byg",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    type: "damage",
    description: "Hydraulisk slange beskadiget",
    reportedDate: "2024-11-15",
    status: "open",
    severity: "medium",
    estimatedCost: "3.500 kr",
  },
  {
    id: "2",
    equipment: "Caterpillar 320",
    customer: "Jensen Entreprise",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    type: "damage",
    description: "Ridser på kabine",
    reportedDate: "2024-11-16",
    status: "under-review",
    severity: "low",
    estimatedCost: "1.200 kr",
  },
]

const mockResolvedDisputes = [
  {
    id: "1",
    equipment: "JCB 3CX Rendegraver",
    customer: "Mortensen Byg",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    type: "damage",
    description: "Punkteret dæk",
    reportedDate: "2024-11-10",
    resolvedDate: "2024-11-14",
    status: "resolved",
    severity: "low",
    finalCost: "850 kr",
    resolution: "Kunde accepterede ansvar",
  },
  {
    id: "2",
    equipment: "Bobcat S650",
    customer: "Nielsen A/S",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    type: "dispute",
    description: "Uenighed om brændstofforbrug",
    reportedDate: "2024-11-08",
    resolvedDate: "2024-11-12",
    status: "resolved",
    severity: "medium",
    finalCost: "0 kr",
    resolution: "Forlig indgået - ingen omkostninger",
  },
]

const statusConfig = {
  open: { label: "Åben", variant: "destructive" as const },
  "under-review": { label: "Under Behandling", variant: "secondary" as const },
  resolved: { label: "Løst", variant: "outline" as const },
  rejected: { label: "Afvist", variant: "outline" as const },
}

const severityConfig = {
  low: { label: "Lav", variant: "secondary" as const },
  medium: { label: "Mellem", variant: "default" as const },
  high: { label: "Høj", variant: "destructive" as const },
}

const typeConfig = {
  damage: { label: "Skade", color: "text-destructive" },
  dispute: { label: "Tvist", color: "text-accent" },
  complaint: { label: "Klage", color: "text-chart-4" },
}

export default function DisputesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const toggleSelectAll = (items: typeof mockDisputes) => {
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map((item) => item.id))
    }
  }

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skader & Tvister</h1>
          <p className="text-muted-foreground mt-1">Administrer skaderapporter og tvister</p>
        </div>
        <ExportDialog
          title="Eksporter Tvister"
          description="Vælg format og kolonner til eksport"
          columns={["Udstyr", "Kunde", "Type", "Beskrivelse", "Rapporteret", "Alvorlighed", "Omkostning", "Status"]}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Åbne Sager</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDisputes.filter((d) => d.status === "open").length}</div>
            <p className="text-xs text-destructive font-medium mt-1">Kræver handling</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Behandling</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDisputes.filter((d) => d.status === "under-review").length}</div>
            <p className="text-xs text-muted-foreground mt-1">I proces</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Løste Denne Måned</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockResolvedDisputes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">+2 fra sidste måned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimerede Omkostninger</CardTitle>
            <DollarSign className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.700 kr</div>
            <p className="text-xs text-muted-foreground mt-1">Åbne sager</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <InputGroup>
                  <InputGroupAddon>
                    <Search className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder="Søg efter sager, udstyr eller kunder..."
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
                    <SelectItem value="open">Åben</SelectItem>
                    <SelectItem value="under-review">Under Behandling</SelectItem>
                    <SelectItem value="resolved">Løst</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Alvorlighed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Niveauer</SelectItem>
                    <SelectItem value="low">Lav</SelectItem>
                    <SelectItem value="medium">Mellem</SelectItem>
                    <SelectItem value="high">Høj</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="inline-flex w-full overflow-x-auto">
          <TabsTrigger value="active" className="flex-shrink-0">
            Aktive ({mockDisputes.length})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="flex-shrink-0">
            Løste ({mockResolvedDisputes.length})
          </TabsTrigger>
        </TabsList>

        {/* Active Disputes */}
        <TabsContent value="active" className="space-y-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedItems.length === mockDisputes.length}
                      onCheckedChange={() => toggleSelectAll(mockDisputes)}
                      aria-label="Vælg alle"
                    />
                  </TableHead>
                  <TableHead>Udstyr</TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Beskrivelse</TableHead>
                  <TableHead>Rapporteret</TableHead>
                  <TableHead>Alvorlighed</TableHead>
                  <TableHead>Est. Omkostning</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDisputes.map((dispute) => (
                  <TableRow key={dispute.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(dispute.id)}
                        onCheckedChange={() => toggleSelectItem(dispute.id)}
                        aria-label={`Vælg ${dispute.equipment}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/disputes/${dispute.id}`} className="hover:underline">
                        {dispute.equipment}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={dispute.customerAvatar || "/placeholder.svg"} alt={dispute.customer} />
                          <AvatarFallback>{dispute.customer.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span>{dispute.customer}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={typeConfig[dispute.type as keyof typeof typeConfig].color}>
                        {typeConfig[dispute.type as keyof typeof typeConfig].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{dispute.description}</TableCell>
                    <TableCell>{dispute.reportedDate}</TableCell>
                    <TableCell>
                      <Badge variant={severityConfig[dispute.severity as keyof typeof severityConfig].variant}>
                        {severityConfig[dispute.severity as keyof typeof severityConfig].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{dispute.estimatedCost}</TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[dispute.status as keyof typeof statusConfig].variant}>
                        {statusConfig[dispute.status as keyof typeof statusConfig].label}
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
                            <Link href={`/disputes/${dispute.id}`}>
                              <Eye className="h-4 w-4" />
                              Se Detaljer
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle2 className="h-4 w-4" />
                            Marker som Løst
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <XCircle className="h-4 w-4" />
                            Afvis Sag
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

        {/* Resolved Disputes */}
        <TabsContent value="resolved" className="space-y-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Udstyr</TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Beskrivelse</TableHead>
                  <TableHead>Rapporteret</TableHead>
                  <TableHead>Løst</TableHead>
                  <TableHead>Endelig Omkostning</TableHead>
                  <TableHead>Løsning</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockResolvedDisputes.map((dispute) => (
                  <TableRow key={dispute.id}>
                    <TableCell className="font-medium">
                      <Link href={`/disputes/${dispute.id}`} className="hover:underline">
                        {dispute.equipment}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={dispute.customerAvatar || "/placeholder.svg"} alt={dispute.customer} />
                          <AvatarFallback>{dispute.customer.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span>{dispute.customer}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={typeConfig[dispute.type as keyof typeof typeConfig].color}>
                        {typeConfig[dispute.type as keyof typeof typeConfig].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{dispute.description}</TableCell>
                    <TableCell>{dispute.reportedDate}</TableCell>
                    <TableCell>{dispute.resolvedDate}</TableCell>
                    <TableCell className="font-medium">{dispute.finalCost}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm">
                      {dispute.resolution}
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
                            <Link href={`/disputes/${dispute.id}`}>
                              <Eye className="h-4 w-4" />
                              Se Detaljer
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
