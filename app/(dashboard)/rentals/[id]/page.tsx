"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, FileText, MessageSquare, Calendar, DollarSign, Package } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"

// Mock data
const rental = {
  id: "RNT-001",
  equipment: "Caterpillar 320 Gravemaskine",
  customer: "Jensen Entreprise A/S",
  contactPerson: "Lars Jensen",
  email: "lars@jensen-entreprise.dk",
  phone: "+45 12 34 56 78",
  startDate: "2024-11-15",
  endDate: "2024-11-22",
  status: "active",
  dailyRate: 850,
  totalCost: 5950,
  deposit: 2000,
  deliveryAddress: "Byggevej 12, 2300 København S",
  deliveryDate: "2024-11-15 08:00",
  returnDate: "2024-11-22 16:00",
  deliveryInspection: {
    date: "2024-11-15 08:30",
    inspector: "John Doe",
    status: "completed",
    issues: 0,
  },
  returnInspection: {
    date: null,
    inspector: null,
    status: "pending",
    issues: null,
  },
}

const timeline = [
  { date: "2024-11-10", event: "Booking anmodet", user: "Lars Jensen", type: "booking" },
  { date: "2024-11-11", event: "Booking godkendt", user: "John Doe", type: "approval" },
  { date: "2024-11-14", event: "Kontrakt underskrevet", user: "Lars Jensen", type: "contract" },
  { date: "2024-11-15", event: "Levering gennemført", user: "John Doe", type: "delivery" },
  { date: "2024-11-15", event: "Leveringsinspektion OK", user: "John Doe", type: "inspection" },
]

const communications = [
  {
    id: 1,
    date: "2024-11-14",
    from: "Lars Jensen",
    message: "Kan vi få leveret kl. 08:00 i stedet for 09:00?",
    type: "customer",
  },
  {
    id: 2,
    date: "2024-11-14",
    from: "John Doe",
    message: "Ja, det kan vi godt. Bekræftet til kl. 08:00.",
    type: "supplier",
  },
  { id: 3, date: "2024-11-15", from: "John Doe", message: "Udstyr leveret og inspiceret. Alt OK.", type: "supplier" },
]

const statusConfig = {
  active: { label: "Aktiv", variant: "default" as const },
  pending: { label: "Afventer", variant: "secondary" as const },
  completed: { label: "Afsluttet", variant: "outline" as const },
  cancelled: { label: "Annulleret", variant: "destructive" as const },
}

export default function RentalDetailPage() {
  const router = useRouter()

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight">{rental.id}</h1>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={statusConfig[rental.status].variant}>{statusConfig[rental.status].label}</Badge>
            <span className="text-sm text-muted-foreground truncate">
              {rental.equipment} • {rental.customer}
            </span>
          </div>
          <Button className="sm:ml-auto w-full sm:w-auto">
            <Edit className="h-4 w-4 mr-2" />
            Rediger
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Periode</CardTitle>
            <Calendar className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">7 dage</div>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(rental.startDate).toLocaleDateString("da-DK")} -{" "}
              {new Date(rental.endDate).toLocaleDateString("da-DK")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pris</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{rental.totalCost.toLocaleString("da-DK")} kr</div>
            <p className="text-xs text-muted-foreground mt-1">{rental.dailyRate} kr/dag</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Depositum</CardTitle>
            <DollarSign className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{rental.deposit.toLocaleString("da-DK")} kr</div>
            <p className="text-xs text-muted-foreground mt-1">Betalt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Udstyr</CardTitle>
            <Package className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{rental.equipment}</div>
            <p className="text-xs text-muted-foreground mt-1">Tilgængelig</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="inline-flex w-full overflow-x-auto">
          <TabsTrigger value="details" className="flex-shrink-0">
            <FileText className="h-4 w-4" />
            Detaljer
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex-shrink-0">
            <Calendar className="h-4 w-4" />
            Tidslinje
          </TabsTrigger>
          <TabsTrigger value="communications" className="flex-shrink-0">
            <MessageSquare className="h-4 w-4" />
            Kommunikation
          </TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Kundeinformation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder-32px.png?height=48&width=48" />
                    <AvatarFallback>{rental.customer.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{rental.customer}</p>
                    <p className="text-sm text-muted-foreground">{rental.contactPerson}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{rental.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <p className="font-medium">{rental.phone}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leveringsdetaljer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Leveringsadresse</p>
                  <p className="font-medium">{rental.deliveryAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Leveringsdato</p>
                  <p className="font-medium">{rental.deliveryDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Forventet Retur</p>
                  <p className="font-medium">{rental.returnDate}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Leveringsinspektion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="default">Gennemført</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dato</p>
                  <p className="font-medium">{rental.deliveryInspection.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inspektør</p>
                  <p className="font-medium">{rental.deliveryInspection.inspector}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Problemer</p>
                  <p className="font-medium">{rental.deliveryInspection.issues} fundet</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Returinspektion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="secondary">Afventer</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Planlagt Dato</p>
                  <p className="font-medium">{rental.returnDate}</p>
                </div>
                <Button className="w-full mt-4">Planlæg Inspektion</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Udlejningstidslinje</CardTitle>
              <CardDescription>Historik over alle hændelser</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      {index < timeline.length - 1 && <div className="w-px h-full bg-border mt-2" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{item.event}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.date).toLocaleDateString("da-DK")}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Af {item.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communications Tab */}
        <TabsContent value="communications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kommunikationshistorik</CardTitle>
              <CardDescription>Beskeder mellem dig og kunden</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {communications.map((comm) => (
                <div key={comm.id} className={`flex gap-3 ${comm.type === "supplier" ? "flex-row-reverse" : ""}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{comm.from.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className={`flex-1 ${comm.type === "supplier" ? "text-right" : ""}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">{comm.from}</p>
                      <p className="text-xs text-muted-foreground">{new Date(comm.date).toLocaleDateString("da-DK")}</p>
                    </div>
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        comm.type === "supplier" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{comm.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Send Besked</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea placeholder="Skriv din besked her..." rows={4} />
              <Button className="w-full">Send Besked</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
