"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  MessageSquare,
  Users,
  CreditCard,
  Send,
  Edit,
  Star,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

// Mock data
const customer = {
  id: 1,
  name: "Jensen Entreprise A/S",
  contactPerson: "Lars Jensen",
  email: "lars@jensen-entreprise.dk",
  phone: "+45 12 34 56 78",
  address: "Byggevej 42, 2100 København Ø",
  cvr: "12345678",
  region: "Sjælland",
  status: "active",
  creditLimit: 250000,
  creditUsed: 45000,
  rating: 4.8,
  memberSince: "2022-03-15",
  lastActivity: "2025-01-18",
  activeRentals: 3,
  totalRentals: 24,
  totalRevenue: 145200,
  outstandingBalance: 12500,
}

const contacts = [
  {
    id: 1,
    name: "Lars Jensen",
    role: "Direktør",
    email: "lars@jensen-entreprise.dk",
    phone: "+45 12 34 56 78",
    isPrimary: true,
  },
  {
    id: 2,
    name: "Maria Jensen",
    role: "Projektleder",
    email: "maria@jensen-entreprise.dk",
    phone: "+45 23 45 67 89",
    isPrimary: false,
  },
  {
    id: 3,
    name: "Thomas Nielsen",
    role: "Indkøbschef",
    email: "thomas@jensen-entreprise.dk",
    phone: "+45 34 56 78 90",
    isPrimary: false,
  },
]

const rentalHistory = [
  {
    id: "R-2025-0142",
    equipment: "Gravemaskine CAT 320",
    startDate: "2025-01-15",
    endDate: "2025-02-15",
    status: "active",
    amount: 45000,
  },
  {
    id: "R-2025-0098",
    equipment: "Minigraver Bobcat E26",
    startDate: "2025-01-10",
    endDate: "2025-01-31",
    status: "active",
    amount: 18500,
  },
  {
    id: "R-2024-1876",
    equipment: "Hjullæsser Volvo L60H",
    startDate: "2024-12-01",
    endDate: "2025-01-15",
    status: "completed",
    amount: 52000,
  },
  {
    id: "R-2024-1654",
    equipment: "Gravemaskine CAT 320",
    startDate: "2024-11-15",
    endDate: "2024-12-15",
    status: "completed",
    amount: 45000,
  },
  {
    id: "R-2024-1432",
    equipment: "Dumper Thwaites 3T",
    startDate: "2024-10-20",
    endDate: "2024-11-20",
    status: "completed",
    amount: 22000,
  },
]

const invoices = [
  {
    id: "INV-2025-0142",
    date: "2025-01-15",
    dueDate: "2025-02-14",
    amount: 45000,
    status: "unpaid",
    rental: "R-2025-0142",
  },
  {
    id: "INV-2025-0098",
    date: "2025-01-10",
    dueDate: "2025-02-09",
    amount: 18500,
    status: "unpaid",
    rental: "R-2025-0098",
  },
  {
    id: "INV-2024-1876",
    date: "2024-12-01",
    dueDate: "2024-12-31",
    amount: 52000,
    status: "paid",
    paidDate: "2024-12-28",
    rental: "R-2024-1876",
  },
  {
    id: "INV-2024-1654",
    date: "2024-11-15",
    dueDate: "2024-12-15",
    amount: 45000,
    status: "paid",
    paidDate: "2024-12-10",
    rental: "R-2024-1654",
  },
]

const timeline = [
  {
    id: 1,
    type: "rental",
    title: "Ny udlejning startet",
    description: "Gravemaskine CAT 320 (R-2025-0142)",
    date: "2025-01-15T09:30:00",
    user: "System",
  },
  {
    id: 2,
    type: "communication",
    title: "Email sendt",
    description: "Bekræftelse af booking sendt til lars@jensen-entreprise.dk",
    date: "2025-01-14T14:20:00",
    user: "Mette Hansen",
  },
  {
    id: 3,
    type: "rental",
    title: "Ny udlejning startet",
    description: "Minigraver Bobcat E26 (R-2025-0098)",
    date: "2025-01-10T11:00:00",
    user: "System",
  },
  {
    id: 4,
    type: "payment",
    title: "Betaling modtaget",
    description: "52.000 kr for faktura INV-2024-1876",
    date: "2024-12-28T10:15:00",
    user: "System",
  },
  {
    id: 5,
    type: "rental",
    title: "Udlejning afsluttet",
    description: "Hjullæsser Volvo L60H (R-2024-1876)",
    date: "2024-12-15T16:00:00",
    user: "System",
  },
]

const statusConfig = {
  active: { label: "Aktiv", variant: "default" as const },
  completed: { label: "Afsluttet", variant: "secondary" as const },
  unpaid: { label: "Ubetalt", variant: "destructive" as const },
  paid: { label: "Betalt", variant: "default" as const },
}

const timelineIcons = {
  rental: Calendar,
  communication: MessageSquare,
  payment: CreditCard,
  inspection: CheckCircle2,
}

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const creditPercentage = (customer.creditUsed / customer.creditLimit) * 100

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" asChild className="flex-shrink-0">
            <Link href="/customers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0">
              <AvatarImage src="/placeholder-32px.png" />
              <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg md:text-2xl font-bold truncate">{customer.name}</h1>
              <p className="text-xs md:text-sm text-muted-foreground truncate">CVR: {customer.cvr}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:ml-[52px]">
          <Button variant="outline" className="w-full sm:w-auto bg-transparent" asChild>
            <Link href={`/customers/${params.id}/edit`}>
              <Edit className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Rediger</span>
            </Link>
          </Button>
          <Button variant="outline" className="w-full sm:w-auto bg-transparent">
            <Send className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">Send Email</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium break-words">Aktive Udlejninger</CardTitle>
            <Calendar className="h-4 w-4 text-chart-3 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.activeRentals}</div>
            <p className="text-xs text-muted-foreground mt-1 truncate">{customer.totalRentals} i alt</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium break-words">Total Omsætning</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold break-words">{customer.totalRevenue.toLocaleString("da-DK")} kr</div>
            <p className="text-xs text-muted-foreground mt-1 truncate">Livstid</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium break-words">Udestående</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold break-words">
              {customer.outstandingBalance.toLocaleString("da-DK")} kr
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">2 fakturaer</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium break-words">Vurdering</CardTitle>
            <Star className="h-4 w-4 text-chart-2 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.rating}</div>
            <p className="text-xs text-muted-foreground mt-1 truncate">Ud af 5.0</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="rentals" className="w-full">
            <TabsList className="inline-flex w-full overflow-x-auto md:grid md:grid-cols-3">
              <TabsTrigger value="rentals" className="flex-shrink-0">
                Udlejninger
              </TabsTrigger>
              <TabsTrigger value="invoices" className="flex-shrink-0">
                Fakturaer
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex-shrink-0">
                Tidslinje
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rentals" className="space-y-4">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Udlejningshistorik</CardTitle>
                  <CardDescription>Alle udlejninger for denne kunde</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">ID</TableHead>
                        <TableHead className="whitespace-nowrap">Udstyr</TableHead>
                        <TableHead className="whitespace-nowrap">Startdato</TableHead>
                        <TableHead className="whitespace-nowrap">Slutdato</TableHead>
                        <TableHead className="whitespace-nowrap">Status</TableHead>
                        <TableHead className="text-right whitespace-nowrap">Beløb</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rentalHistory.map((rental) => (
                        <TableRow key={rental.id}>
                          <TableCell className="font-mono text-sm whitespace-nowrap">{rental.id}</TableCell>
                          <TableCell className="font-medium whitespace-nowrap">{rental.equipment}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            {new Date(rental.startDate).toLocaleDateString("da-DK")}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {new Date(rental.endDate).toLocaleDateString("da-DK")}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge variant={statusConfig[rental.status].variant}>
                              {statusConfig[rental.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium whitespace-nowrap">
                            {rental.amount.toLocaleString("da-DK")} kr
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices" className="space-y-4">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Fakturaer</CardTitle>
                  <CardDescription>Betalingshistorik og udestående fakturaer</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">Faktura ID</TableHead>
                        <TableHead className="whitespace-nowrap">Dato</TableHead>
                        <TableHead className="whitespace-nowrap">Forfaldsdato</TableHead>
                        <TableHead className="whitespace-nowrap">Status</TableHead>
                        <TableHead className="text-right whitespace-nowrap">Beløb</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-mono text-sm whitespace-nowrap">{invoice.id}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            {new Date(invoice.date).toLocaleDateString("da-DK")}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span>{new Date(invoice.dueDate).toLocaleDateString("da-DK")}</span>
                              {invoice.status === "unpaid" && new Date(invoice.dueDate) < new Date() && (
                                <Badge variant="destructive" className="text-xs whitespace-nowrap">
                                  Forfalden
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge variant={statusConfig[invoice.status].variant}>
                              {statusConfig[invoice.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium whitespace-nowrap">
                            {invoice.amount.toLocaleString("da-DK")} kr
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Aktivitetstidslinje</CardTitle>
                  <CardDescription>Seneste aktiviteter og interaktioner</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timeline.map((event, index) => {
                      const Icon = timelineIcons[event.type] || Clock
                      return (
                        <div key={event.id} className="flex gap-4">
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            {index < timeline.length - 1 && <div className="w-px flex-1 bg-border mt-2 min-h-[40px]" />}
                          </div>
                          <div className="flex-1 pb-4 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="font-medium break-words">{event.title}</p>
                                <p className="text-sm text-muted-foreground mt-1 break-words">{event.description}</p>
                              </div>
                              <time className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                                {new Date(event.date).toLocaleDateString("da-DK", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </time>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 truncate">Af {event.user}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Kundeoplysninger</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Adresse</p>
                  <p className="text-sm text-muted-foreground break-words">{customer.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Region</p>
                  <p className="text-sm text-muted-foreground truncate">{customer.region}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Medlem siden</p>
                  <p className="text-sm text-muted-foreground break-words">
                    {new Date(customer.memberSince).toLocaleDateString("da-DK", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Seneste aktivitet</p>
                  <p className="text-sm text-muted-foreground break-words">
                    {new Date(customer.lastActivity).toLocaleDateString("da-DK", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credit Limit */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Kreditgrænse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Brugt kredit</span>
                  <span className="text-sm font-medium">{creditPercentage.toFixed(0)}%</span>
                </div>
                <Progress value={creditPercentage} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Brugt</span>
                  <span className="font-medium break-words">{customer.creditUsed.toLocaleString("da-DK")} kr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Grænse</span>
                  <span className="font-medium break-words">{customer.creditLimit.toLocaleString("da-DK")} kr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tilgængelig</span>
                  <span className="font-medium text-chart-3 break-words">
                    {(customer.creditLimit - customer.creditUsed).toLocaleString("da-DK")} kr
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contacts */}
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Kontaktpersoner</CardTitle>
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <Users className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src="/placeholder-32px.png" />
                    <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium truncate">{contact.name}</p>
                      {contact.isPrimary && (
                        <Badge variant="secondary" className="text-xs flex-shrink-0">
                          Primær
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{contact.role}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" asChild>
                        <a href={`mailto:${contact.email}`}>
                          <Mail className="h-3 w-3" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" asChild>
                        <a href={`tel:${contact.phone}`}>
                          <Phone className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
