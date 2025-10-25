"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "@/components/ui/input-group"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Checkbox } from "@/components/ui/checkbox"
import { Package, Plus, Search, MoreVertical, Eye, Edit, Trash2, Power, PowerOff, MapPin } from "lucide-react"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia, EmptyContent } from "@/components/ui/empty"
import Link from "next/link"
import { BulkActions } from "@/components/bulk-actions"
import { ExportDialog } from "@/components/export-dialog"

// Mock data - would come from API
const mockEquipment = [
  {
    id: "1",
    name: "Caterpillar 320 Gravemaskine",
    category: "Gravemaskiner",
    year: 2022,
    region: "Hovedstaden",
    depot: "København Nord",
    status: "available",
    utilization: 85,
    activeRentals: 2,
    price: "1.200 kr/dag",
  },
  {
    id: "2",
    name: "Volvo EC220 Gravemaskine",
    category: "Gravemaskiner",
    year: 2021,
    region: "Sjælland",
    depot: "Roskilde",
    status: "rented",
    utilization: 92,
    activeRentals: 1,
    price: "1.150 kr/dag",
  },
  {
    id: "3",
    name: "Bobcat S650 Kompaktlæsser",
    category: "Kompaktlæssere",
    year: 2023,
    region: "Hovedstaden",
    depot: "København Syd",
    status: "available",
    utilization: 78,
    activeRentals: 0,
    price: "850 kr/dag",
  },
  {
    id: "4",
    name: "JCB 3CX Rendegraver",
    category: "Rendegravere",
    year: 2020,
    region: "Midtjylland",
    depot: "Aarhus",
    status: "maintenance",
    utilization: 65,
    activeRentals: 0,
    price: "950 kr/dag",
  },
  {
    id: "5",
    name: "Komatsu PC210 Gravemaskine",
    category: "Gravemaskiner",
    year: 2022,
    region: "Nordjylland",
    depot: "Aalborg",
    status: "available",
    utilization: 88,
    activeRentals: 1,
    price: "1.180 kr/dag",
  },
  {
    id: "6",
    name: "Hitachi ZX130 Minigraver",
    category: "Minigravere",
    year: 2023,
    region: "Syddanmark",
    depot: "Odense",
    status: "unpublished",
    utilization: 0,
    activeRentals: 0,
    price: "750 kr/dag",
  },
]

const statusConfig = {
  available: { label: "Tilgængelig", variant: "default" as const, color: "text-chart-3" },
  rented: { label: "Udlejet", variant: "secondary" as const, color: "text-chart-4" },
  maintenance: { label: "Vedligeholdelse", variant: "destructive" as const, color: "text-destructive" },
  unpublished: { label: "Ikke Publiceret", variant: "outline" as const, color: "text-muted-foreground" },
}

export default function EquipmentPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const filteredEquipment = mockEquipment.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesRegion = regionFilter === "all" || item.region === regionFilter
    return matchesSearch && matchesStatus && matchesCategory && matchesRegion
  })

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredEquipment.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredEquipment.map((item) => item.id))
    }
  }

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Udstyr</h1>
          <p className="text-muted-foreground mt-1">Administrer dit udlejningsudstyr</p>
        </div>
        <div className="flex gap-2">
          <ExportDialog
            title="Eksporter Udstyr"
            description="Vælg format og kolonner til eksport"
            columns={["Navn", "Kategori", "År", "Lokation", "Status", "Udnyttelse", "Pris"]}
          />
          <Button asChild>
            <Link href="/new-equipment">
              <Plus className="h-4 w-4" />
              Tilføj Udstyr
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Udstyr</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEquipment.length}</div>
            <p className="text-xs text-muted-foreground mt-1">+2 fra sidste måned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tilgængelig</CardTitle>
            <Package className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEquipment.filter((e) => e.status === "available").length}</div>
            <p className="text-xs text-muted-foreground mt-1">Klar til udlejning</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Udlejet</CardTitle>
            <Package className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEquipment.filter((e) => e.status === "rented").length}</div>
            <p className="text-xs text-muted-foreground mt-1">Aktive udlejninger</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gns. Udnyttelse</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(mockEquipment.reduce((acc, e) => acc + e.utilization, 0) / mockEquipment.length)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Sidste 30 dage</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <InputGroup>
                <InputGroupAddon>
                  <Search className="h-4 w-4" />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Søg efter udstyr..."
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
                  <SelectItem value="available">Tilgængelig</SelectItem>
                  <SelectItem value="rented">Udlejet</SelectItem>
                  <SelectItem value="maintenance">Vedligeholdelse</SelectItem>
                  <SelectItem value="unpublished">Ikke Publiceret</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Kategorier</SelectItem>
                  <SelectItem value="Gravemaskiner">Gravemaskiner</SelectItem>
                  <SelectItem value="Kompaktlæssere">Kompaktlæssere</SelectItem>
                  <SelectItem value="Rendegravere">Rendegravere</SelectItem>
                  <SelectItem value="Minigravere">Minigravere</SelectItem>
                </SelectContent>
              </Select>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Regioner</SelectItem>
                  <SelectItem value="Hovedstaden">Hovedstaden</SelectItem>
                  <SelectItem value="Sjælland">Sjælland</SelectItem>
                  <SelectItem value="Midtjylland">Midtjylland</SelectItem>
                  <SelectItem value="Nordjylland">Nordjylland</SelectItem>
                  <SelectItem value="Syddanmark">Syddanmark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* Equipment Table */}
      {filteredEquipment.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Package />
                </EmptyMedia>
                <EmptyTitle>Intet udstyr fundet</EmptyTitle>
                <EmptyDescription>
                  {searchQuery || statusFilter !== "all" || categoryFilter !== "all" || regionFilter !== "all"
                    ? "Prøv at justere dine filtre for at se resultater."
                    : "Kom i gang ved at tilføje dit første udstyr."}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild>
                  <Link href="/new-equipment">
                    <Plus className="h-4 w-4" />
                    Tilføj Udstyr
                  </Link>
                </Button>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedItems.length === filteredEquipment.length}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Vælg alle"
                    />
                  </TableHead>
                  <TableHead>Navn</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>År</TableHead>
                  <TableHead>Lokation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Udnyttelse</TableHead>
                  <TableHead>Pris</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.map((equipment) => (
                  <TableRow key={equipment.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(equipment.id)}
                        onCheckedChange={() => toggleSelectItem(equipment.id)}
                        aria-label={`Vælg ${equipment.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/equipment/${equipment.id}`} className="hover:underline">
                        {equipment.name}
                      </Link>
                    </TableCell>
                    <TableCell>{equipment.category}</TableCell>
                    <TableCell>{equipment.year}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{equipment.depot}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[equipment.status as keyof typeof statusConfig].variant}>
                        {statusConfig[equipment.status as keyof typeof statusConfig].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-chart-3" style={{ width: `${equipment.utilization}%` }} />
                        </div>
                        <span className="text-sm text-muted-foreground">{equipment.utilization}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{equipment.price}</TableCell>
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
                            <Link href={`/equipment/${equipment.id}`}>
                              <Eye className="h-4 w-4" />
                              Se Detaljer
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/equipment/${equipment.id}/edit`}>
                              <Edit className="h-4 w-4" />
                              Rediger
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {equipment.status === "unpublished" ? (
                            <DropdownMenuItem>
                              <Power className="h-4 w-4" />
                              Publicer
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <PowerOff className="h-4 w-4" />
                              Afpublicer
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                            Slet
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Viser {filteredEquipment.length} af {mockEquipment.length} udstyr
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  )
}
