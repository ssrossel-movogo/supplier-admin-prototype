"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Edit,
  FileText,
  Send,
  Download,
  CheckCircle2,
  Clock,
  CreditCard,
  Receipt,
  Calendar,
  AlertCircle,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

// Mock data
const invoice = {
  id: "INV-2024-1234",
  number: "2024-1234",
  status: "unpaid",
  issueDate: "2024-11-10",
  dueDate: "2024-11-24",
  paidDate: null,
  customer: {
    name: "Jensen Entreprise A/S",
    cvr: "12345678",
    address: "Byggevej 12, 2300 København S",
    email: "faktura@jensen-entreprise.dk",
    phone: "+45 12 34 56 78",
    contactPerson: "Lars Jensen",
  },
  rental: {
    id: "RNT-001",
    equipment: "Caterpillar 320 Gravemaskine",
    startDate: "2024-11-01",
    endDate: "2024-11-08",
  },
  lineItems: [
    {
      id: 1,
      description: "Udlejning - Caterpillar 320 Gravemaskine",
      quantity: 7,
      unit: "dage",
      unitPrice: 850,
      amount: 5950,
    },
    {
      id: 2,
      description: "Levering og afhentning",
      quantity: 1,
      unit: "stk",
      unitPrice: 500,
      amount: 500,
    },
    {
      id: 3,
      description: "Brændstof",
      quantity: 1,
      unit: "stk",
      unitPrice: 450,
      amount: 450,
    },
  ],
  subtotal: 6900,
  vat: 1725,
  total: 8625,
  paymentTerms: "14 dage netto",
  paymentMethod: "Bankoverførsel",
  notes: "Betaling bedes overført til kontonummer 1234-5678901234",
}

const paymentHistory = [
  {
    id: 1,
    date: "2024-11-12",
    amount: 2000,
    method: "Bankoverførsel",
    reference: "Depositum",
    status: "completed",
  },
]

const activityLog = [
  { date: "2024-11-10", event: "Faktura oprettet", user: "System", type: "created" },
  { date: "2024-11-10", event: "Faktura sendt til kunde", user: "John Doe", type: "sent" },
  { date: "2024-11-12", event: "Depositum modtaget", user: "System", type: "payment" },
  { date: "2024-11-18", event: "Påmindelse sendt", user: "System", type: "reminder" },
]

const statusConfig = {
  unpaid: { label: "Ubetalt", variant: "secondary" as const, icon: Clock },
  overdue: { label: "Forfalden", variant: "destructive" as const, icon: AlertCircle },
  paid: { label: "Betalt", variant: "default" as const, icon: CheckCircle2 },
  cancelled: { label: "Annulleret", variant: "outline" as const, icon: AlertCircle },
}

export default function BillingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const StatusIcon = statusConfig[invoice.status as keyof typeof statusConfig].icon

  const daysUntilDue = Math.ceil((new Date(invoice.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="flex-shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight truncate">Faktura {invoice.number}</h1>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={statusConfig[invoice.status as keyof typeof statusConfig].variant}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[invoice.status as keyof typeof statusConfig].label}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Forfald: {new Date(invoice.dueDate).toLocaleDateString("da-DK")}
            </span>
            {daysUntilDue > 0 && invoice.status === "unpaid" && (
              <span className="text-sm text-muted-foreground">({daysUntilDue} dage tilbage)</span>
            )}
            {daysUntilDue < 0 && invoice.status === "unpaid" && (
              <span className="text-sm text-destructive font-medium">({Math.abs(daysUntilDue)} dage forsinket)</span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent" asChild>
              <Link href={`/billing/${params.id}/edit`}>
                <Edit className="h-4 w-4" />
                Rediger
              </Link>
            </Button>
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              <Send className="h-4 w-4" />
              Send Faktura
            </Button>
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            {invoice.status === "unpaid" && (
              <Button className="w-full sm:w-auto sm:ml-auto">
                <CheckCircle2 className="h-4 w-4" />
                Marker som Betalt
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Beløb</CardTitle>
            <Receipt className="h-4 w-4 text-primary flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold break-words">{invoice.total.toLocaleString("da-DK")} kr</div>
            <p className="text-xs text-muted-foreground mt-1">Inkl. moms</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Betalt</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-chart-3 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold break-words">
              {paymentHistory.reduce((sum, p) => sum + p.amount, 0).toLocaleString("da-DK")} kr
            </div>
            <p className="text-xs text-muted-foreground mt-1">{paymentHistory.length} betaling(er)</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resterende</CardTitle>
            <CreditCard className="h-4 w-4 text-accent flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold break-words">
              {(invoice.total - paymentHistory.reduce((sum, p) => sum + p.amount, 0)).toLocaleString("da-DK")} kr
            </div>
            <p className="text-xs text-muted-foreground mt-1">Udestående</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forfaldsdato</CardTitle>
            <Calendar className="h-4 w-4 text-chart-2 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold break-words">{new Date(invoice.dueDate).toLocaleDateString("da-DK")}</div>
            <p className="text-xs text-muted-foreground mt-1">{invoice.paymentTerms}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoice" className="space-y-6">
        <TabsList className="inline-flex w-full overflow-x-auto">
          <TabsTrigger value="invoice" className="flex-shrink-0">
            <FileText className="h-4 w-4" />
            Faktura
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex-shrink-0">
            <CreditCard className="h-4 w-4" />
            Betalinger
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex-shrink-0">
            <Clock className="h-4 w-4" />
            Aktivitet
          </TabsTrigger>
        </TabsList>

        {/* Invoice Tab */}
        <TabsContent value="invoice" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Line Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Fakturadetaljer</CardTitle>
                  <CardDescription>Linjer og beløb</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">Beskrivelse</TableHead>
                        <TableHead className="whitespace-nowrap text-right">Antal</TableHead>
                        <TableHead className="whitespace-nowrap text-right">Enhedspris</TableHead>
                        <TableHead className="whitespace-nowrap text-right">Beløb</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.lineItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="whitespace-nowrap">
                            <div>
                              <p className="font-medium">{item.description}</p>
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-right">
                            {item.quantity} {item.unit}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-right">
                            {item.unitPrice.toLocaleString("da-DK")} kr
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-right font-medium">
                            {item.amount.toLocaleString("da-DK")} kr
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{invoice.subtotal.toLocaleString("da-DK")} kr</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Moms (25%)</span>
                      <span className="font-medium">{invoice.vat.toLocaleString("da-DK")} kr</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{invoice.total.toLocaleString("da-DK")} kr</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Rental */}
              <Card>
                <CardHeader>
                  <CardTitle>Relateret Udlejning</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="font-medium truncate">{invoice.rental.equipment}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.rental.startDate).toLocaleDateString("da-DK")} -{" "}
                        {new Date(invoice.rental.endDate).toLocaleDateString("da-DK")}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild className="flex-shrink-0 ml-2 bg-transparent">
                      <Link href={`/rentals/${invoice.rental.id}`}>Se Udlejning</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Kundeinformation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage src="/placeholder.svg?height=48&width=48" />
                      <AvatarFallback>{invoice.customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{invoice.customer.name}</p>
                      <p className="text-sm text-muted-foreground">CVR: {invoice.customer.cvr}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Kontaktperson</p>
                      <p className="font-medium break-words">{invoice.customer.contactPerson}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium break-words">{invoice.customer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Telefon</p>
                      <p className="font-medium break-words">{invoice.customer.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Adresse</p>
                      <p className="font-medium break-words">{invoice.customer.address}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href={`/customers/${invoice.customer.name}`}>Se Kunde</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Invoice Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Fakturadetaljer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Fakturanummer</p>
                    <p className="font-medium break-words">{invoice.number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Udstedelsesdato</p>
                    <p className="font-medium">{new Date(invoice.issueDate).toLocaleDateString("da-DK")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Forfaldsdato</p>
                    <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString("da-DK")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Betalingsbetingelser</p>
                    <p className="font-medium break-words">{invoice.paymentTerms}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Betalingsmetode</p>
                    <p className="font-medium break-words">{invoice.paymentMethod}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {invoice.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Noter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm break-words">{invoice.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Betalingshistorik</CardTitle>
              <CardDescription>Alle betalinger for denne faktura</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {paymentHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Dato</TableHead>
                      <TableHead className="whitespace-nowrap">Beløb</TableHead>
                      <TableHead className="whitespace-nowrap">Metode</TableHead>
                      <TableHead className="whitespace-nowrap">Reference</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="whitespace-nowrap">
                          {new Date(payment.date).toLocaleDateString("da-DK")}
                        </TableCell>
                        <TableCell className="whitespace-nowrap font-medium">
                          {payment.amount.toLocaleString("da-DK")} kr
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{payment.method}</TableCell>
                        <TableCell className="whitespace-nowrap">{payment.reference}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="default">Gennemført</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">Ingen betalinger endnu</div>
              )}

              {invoice.status !== "paid" && (
                <>
                  <Separator className="my-6" />
                  <div className="space-y-4">
                    <h3 className="font-semibold">Registrer Betaling</h3>
                    <Button className="w-full">
                      <CreditCard className="h-4 w-4" />
                      Tilføj Betaling
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Aktivitetslog</CardTitle>
              <CardDescription>Historik over alle hændelser</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLog.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      {index < activityLog.length - 1 && <div className="w-px h-full bg-border mt-2" />}
                    </div>
                    <div className="flex-1 pb-4 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <p className="font-medium break-words">{item.event}</p>
                        <p className="text-sm text-muted-foreground whitespace-nowrap">
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
      </Tabs>
    </div>
  )
}
