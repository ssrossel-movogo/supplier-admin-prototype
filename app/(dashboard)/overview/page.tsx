import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Package, AlertTriangle, Receipt, TrendingUp, Clock, CheckCircle2, XCircle } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import Link from "next/link"

// Mock data - would come from loader in real app
const kpis = [
  {
    title: "Aktive Udlejninger",
    value: "24",
    change: "+3 fra i går",
    icon: Calendar,
    color: "text-chart-3",
  },
  {
    title: "Inspektioner I Dag",
    value: "8",
    change: "2 forfaldne",
    icon: Clock,
    color: "text-chart-4",
    alert: true,
  },
  {
    title: "Afventende Bookinger",
    value: "5",
    change: "Kræver handling",
    icon: Package,
    color: "text-accent",
    alert: true,
  },
  {
    title: "Ubetalte Fakturaer",
    value: "12.450 kr",
    change: "3 fakturaer",
    icon: Receipt,
    color: "text-chart-2",
  },
  {
    title: "Åbne Tvister",
    value: "2",
    change: "1 ny i dag",
    icon: AlertTriangle,
    color: "text-destructive",
    alert: true,
  },
  {
    title: "Månedlig Omsætning",
    value: "145.200 kr",
    change: "+12% fra sidste måned",
    icon: TrendingUp,
    color: "text-primary",
  },
]

const dueToday = [
  {
    id: 1,
    type: "Inspektion",
    equipment: "Bobcat S650",
    customer: "Jensen Entreprise",
    time: "09:00",
    status: "pending",
  },
  { id: 2, type: "Inspektion", equipment: "Volvo EC220", customer: "Andersen Byg", time: "11:30", status: "pending" },
  { id: 3, type: "Inspektion", equipment: "JCB 3CX", customer: "Nielsen A/S", time: "14:00", status: "completed" },
]

const awaitingConfirmation = [
  { id: 1, equipment: "Caterpillar 320", customer: "Hansen Entreprise", dates: "15-20 Nov", price: "8.500 kr" },
  { id: 2, equipment: "Komatsu PC210", customer: "Petersen Byg", dates: "18-25 Nov", price: "9.200 kr" },
  { id: 3, equipment: "Hitachi ZX130", customer: "Larsen A/S", dates: "20-27 Nov", price: "7.800 kr" },
]

const revenueTrend = [
  { date: "Man", revenue: 18500, bookings: 4 },
  { date: "Tir", revenue: 22000, bookings: 5 },
  { date: "Ons", revenue: 19800, bookings: 3 },
  { date: "Tor", revenue: 25400, bookings: 6 },
  { date: "Fre", revenue: 28200, bookings: 7 },
  { date: "Lør", revenue: 15600, bookings: 2 },
  { date: "Søn", revenue: 15700, bookings: 3 },
]

const equipmentUtilization = [
  { category: "Gravemaskiner", utilization: 85, available: 12, rented: 10 },
  { category: "Hjullæssere", utilization: 72, available: 8, rented: 6 },
  { category: "Kompaktlæssere", utilization: 90, available: 10, rented: 9 },
  { category: "Gaffeltrucks", utilization: 65, available: 6, rented: 4 },
  { category: "Minigraver", utilization: 78, available: 15, rented: 12 },
]

const revenueChartConfig = {
  revenue: {
    label: "Omsætning",
    color: "hsl(var(--chart-1))",
  },
  bookings: {
    label: "Bookinger",
    color: "hsl(var(--chart-2))",
  },
}

const utilizationChartConfig = {
  utilization: {
    label: "Udnyttelse %",
    color: "hsl(var(--chart-3))",
  },
}

export default function OverviewPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Oversigt</h1>
        <p className="text-muted-foreground mt-1">Velkommen tilbage! Her er status på dine udlejninger.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <Link
            key={kpi.title}
            href={
              kpi.title === "Aktive Udlejninger"
                ? "/rentals"
                : kpi.title === "Inspektioner I Dag"
                  ? "/inspections"
                  : kpi.title === "Afventende Bookinger"
                    ? "/rentals"
                    : kpi.title === "Ubetalte Fakturaer"
                      ? "/billing"
                      : kpi.title === "Åbne Tvister"
                        ? "/disputes"
                        : "/overview"
            }
            className="block transition-transform hover:scale-[1.02]"
          >
            <Card className="relative overflow-hidden h-full cursor-pointer">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 gap-2">
                <CardTitle className="text-sm font-medium line-clamp-2 flex-1 min-w-0">{kpi.title}</CardTitle>
                <kpi.icon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${kpi.color}`} />
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold truncate">{kpi.value}</div>
                <p
                  className={`text-xs line-clamp-1 ${kpi.alert ? "text-destructive font-medium" : "text-muted-foreground"}`}
                >
                  {kpi.change}
                </p>
              </CardContent>
              {kpi.alert && (
                <div className="absolute top-2 right-2">
                  <Badge variant="destructive" className="h-2 w-2 p-0 rounded-full" />
                </div>
              )}
            </Card>
          </Link>
        ))}
      </div>

      {/*<div className="grid gap-6 md:grid-cols-2">
      
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Omsætning Denne Uge</CardTitle>
            <CardDescription>Daglig omsætning og antal bookinger</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <ChartContainer config={revenueChartConfig} className="h-[250px] sm:h-[300px] w-full">
              <AreaChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Udstyr Udnyttelse</CardTitle>
            <CardDescription>Udnyttelsesgrad pr. kategori</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <ChartContainer config={utilizationChartConfig} className="h-[250px] sm:h-[300px] w-full">
              <BarChart data={equipmentUtilization} margin={{ bottom: 60, left: 0, right: 0, top: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 10 }}
                  interval={0}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="utilization" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>*/}

      {/* Work Queues */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Due Today */}
        <Card>
          <CardHeader>
            <CardTitle>Forfalder I Dag</CardTitle>
            <CardDescription>Inspektioner der skal udføres i dag</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dueToday.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Link href={`/equipment/${item.id}`} className="text-sm font-medium hover:underline">
                      {item.equipment}
                    </Link>
                    {item.status === "completed" && <CheckCircle2 className="h-4 w-4 text-chart-3" />}
                  </div>
                  <Link href={`/customers/${item.id}`} className="text-xs text-muted-foreground hover:underline">
                    {item.customer}
                  </Link>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{item.time}</p>
                  <Badge variant={item.status === "completed" ? "secondary" : "default"} className="mt-1">
                    {item.status === "completed" ? "Færdig" : "Afventer"}
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/inspections">Se Alle Inspektioner</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Awaiting Confirmation */}
        <Card>
          <CardHeader>
            <CardTitle>Afventende Godkendelse</CardTitle>
            <CardDescription>Bookinger der kræver din handling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {awaitingConfirmation.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <Link href={`/equipment/${item.id}`} className="text-sm font-medium hover:underline">
                    {item.equipment}
                  </Link>
                  <Link href={`/customers/${item.id}`} className="text-xs text-muted-foreground hover:underline">
                    {item.customer}
                  </Link>
                  <p className="text-xs text-muted-foreground">{item.dates}</p>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-sm font-medium">{item.price}</p>
                  <div className="flex gap-1">
                    <Button size="sm" variant="default" className="h-7 px-2">
                      <CheckCircle2 className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 px-2 bg-transparent">
                      <XCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/rentals">Se Alle Bookinger</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Seneste Aktivitet</CardTitle>
          <CardDescription>De seneste 10 hændelser i systemet</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            {[
              {
                action: "Booking godkendt",
                entity: "Caterpillar 320",
                time: "2 timer siden",
                user: "John Doe",
                type: "equipment",
                id: 1,
              },
              {
                action: "Inspektion afsluttet",
                entity: "JCB 3CX",
                time: "3 timer siden",
                user: "Jane Smith",
                type: "inspection",
                id: 2,
              },
              {
                action: "Faktura sendt",
                entity: "INV-2024-1234",
                time: "5 timer siden",
                user: "System",
                type: "invoice",
                id: 3,
              },
              {
                action: "Tvist oprettet",
                entity: "Volvo EC220",
                time: "6 timer siden",
                user: "John Doe",
                type: "dispute",
                id: 4,
              },
              {
                action: "Udstyr publiceret",
                entity: "Komatsu PC210",
                time: "1 dag siden",
                user: "Jane Smith",
                type: "equipment",
                id: 5,
              },
            ].map((activity, i, arr) => (
              <div key={i}>
                <div className="flex items-center gap-4 text-sm py-3">
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <Link
                      href={
                        activity.type === "equipment"
                          ? `/equipment/${activity.id}`
                          : activity.type === "inspection"
                            ? `/inspections/${activity.id}`
                            : activity.type === "dispute"
                              ? `/disputes/${activity.id}`
                              : activity.type === "invoice"
                                ? `/billing`
                                : "#"
                      }
                      className="text-muted-foreground text-xs hover:underline"
                    >
                      {activity.entity}
                    </Link>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs">{activity.time}</p>
                    <p className="text-muted-foreground text-xs">{activity.user}</p>
                  </div>
                </div>
                {i < arr.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
