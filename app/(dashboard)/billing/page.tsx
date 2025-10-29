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
import { Receipt, Search, MoreVertical, Eye, Send, Download, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { ExportDialog } from "@/components/export-dialog"
import { BulkActions } from "@/components/bulk-actions"

// Mock data
const mockUnpaidInvoices = [
  {
    id: "INV-2024-1234",
    customer: "Jensen Entreprise",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    equipment: "Caterpillar 320",
    issueDate: "2024-11-10",
    dueDate: "2024-11-24",
    amount: "6.000 kr",
    status: "unpaid",
    daysOverdue: 0,
  },
  {
    id: "INV-2024-1235",
    customer: "Andersen Byg",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    equipment: "Volvo EC220",
    issueDate: "2024-11-05",
    dueDate: "2024-11-19",
    amount: "4.500 kr",
    status: "overdue",
    daysOverdue: 5,
  },
  {
    id: "INV-2024-1236",
    customer: "Nielsen A/S",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    equipment: "Komatsu PC210",
    issueDate: "2024-11-12",
    dueDate: "2024-11-26",
    amount: "1.950 kr",
    status: "unpaid",
    daysOverdue: 0,
  },
]

const mockPaidInvoices = [
  {
    id: "INV-2024-1230",
    customer: "Mortensen Byg",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    equipment: "JCB 3CX",
    issueDate: "2024-10-20",
    paidDate: "2024-11-02",
    amount: "6.650 kr",
    status: "paid",
  },
  {
    id: "INV-2024-1231",
    customer: "Petersen A/S",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    equipment: "Bobcat S650",
    issueDate: "2024-10-25",
    paidDate: "2024-11-05",
    amount: "5.950 kr",
    status: "paid",
  },
]

const statusConfig = {
  unpaid: { label: "Ubetalt", variant: "secondary" as const },
  overdue: { label: "Forfalden", variant: "destructive" as const },
  paid: { label: "Betalt", variant: "outline" as const },
  cancelled: { label: "Annulleret", variant: "outline" as const },
}

export default function BillingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const totalUnpaid = mockUnpaidInvoices.reduce((acc, inv) => {
    const amount = Number.parseFloat(inv.amount.replace(/[^\d]/g, ""))
    return acc + amount
  }, 0)

  const totalOverdue = mockUnpaidInvoices
    .filter((inv) => inv.status === "overdue")
    .reduce((acc, inv) => {
      const amount = Number.parseFloat(inv.amount.replace(/[^\d]/g, ""))
      return acc + amount
    }, 0)

  const toggleSelectAll = (items: typeof mockUnpaidInvoices) => {
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
          <h1 className="text-3xl font-bold tracking-tight">Fakturering</h1>
          <p className="text-muted-foreground mt-1">Administrer fakturaer og betalinger</p>
        </div>
        <div className="flex gap-2">
          <ExportDialog
            title="Eksporter Fakturaer"
            description="Vælg format og kolonner til eksport"
            columns={["Faktura Nr.", "Kunde", "Udstyr", "Udstedelsesdato", "Forfaldsdato", "Beløb", "Status"]}
          />
          <Button>
            <Receipt className="h-4 w-4" />
            Opret Faktura
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ubetalte Fakturaer</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUnpaidInvoices.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{totalUnpaid.toLocaleString("da-DK")} kr</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forfaldne</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUnpaidInvoices.filter((i) => i.status === "overdue").length}</div>
            <p className="text-xs text-destructive font-medium mt-1">{totalOverdue.toLocaleString("da-DK")} kr</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Betalte Denne Måned</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPaidInvoices.length}</div>
            <p className="text-xs text-muted-foreground mt-1">12.600 kr</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Omsætning</CardTitle>
            <Receipt className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145.200 kr</div>
            <p className="text-xs text-muted-foreground mt-1">Denne måned</p>
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
                  placeholder="Søg efter fakturaer, kunder eller udstyr..."
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
                  <SelectItem value="unpaid">Ubetalt</SelectItem>
                  <SelectItem value="overdue">Forfalden</SelectItem>
                  <SelectItem value="paid">Betalt</SelectItem>
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
      <Tabs defaultValue="unpaid" className="space-y-4">
        <TabsList className="inline-flex w-full overflow-x-auto">
          <TabsTrigger value="unpaid" className="flex-shrink-0">
            Ubetalte ({mockUnpaidInvoices.length})
          </TabsTrigger>
          <TabsTrigger value="paid" className="flex-shrink-0">
            Betalte ({mockPaidInvoices.length})
          </TabsTrigger>
        </TabsList>

        {/* Unpaid Invoices */}
        <TabsContent value="unpaid" className="space-y-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedItems.length === mockUnpaidInvoices.length}
                      onCheckedChange={() => toggleSelectAll(mockUnpaidInvoices)}
                      aria-label="Vælg alle"
                    />
                  </TableHead>
                  <TableHead>Faktura Nr.</TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Udstyr</TableHead>
                  <TableHead>Udstedelsesdato</TableHead>
                  <TableHead>Forfaldsdato</TableHead>
                  <TableHead>Beløb</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUnpaidInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(invoice.id)}
                        onCheckedChange={() => toggleSelectItem(invoice.id)}
                        aria-label={`Vælg ${invoice.id}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={invoice.customerAvatar || "/placeholder.svg"} alt={invoice.customer} />
                          <AvatarFallback>{invoice.customer.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span>{invoice.customer}</span>
                      </div>
                    </TableCell>
                    <TableCell>{invoice.equipment}</TableCell>
                    <TableCell>{invoice.issueDate}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{invoice.dueDate}</span>
                        {invoice.daysOverdue > 0 && (
                          <span className="text-xs text-destructive">{invoice.daysOverdue} dage forsinket</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{invoice.amount}</TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[invoice.status as keyof typeof statusConfig].variant}>
                        {statusConfig[invoice.status as keyof typeof statusConfig].label}
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
                            <Link href={`/billing/${invoice.id}`}>
                              <Eye className="h-4 w-4" />
                              Se Faktura
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="h-4 w-4" />
                            Send Påmindelse
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle2 className="h-4 w-4" />
                            Marker som Betalt
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

        {/* Paid Invoices */}
        <TabsContent value="paid" className="space-y-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faktura Nr.</TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Udstyr</TableHead>
                  <TableHead>Udstedelsesdato</TableHead>
                  <TableHead>Betalt Dato</TableHead>
                  <TableHead>Beløb</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPaidInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={invoice.customerAvatar || "/placeholder.svg"} alt={invoice.customer} />
                          <AvatarFallback>{invoice.customer.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span>{invoice.customer}</span>
                      </div>
                    </TableCell>
                    <TableCell>{invoice.equipment}</TableCell>
                    <TableCell>{invoice.issueDate}</TableCell>
                    <TableCell>{invoice.paidDate}</TableCell>
                    <TableCell className="font-medium">{invoice.amount}</TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[invoice.status as keyof typeof statusConfig].variant}>
                        {statusConfig[invoice.status as keyof typeof statusConfig].label}
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
                            <Link href={`/billing/${invoice.id}`}>
                              <Eye className="h-4 w-4" />
                              Se Faktura
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4" />
                            Download PDF
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
