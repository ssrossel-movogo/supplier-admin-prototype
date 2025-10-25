"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Users, Search, Plus, MoreVertical, Eye, Edit, Trash2, Building2, TrendingUp, CheckCircle2 } from "lucide-react"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { BulkActions } from "@/components/bulk-actions"
import { ExportDialog } from "@/components/export-dialog"

// Mock data
const customers = [
  {
    id: 1,
    name: "Jensen Entreprise A/S",
    contactPerson: "Lars Jensen",
    email: "lars@jensen-entreprise.dk",
    phone: "+45 12 34 56 78",
    activeRentals: 3,
    totalRentals: 24,
    totalRevenue: 145200,
    status: "active",
    creditLimit: 250000,
    creditUsed: 45000,
    region: "Sjælland",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Andersen Byg ApS",
    contactPerson: "Mette Andersen",
    email: "mette@andersen-byg.dk",
    phone: "+45 23 45 67 89",
    activeRentals: 2,
    totalRentals: 18,
    totalRevenue: 98500,
    status: "active",
    creditLimit: 150000,
    creditUsed: 32000,
    region: "Jylland",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Nielsen Anlæg A/S",
    contactPerson: "Peter Nielsen",
    email: "peter@nielsen-anlaeg.dk",
    phone: "+45 34 56 78 90",
    activeRentals: 5,
    totalRentals: 42,
    totalRevenue: 287300,
    status: "active",
    creditLimit: 500000,
    creditUsed: 125000,
    region: "Sjælland",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Hansen Entreprise",
    contactPerson: "Søren Hansen",
    email: "soeren@hansen-entreprise.dk",
    phone: "+45 45 67 89 01",
    activeRentals: 0,
    totalRentals: 8,
    totalRevenue: 42100,
    status: "warning",
    creditLimit: 100000,
    creditUsed: 95000,
    region: "Fyn",
    rating: 3.8,
  },
  {
    id: 5,
    name: "Petersen Byg & Anlæg",
    contactPerson: "Anne Petersen",
    email: "anne@petersen-byg.dk",
    phone: "+45 56 78 90 12",
    activeRentals: 1,
    totalRentals: 15,
    totalRevenue: 67800,
    status: "active",
    creditLimit: 200000,
    creditUsed: 28000,
    region: "Jylland",
    rating: 4.6,
  },
  {
    id: 6,
    name: "Larsen A/S",
    contactPerson: "Thomas Larsen",
    email: "thomas@larsen.dk",
    phone: "+45 67 89 01 23",
    activeRentals: 0,
    totalRentals: 3,
    totalRevenue: 12400,
    status: "inactive",
    creditLimit: 50000,
    creditUsed: 0,
    region: "Sjælland",
    rating: 4.2,
  },
]

const statusConfig = {
  active: { label: "Aktiv", variant: "default" as const, color: "text-chart-3" },
  warning: { label: "Advarsel", variant: "destructive" as const, color: "text-destructive" },
  inactive: { label: "Inaktiv", variant: "secondary" as const, color: "text-muted-foreground" },
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [regionFilter, setRegionFilter] = React.useState("all")
  const [selectedItems, setSelectedItems] = React.useState<number[]>([])

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    const matchesRegion = regionFilter === "all" || customer.region === regionFilter
    return matchesSearch && matchesStatus && matchesRegion
  })

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === "active").length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalRevenue, 0),
    avgRating: (customers.reduce((sum, c) => sum + c.rating, 0) / customers.length).toFixed(1),
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredCustomers.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredCustomers.map((c) => c.id))
    }
  }

  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kunder</h1>
          <p className="text-muted-foreground mt-1">Administrer dine kundeorganisationer og kontakter</p>
        </div>
        <div className="flex gap-2">
          <ExportDialog
            title="Eksporter Kunder"
            description="Vælg format og kolonner til eksport"
            columns={[
              "Kunde",
              "Kontaktperson",
              "Region",
              "Aktive Udlejninger",
              "Total Udlejninger",
              "Omsætning",
              "Kredit",
              "Status",
            ]}
          />
          <Button>
            <Plus className="h-4 w-4" />
            Tilføj Kunde
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale Kunder</CardTitle>
            <Users className="h-4 w-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.active} aktive</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Udlejninger</CardTitle>
            <Building2 className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.reduce((sum, c) => sum + c.activeRentals, 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">På tværs af alle kunder</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Omsætning</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString("da-DK")} kr</div>
            <p className="text-xs text-muted-foreground mt-1">Livstid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gns. Vurdering</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRating}</div>
            <p className="text-xs text-muted-foreground mt-1">Ud af 5.0</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <InputGroup>
                <InputGroupAddon>
                  <Search className="h-4 w-4" />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Søg efter kunde, kontaktperson eller email..."
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Statuser</SelectItem>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="warning">Advarsel</SelectItem>
                <SelectItem value="inactive">Inaktiv</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Regioner</SelectItem>
                <SelectItem value="Sjælland">Sjælland</SelectItem>
                <SelectItem value="Jylland">Jylland</SelectItem>
                <SelectItem value="Fyn">Fyn</SelectItem>
              </SelectContent>
            </Select>
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

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Kundeliste</CardTitle>
          <CardDescription>
            Viser {filteredCustomers.length} af {customers.length} kunder
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Users />
                </EmptyMedia>
                <EmptyTitle>Ingen kunder fundet</EmptyTitle>
                <EmptyDescription>Prøv at justere dine søgekriterier eller tilføj en ny kunde.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button>
                  <Plus className="h-4 w-4" />
                  Tilføj Kunde
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedItems.length === filteredCustomers.length}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Vælg alle"
                    />
                  </TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Kontaktperson</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-right">Aktive</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Omsætning</TableHead>
                  <TableHead className="text-right">Kredit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Handlinger</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  const creditPercentage = (customer.creditUsed / customer.creditLimit) * 100
                  const creditStatus =
                    creditPercentage > 90 ? "destructive" : creditPercentage > 70 ? "default" : "secondary"

                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(customer.id)}
                          onCheckedChange={() => toggleSelectItem(customer.id)}
                          aria-label={`Vælg ${customer.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/customers/${customer.id}`}
                          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`/placeholder-32px.png?height=32&width=32`} />
                            <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">{customer.email}</p>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{customer.contactPerson}</p>
                          <p className="text-xs text-muted-foreground">{customer.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{customer.region}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium">{customer.activeRentals}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-muted-foreground">{customer.totalRentals}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium">{customer.totalRevenue.toLocaleString("da-DK")} kr</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant={creditStatus} className="text-xs">
                            {creditPercentage.toFixed(0)}%
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {customer.creditUsed.toLocaleString("da-DK")} /{" "}
                            {customer.creditLimit.toLocaleString("da-DK")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[customer.status].variant}>
                          {statusConfig[customer.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Åbn menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/customers/${customer.id}`}>
                                <Eye className="h-4 w-4" />
                                Se Detaljer
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4" />
                              Rediger
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive">
                              <Trash2 className="h-4 w-4" />
                              Slet
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
