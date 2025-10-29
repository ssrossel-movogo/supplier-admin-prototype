"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"

// Zod validation schema
const lineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Beskrivelse er påkrævet"),
  quantity: z.number().min(1, "Antal skal være mindst 1"),
  unitPrice: z.number().min(0, "Enhedspris skal være positiv"),
  total: z.number(),
})

const invoiceSchema = z.object({
  customer: z.string().min(1, "Kunde er påkrævet"),
  invoiceNumber: z.string().min(1, "Fakturanummer er påkrævet"),
  invoiceDate: z.string().min(1, "Fakturadato er påkrævet"),
  dueDate: z.string().min(1, "Forfaldsdato er påkrævet"),
  poNumber: z.string().optional(),
  lineItems: z.array(lineItemSchema).min(1, "Mindst én fakturalinje er påkrævet"),
  notes: z.string().optional(),
  internalNotes: z.string().optional(),
  paymentTerms: z.string().min(1, "Betalingsbetingelser er påkrævet"),
  paymentMethod: z.string().min(1, "Betalingsmetode er påkrævet"),
  status: z.string().min(1, "Status er påkrævet"),
  rental: z.string().optional(),
})

type InvoiceFormData = z.infer<typeof invoiceSchema>

interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

// Mock existing invoice data
const existingInvoice = {
  customer: "jensen",
  invoiceNumber: "2024-1234",
  invoiceDate: "2024-11-10",
  dueDate: "2024-11-24",
  poNumber: "PO-12345",
  lineItems: [
    {
      id: "1",
      description: "Udlejning - Caterpillar 320 Gravemaskine",
      quantity: 7,
      unitPrice: 850,
      total: 5950,
    },
    {
      id: "2",
      description: "Levering og afhentning",
      quantity: 1,
      unitPrice: 500,
      total: 500,
    },
  ],
  notes: "Betaling bedes overført til kontonummer 1234-5678901234",
  internalNotes: "Kunde har god betalingshistorik",
  paymentTerms: "net14",
  paymentMethod: "bank-transfer",
  status: "sent",
  rental: "r-001",
}

export default function EditInvoicePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [selectedCustomer, setSelectedCustomer] = useState(existingInvoice.customer)
  const [lineItems, setLineItems] = useState<LineItem[]>(existingInvoice.lineItems)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const data: InvoiceFormData = {
      customer: selectedCustomer,
      invoiceNumber: formData.get("invoice-number") as string,
      invoiceDate: formData.get("invoice-date") as string,
      dueDate: formData.get("due-date") as string,
      poNumber: formData.get("po-number") as string,
      lineItems: lineItems,
      notes: formData.get("notes") as string,
      internalNotes: formData.get("internal-notes") as string,
      paymentTerms: formData.get("payment-terms") as string,
      paymentMethod: formData.get("payment-method") as string,
      status: formData.get("status") as string,
      rental: formData.get("rental") as string,
    }

    const result = invoiceSchema.safeParse(data)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((error) => {
        const path = error.path.join(".")
        fieldErrors[path] = error.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    // Handle form submission
    console.log("[v0] Invoice updated:", result.data)
    router.push(`/billing/${params.id}`)
  }

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }
    setLineItems([...lineItems, newItem])
  }

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id))
    }
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === "quantity" || field === "unitPrice") {
            updated.total = updated.quantity * updated.unitPrice
          }
          return updated
        }
        return item
      }),
    )
  }

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
  const vatRate = 0.25
  const vat = subtotal * vatRate
  const total = subtotal + vat

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="flex-shrink-0">
          <Link href={`/billing/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">Rediger Faktura</h1>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">Opdater fakturainformation og gem ændringer</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Kunde</CardTitle>
                <CardDescription>Vælg kunde for denne faktura</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Kunde *</Label>
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer} required>
                    <SelectTrigger id="customer">
                      <SelectValue placeholder="Vælg kunde" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jensen">Jensen Entreprise A/S</SelectItem>
                      <SelectItem value="andersen">Andersen Byg ApS</SelectItem>
                      <SelectItem value="nielsen">Nielsen Construction</SelectItem>
                      <SelectItem value="hansen">Hansen & Sønner</SelectItem>
                      <SelectItem value="petersen">Petersen Anlæg</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.customer && <p className="text-sm text-destructive">{errors.customer}</p>}
                </div>
                {selectedCustomer && (
                  <div className="p-4 bg-muted rounded-lg space-y-1 text-sm">
                    <p className="font-medium">Jensen Entreprise A/S</p>
                    <p className="text-muted-foreground">Byggevej 123, 2100 København Ø</p>
                    <p className="text-muted-foreground">CVR: 12345678</p>
                    <p className="text-muted-foreground">Email: faktura@jensen.dk</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Invoice Details */}
            <Card>
              <CardHeader>
                <CardTitle>Faktura Detaljer</CardTitle>
                <CardDescription>Angiv fakturanummer og datoer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-number">Fakturanummer *</Label>
                    <Input
                      id="invoice-number"
                      name="invoice-number"
                      placeholder="F-2024-001"
                      defaultValue={existingInvoice.invoiceNumber}
                      required
                    />
                    {errors.invoiceNumber && <p className="text-sm text-destructive">{errors.invoiceNumber}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoice-date">Fakturadato *</Label>
                    <Input
                      id="invoice-date"
                      name="invoice-date"
                      type="date"
                      defaultValue={existingInvoice.invoiceDate}
                      required
                    />
                    {errors.invoiceDate && <p className="text-sm text-destructive">{errors.invoiceDate}</p>}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Forfaldsdato *</Label>
                    <Input id="due-date" name="due-date" type="date" defaultValue={existingInvoice.dueDate} required />
                    {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="po-number">PO Nummer</Label>
                    <Input
                      id="po-number"
                      name="po-number"
                      placeholder="Kundens PO nummer"
                      defaultValue={existingInvoice.poNumber}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Faktura Linjer</CardTitle>
                    <CardDescription>Tilføj produkter eller tjenester</CardDescription>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
                    <Plus className="h-4 w-4" />
                    Tilføj Linje
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {errors.lineItems && <p className="text-sm text-destructive">{errors.lineItems}</p>}
                <div className="space-y-4">
                  {lineItems.map((item, index) => (
                    <div key={item.id} className="space-y-4 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Linje {index + 1}</span>
                        {lineItems.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLineItem(item.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`description-${item.id}`}>Beskrivelse *</Label>
                          <Textarea
                            id={`description-${item.id}`}
                            placeholder="Beskrivelse af produkt eller tjeneste"
                            value={item.description}
                            onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                            rows={2}
                            required
                          />
                          {errors[`lineItems.${index}.description`] && (
                            <p className="text-sm text-destructive">{errors[`lineItems.${index}.description`]}</p>
                          )}
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="space-y-2">
                            <Label htmlFor={`quantity-${item.id}`}>Antal *</Label>
                            <Input
                              id={`quantity-${item.id}`}
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateLineItem(item.id, "quantity", Number.parseFloat(e.target.value))}
                              required
                            />
                            {errors[`lineItems.${index}.quantity`] && (
                              <p className="text-sm text-destructive">{errors[`lineItems.${index}.quantity`]}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`unit-price-${item.id}`}>Enhedspris (kr) *</Label>
                            <Input
                              id={`unit-price-${item.id}`}
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => updateLineItem(item.id, "unitPrice", Number.parseFloat(e.target.value))}
                              required
                            />
                            {errors[`lineItems.${index}.unitPrice`] && (
                              <p className="text-sm text-destructive">{errors[`lineItems.${index}.unitPrice`]}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label>Total (kr)</Label>
                            <Input value={item.total.toLocaleString("da-DK")} disabled className="bg-muted" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Yderligere Oplysninger</CardTitle>
                <CardDescription>Tilføj noter eller betalingsinstruktioner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Noter til kunde</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Synlige noter på fakturaen..."
                    rows={3}
                    defaultValue={existingInvoice.notes}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="internal-notes">Interne Noter</Label>
                  <Textarea
                    id="internal-notes"
                    name="internal-notes"
                    placeholder="Interne noter (ikke synlige for kunde)..."
                    rows={2}
                    defaultValue={existingInvoice.internalNotes}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Total Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Faktura Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">{subtotal.toLocaleString("da-DK")} kr</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Moms (25%):</span>
                    <span className="font-medium">{vat.toLocaleString("da-DK")} kr</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-primary">{total.toLocaleString("da-DK")} kr</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Betalingsbetingelser</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-terms">Betalingsbetingelser *</Label>
                  <Select name="payment-terms" defaultValue={existingInvoice.paymentTerms} required>
                    <SelectTrigger id="payment-terms">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="net14">Netto 14 dage</SelectItem>
                      <SelectItem value="net30">Netto 30 dage</SelectItem>
                      <SelectItem value="net60">Netto 60 dage</SelectItem>
                      <SelectItem value="due-on-receipt">Betales ved modtagelse</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.paymentTerms && <p className="text-sm text-destructive">{errors.paymentTerms}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Betalingsmetode *</Label>
                  <Select name="payment-method" defaultValue={existingInvoice.paymentMethod} required>
                    <SelectTrigger id="payment-method">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank-transfer">Bankoverførsel</SelectItem>
                      <SelectItem value="card">Betalingskort</SelectItem>
                      <SelectItem value="mobilepay">MobilePay</SelectItem>
                      <SelectItem value="invoice">Faktura</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.paymentMethod && <p className="text-sm text-destructive">{errors.paymentMethod}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Faktura Status *</Label>
                  <Select name="status" defaultValue={existingInvoice.status} required>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Kladde</SelectItem>
                      <SelectItem value="sent">Sendt</SelectItem>
                      <SelectItem value="approved">Godkendt</SelectItem>
                      <SelectItem value="paid">Betalt</SelectItem>
                      <SelectItem value="overdue">Forfalden</SelectItem>
                      <SelectItem value="cancelled">Annulleret</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Related Rental */}
            <Card>
              <CardHeader>
                <CardTitle>Relateret Udlejning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rental">Udlejning (valgfri)</Label>
                  <Select name="rental" defaultValue={existingInvoice.rental}>
                    <SelectTrigger id="rental">
                      <SelectValue placeholder="Vælg udlejning" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="r-001">R-001 - Caterpillar 320</SelectItem>
                      <SelectItem value="r-002">R-002 - Volvo EC220</SelectItem>
                      <SelectItem value="r-003">R-003 - Bobcat S650</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
          <Button type="button" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
            <Link href={`/billing/${params.id}`}>Annuller</Link>
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            <Save className="h-4 w-4" />
            Gem Ændringer
          </Button>
        </div>
      </form>
    </div>
  )
}
