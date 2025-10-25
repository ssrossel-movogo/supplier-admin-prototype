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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "@/components/ui/input-group"
import {
  Calendar,
  Search,
  MoreVertical,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Trash2,
  Plus,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { PullToRefresh } from "@/components/pull-to-refresh"
import { SwipeableItem } from "@/components/swipeable-item"

// Mock data
const mockRentals = [
  {
    id: "1",
    equipment: "Caterpillar 320 Gravemaskine",
    customer: "Jensen Entreprise",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    startDate: "2024-11-15",
    endDate: "2024-11-20",
    status: "active",
    revenue: "6.000 kr",
    daysRemaining: 3,
  },
  {
    id: "2",
    equipment: "Volvo EC220 Gravemaskine",
    customer: "Andersen Byg",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    startDate: "2024-11-10",
    endDate: "2024-11-25",
    status: "active",
    revenue: "17.250 kr",
    daysRemaining: 8,
  },
  {
    id: "3",
    equipment: "Komatsu PC210 Gravemaskine",
    customer: "Nielsen A/S",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    startDate: "2024-11-18",
    endDate: "2024-11-22",
    status: "active",
    revenue: "4.720 kr",
    daysRemaining: 5,
  },
]

const mockPendingBookings = [
  {
    id: "1",
    equipment: "Caterpillar 320",
    customer: "Hansen Entreprise",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    startDate: "2024-11-25",
    endDate: "2024-11-30",
    status: "pending",
    estimatedRevenue: "8.500 kr",
    requestedAt: "2 timer siden",
  },
  {
    id: "2",
    equipment: "Komatsu PC210",
    customer: "Petersen Byg",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    startDate: "2024-11-28",
    endDate: "2024-12-05",
    status: "pending",
    estimatedRevenue: "9.200 kr",
    requestedAt: "5 timer siden",
  },
  {
    id: "3",
    equipment: "Hitachi ZX130",
    customer: "Larsen A/S",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    startDate: "2024-12-01",
    endDate: "2024-12-08",
    status: "pending",
    estimatedRevenue: "7.800 kr",
    requestedAt: "1 dag siden",
  },
]

const mockCompletedRentals = [
  {
    id: "1",
    equipment: "JCB 3CX Rendegraver",
    customer: "Mortensen Byg",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    startDate: "2024-10-15",
    endDate: "2024-10-22",
    status: "completed",
    revenue: "6.650 kr",
    completedAt: "3 dage siden",
  },
  {
    id: "2",
    equipment: "Bobcat S650",
    customer: "Sørensen A/S",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    startDate: "2024-10-20",
    endDate: "2024-10-27",
    status: "completed",
    revenue: "5.950 kr",
    completedAt: "1 uge siden",
  },
]

const statusConfig = {
  active: { label: "Aktiv", variant: "default" as const },
  pending: { label: "Afventer", variant: "secondary" as const },
  completed: { label: "Afsluttet", variant: "outline" as const },
  cancelled: { label: "Annulleret", variant: "destructive" as const },
}

export default function RentalsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleRefresh = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("[v0] Refreshed rentals data")
  }

  const handleApprove = (id: string) => {
    console.log("[v0] Approved booking:", id)
  }

  const handleReject = (id: string) => {
    console.log("[v0] Rejected booking:", id)
  }

  const handleDelete = (id: string) => {
    console.log("[v0] Deleted rental:", id)
  }

  return (
    <PullToRefresh onRefresh={handleRefresh} className="h-full">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header with create button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold tracking-tight">Udlejninger</h1>
            <p className="text-muted-foreground mt-1">Administrer aktive og afventende udlejninger</p>
          </div>
          <Button asChild className="w-full sm:w-auto flex-shrink-0">
            <Link href="/new-rental">
              <Plus className="h-4 w-4" />
              Ny Booking
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktive Udlejninger</CardTitle>
              <Calendar className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockRentals.length}</div>
              <p className="text-xs text-muted-foreground mt-1">+2 fra i går</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Afventende Bookinger</CardTitle>
              <Clock className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPendingBookings.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Kræver handling</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Denne Måned</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground mt-1">+15% fra sidste måned</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Omsætning</CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">145.200 kr</div>
              <p className="text-xs text-muted-foreground mt-1">Denne måned</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <InputGroup>
                  <InputGroupAddon>
                    <Search className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder="Søg efter udlejninger, kunder eller udstyr..."
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
                    <SelectItem value="active">Aktiv</SelectItem>
                    <SelectItem value="pending">Afventer</SelectItem>
                    <SelectItem value="completed">Afsluttet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="inline-flex w-full overflow-x-auto">
            <TabsTrigger value="active" className="flex-shrink-0">
              Aktive ({mockRentals.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex-shrink-0">
              Afventende ({mockPendingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-shrink-0">
              Afsluttede ({mockCompletedRentals.length})
            </TabsTrigger>
          </TabsList>

          {/* Active Rentals */}
          <TabsContent value="active" className="space-y-4">
            <Card>
              {/* Desktop view - keep table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Udstyr</TableHead>
                      <TableHead>Kunde</TableHead>
                      <TableHead>Startdato</TableHead>
                      <TableHead>Slutdato</TableHead>
                      <TableHead>Dage Tilbage</TableHead>
                      <TableHead>Omsætning</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRentals.map((rental) => (
                      <TableRow key={rental.id}>
                        <TableCell className="font-medium">
                          <Link href={`/rentals/${rental.id}`} className="hover:underline">
                            {rental.equipment}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={rental.customerAvatar || "/placeholder.svg"} alt={rental.customer} />
                              <AvatarFallback>{rental.customer.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span>{rental.customer}</span>
                          </div>
                        </TableCell>
                        <TableCell>{rental.startDate}</TableCell>
                        <TableCell>{rental.endDate}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{rental.daysRemaining} dage</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{rental.revenue}</TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[rental.status as keyof typeof statusConfig].variant}>
                            {statusConfig[rental.status as keyof typeof statusConfig].label}
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
                                <Link href={`/rentals/${rental.id}`}>
                                  <Eye className="h-4 w-4" />
                                  Se Detaljer
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Forlæng Udlejning</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Annuller Udlejning</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden">
                <CardContent className="p-0">
                  {mockRentals.map((rental) => (
                    <SwipeableItem
                      key={rental.id}
                      rightActions={[
                        {
                          label: "Se",
                          icon: <Eye className="h-4 w-4" />,
                          onClick: () => console.log("[v0] View rental:", rental.id),
                          variant: "default",
                        },
                        {
                          label: "Slet",
                          icon: <Trash2 className="h-4 w-4" />,
                          onClick: () => handleDelete(rental.id),
                          variant: "destructive",
                        },
                      ]}
                    >
                      <div className="p-4 border-b">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              <Link href={`/rentals/${rental.id}`} className="hover:underline">
                                {rental.equipment}
                              </Link>
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={rental.customerAvatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">{rental.customer.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{rental.customer}</span>
                            </div>
                          </div>
                          <Badge variant={statusConfig[rental.status as keyof typeof statusConfig].variant}>
                            {statusConfig[rental.status as keyof typeof statusConfig].label}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {rental.startDate} - {rental.endDate}
                          </span>
                          <span className="font-medium text-foreground">{rental.revenue}</span>
                        </div>
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {rental.daysRemaining} dage tilbage
                          </Badge>
                        </div>
                      </div>
                    </SwipeableItem>
                  ))}
                </CardContent>
              </div>
            </Card>
          </TabsContent>

          {/* Pending Bookings */}
          <TabsContent value="pending" className="space-y-4">
            <Card>
              {/* Desktop view - keep table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Udstyr</TableHead>
                      <TableHead>Kunde</TableHead>
                      <TableHead>Startdato</TableHead>
                      <TableHead>Slutdato</TableHead>
                      <TableHead>Anmodet</TableHead>
                      <TableHead>Forventet Omsætning</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPendingBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          <Link href={`/rentals/${booking.id}`} className="hover:underline">
                            {booking.equipment}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={booking.customerAvatar || "/placeholder.svg"} alt={booking.customer} />
                              <AvatarFallback>{booking.customer.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span>{booking.customer}</span>
                          </div>
                        </TableCell>
                        <TableCell>{booking.startDate}</TableCell>
                        <TableCell>{booking.endDate}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{booking.requestedAt}</TableCell>
                        <TableCell className="font-medium">{booking.estimatedRevenue}</TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[booking.status as keyof typeof statusConfig].variant}>
                            {statusConfig[booking.status as keyof typeof statusConfig].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="default" className="h-8">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Godkend
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 bg-transparent">
                              <XCircle className="h-3.5 w-3.5" />
                              Afvis
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden">
                <CardContent className="p-0">
                  {mockPendingBookings.map((booking) => (
                    <SwipeableItem
                      key={booking.id}
                      leftActions={[
                        {
                          label: "Godkend",
                          icon: <CheckCircle2 className="h-4 w-4" />,
                          onClick: () => handleApprove(booking.id),
                          variant: "success",
                        },
                      ]}
                      rightActions={[
                        {
                          label: "Afvis",
                          icon: <XCircle className="h-4 w-4" />,
                          onClick: () => handleReject(booking.id),
                          variant: "destructive",
                        },
                      ]}
                    >
                      <div className="p-4 border-b">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              <Link href={`/rentals/${booking.id}`} className="hover:underline">
                                {booking.equipment}
                              </Link>
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={booking.customerAvatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">{booking.customer.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{booking.customer}</span>
                            </div>
                          </div>
                          <Badge variant={statusConfig[booking.status as keyof typeof statusConfig].variant}>
                            {statusConfig[booking.status as keyof typeof statusConfig].label}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {booking.startDate} - {booking.endDate}
                          </span>
                          <span className="font-medium text-foreground">{booking.estimatedRevenue}</span>
                        </div>
                        <div className="mt-2">
                          <span className="text-xs text-muted-foreground">Anmodet {booking.requestedAt}</span>
                        </div>
                        <div className="mt-3 flex gap-2 md:hidden">
                          <Button size="sm" className="flex-1" onClick={() => handleApprove(booking.id)}>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Godkend
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => handleReject(booking.id)}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Afvis
                          </Button>
                        </div>
                      </div>
                    </SwipeableItem>
                  ))}
                </CardContent>
              </div>
            </Card>
          </TabsContent>

          {/* Completed Rentals */}
          <TabsContent value="completed" className="space-y-4">
            <Card>
              {/* Desktop view - keep table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Udstyr</TableHead>
                      <TableHead>Kunde</TableHead>
                      <TableHead>Startdato</TableHead>
                      <TableHead>Slutdato</TableHead>
                      <TableHead>Afsluttet</TableHead>
                      <TableHead>Omsætning</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCompletedRentals.map((rental) => (
                      <TableRow key={rental.id}>
                        <TableCell className="font-medium">
                          <Link href={`/rentals/${rental.id}`} className="hover:underline">
                            {rental.equipment}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={rental.customerAvatar || "/placeholder.svg"} alt={rental.customer} />
                              <AvatarFallback>{rental.customer.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span>{rental.customer}</span>
                          </div>
                        </TableCell>
                        <TableCell>{rental.startDate}</TableCell>
                        <TableCell>{rental.endDate}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{rental.completedAt}</TableCell>
                        <TableCell className="font-medium">{rental.revenue}</TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[rental.status as keyof typeof statusConfig].variant}>
                            {statusConfig[rental.status as keyof typeof statusConfig].label}
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
                                <Link href={`/rentals/${rental.id}`}>
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
              </div>

              <div className="md:hidden">
                <CardContent className="p-0">
                  {mockCompletedRentals.map((rental) => (
                    <SwipeableItem
                      key={rental.id}
                      rightActions={[
                        {
                          label: "Se",
                          icon: <Eye className="h-4 w-4" />,
                          onClick: () => console.log("[v0] View rental:", rental.id),
                          variant: "default",
                        },
                      ]}
                    >
                      <div className="p-4 border-b">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              <Link href={`/rentals/${rental.id}`} className="hover:underline">
                                {rental.equipment}
                              </Link>
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={rental.customerAvatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">{rental.customer.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{rental.customer}</span>
                            </div>
                          </div>
                          <Badge variant={statusConfig[rental.status as keyof typeof statusConfig].variant}>
                            {statusConfig[rental.status as keyof typeof statusConfig].label}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {rental.startDate} - {rental.endDate}
                          </span>
                          <span className="font-medium text-foreground">{rental.revenue}</span>
                        </div>
                        <div className="mt-2">
                          <span className="text-xs text-muted-foreground">Afsluttet {rental.completedAt}</span>
                        </div>
                      </div>
                    </SwipeableItem>
                  ))}
                </CardContent>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PullToRefresh>
  )
}
