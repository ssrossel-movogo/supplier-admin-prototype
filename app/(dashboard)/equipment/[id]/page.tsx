"use client"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Edit, Calendar, History, AlertTriangle, FileText, MapPin } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { EquipmentCalendar } from "@/components/equipment-calendar"
import Link from "next/link"

// Mock data - would come from loader
const equipment = {
  id: "EQ-001",
  name: "Caterpillar 320 Gravemaskine",
  category: "Gravemaskiner",
  manufacturer: "Caterpillar",
  model: "320",
  year: 2022,
  serialNumber: "CAT320-2022-001",
  status: "available",
  location: "København Depot",
  dailyRate: 850,
  weeklyRate: 4500,
  monthlyRate: 15000,
  utilization: 85,
  totalRentals: 24,
  totalRevenue: 145200,
  lastInspection: "2024-11-10",
  nextInspection: "2024-12-10",
  specifications: {
    weight: "20 tons",
    power: "121 kW",
    bucketCapacity: "1.2 m³",
    maxDigDepth: "6.5 m",
  },
}

const rentalHistory = [
  {
    id: 1,
    customer: "Jensen Entreprise",
    startDate: "2024-10-15",
    endDate: "2024-10-22",
    duration: "7 dage",
    revenue: 4500,
    status: "completed",
  },
  {
    id: 2,
    customer: "Andersen Byg",
    startDate: "2024-09-20",
    endDate: "2024-10-05",
    duration: "15 dage",
    revenue: 12750,
    status: "completed",
  },
  {
    id: 3,
    customer: "Nielsen Anlæg",
    startDate: "2024-08-10",
    endDate: "2024-08-17",
    duration: "7 dage",
    revenue: 4500,
    status: "completed",
  },
]

const maintenanceHistory = [
  { id: 1, date: "2024-11-10", type: "Rutinetjek", technician: "John Doe", cost: 1200, notes: "Alt OK" },
  {
    id: 2,
    date: "2024-09-15",
    type: "Olieskift",
    technician: "Jane Smith",
    cost: 800,
    notes: "Olie og filtre skiftet",
  },
  {
    id: 3,
    date: "2024-07-20",
    type: "Reparation",
    technician: "Mike Johnson",
    cost: 3500,
    notes: "Hydraulikslange udskiftet",
  },
]

const blackoutDates = [
  { id: 1, startDate: "2024-12-15", endDate: "2024-12-20", reason: "Planlagt vedligeholdelse" },
  { id: 2, startDate: "2024-12-24", endDate: "2025-01-02", reason: "Juleferie" },
]

const statusConfig = {
  available: { label: "Tilgængelig", variant: "default" as const },
  rented: { label: "Udlejet", variant: "secondary" as const },
  maintenance: { label: "Vedligeholdelse", variant: "destructive" as const },
  unavailable: { label: "Utilgængelig", variant: "outline" as const },
}

export default function EquipmentDetailPage() {
  const router = useRouter()
  const params = useParams()

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight truncate">{equipment.name}</h1>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={statusConfig[equipment.status].variant}>{statusConfig[equipment.status].label}</Badge>
            <span className="text-sm text-muted-foreground">
              {equipment.serialNumber} • {equipment.location}
            </span>
          </div>
          <Button className="sm:ml-auto w-full sm:w-auto" asChild>
            <Link href={`/equipment/${params.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Rediger
            </Link>
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dagspris</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipment.dailyRate.toLocaleString("da-DK")} kr</div>
            <p className="text-xs text-muted-foreground mt-1">Uge: {equipment.weeklyRate.toLocaleString("da-DK")} kr</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Udnyttelse</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipment.utilization}%</div>
            <p className="text-xs text-muted-foreground mt-1">{equipment.totalRentals} udlejninger</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Omsætning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipment.totalRevenue.toLocaleString("da-DK")} kr</div>
            <p className="text-xs text-muted-foreground mt-1">Livstid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Næste Inspektion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Date(equipment.nextInspection).toLocaleDateString("da-DK")}</div>
            <p className="text-xs text-muted-foreground mt-1">Om 16 dage</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="inline-flex w-full overflow-x-auto">
          <TabsTrigger value="details" className="flex-shrink-0">
            <FileText className="h-4 w-4" />
            <span className="ml-2">Detaljer</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-shrink-0">
            <History className="h-4 w-4" />
            <span className="ml-2">Udlejningshistorik</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex-shrink-0">
            <AlertTriangle className="h-4 w-4" />
            <span className="ml-2">Vedligeholdelse</span>
          </TabsTrigger>
          <TabsTrigger value="availability" className="flex-shrink-0">
            <Calendar className="h-4 w-4" />
            <span className="ml-2">Tilgængelighed</span>
          </TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6 bg-transparent">
          <Card>
            <CardHeader>
              <CardTitle>Grundlæggende Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Kategori</p>
                <p className="font-medium">{equipment.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Producent</p>
                <p className="font-medium">{equipment.manufacturer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Model</p>
                <p className="font-medium">{equipment.model}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Årgang</p>
                <p className="font-medium">{equipment.year}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Serienummer</p>
                <p className="font-medium">{equipment.serialNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lokation</p>
                <p className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {equipment.location}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specifikationer</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {Object.entries(equipment.specifications).map(([key, value]) => (
                <div key={key}>
                  <p className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                  <p className="font-medium">{value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prissætning</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Dagspris</p>
                <p className="text-xl font-bold">{equipment.dailyRate.toLocaleString("da-DK")} kr</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ugepris</p>
                <p className="text-xl font-bold">{equipment.weeklyRate.toLocaleString("da-DK")} kr</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Månedspris</p>
                <p className="text-xl font-bold">{equipment.monthlyRate.toLocaleString("da-DK")} kr</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rental History Tab */}
        <TabsContent value="history" className="bg-transparent">
          <Card>
            <CardHeader>
              <CardTitle>Udlejningshistorik</CardTitle>
              <CardDescription>Tidligere udlejninger af dette udstyr</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kunde</TableHead>
                    <TableHead>Startdato</TableHead>
                    <TableHead>Slutdato</TableHead>
                    <TableHead>Varighed</TableHead>
                    <TableHead className="text-right">Omsætning</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rentalHistory.map((rental) => (
                    <TableRow key={rental.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {rental.customer.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{rental.customer}</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(rental.startDate).toLocaleDateString("da-DK")}</TableCell>
                      <TableCell>{new Date(rental.endDate).toLocaleDateString("da-DK")}</TableCell>
                      <TableCell>{rental.duration}</TableCell>
                      <TableCell className="text-right font-medium">
                        {rental.revenue.toLocaleString("da-DK")} kr
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">Afsluttet</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="bg-transparent">
          <Card>
            <CardHeader>
              <CardTitle>Vedligeholdelseshistorik</CardTitle>
              <CardDescription>Service og reparationer</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dato</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Tekniker</TableHead>
                    <TableHead className="text-right">Omkostning</TableHead>
                    <TableHead>Noter</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenanceHistory.map((maintenance) => (
                    <TableRow key={maintenance.id}>
                      <TableCell>{new Date(maintenance.date).toLocaleDateString("da-DK")}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{maintenance.type}</Badge>
                      </TableCell>
                      <TableCell>{maintenance.technician}</TableCell>
                      <TableCell className="text-right font-medium">
                        {maintenance.cost.toLocaleString("da-DK")} kr
                      </TableCell>
                      <TableCell className="text-muted-foreground">{maintenance.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability" className="bg-transparent space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tilgængelighedskalender</CardTitle>
              <CardDescription>Oversigt over udlejninger og utilgængelige perioder</CardDescription>
            </CardHeader>
            <CardContent>
              <EquipmentCalendar rentals={rentalHistory} blackouts={blackoutDates} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blackout Datoer</CardTitle>
              <CardDescription>Perioder hvor udstyret ikke er tilgængeligt</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {blackoutDates.map((blackout) => (
                  <div key={blackout.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {new Date(blackout.startDate).toLocaleDateString("da-DK")} -{" "}
                          {new Date(blackout.endDate).toLocaleDateString("da-DK")}
                        </p>
                        <p className="text-sm text-muted-foreground">{blackout.reason}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Fjern
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent">
                  Tilføj Blackout Periode
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
