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
import { format } from "date-fns"

interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export default function NewInvoicePage() {
  const router = useRouter()
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    router.push("/billing")
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
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="flex-shrink-0">
          <Link href="/billing">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">Opret Ny Faktura</h1>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            Udfyld oplysningerne nedenfor for at oprette en ny faktura
          </p>
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
                      placeholder="F-2024-001"
                      defaultValue={`F-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoice-date">Fakturadato *</Label>
                    <Input id="invoice-date" type="date" defaultValue={format(new Date(), "yyyy-MM-dd")} required />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Forfaldsdato *</Label>
                    <Input
                      id="due-date"
                      type="date"
                      defaultValue={format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="po-number">PO Nummer</Label>
                    <Input id="po-number" placeholder="Kundens PO nummer" />
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
                  <Textarea id="notes" placeholder="Synlige noter på fakturaen..." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="internal-notes">Interne Noter</Label>
                  <Textarea id="internal-notes" placeholder="Interne noter (ikke synlige for kunde)..." rows={2} />
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
                  <Label htmlFor="payment-terms">Betalingsbetingelser</Label>
                  <Select defaultValue="net30">
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Betalingsmetode</Label>
                  <Select defaultValue="bank-transfer">
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
                  <Label htmlFor="status">Faktura Status</Label>
                  <Select defaultValue="draft">
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Kladde</SelectItem>
                      <SelectItem value="sent">Sendt</SelectItem>
                      <SelectItem value="approved">Godkendt</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Select>
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
            <Link href="/billing">Annuller</Link>
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            <Save className="h-4 w-4" />
            Opret Faktura
          </Button>
        </div>
      </form>
    </div>
  )
}
