"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, Save, CalendarIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { da } from "date-fns/locale"

export default function NewRentalPage() {
  const router = useRouter()
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [selectedEquipment, setSelectedEquipment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    router.push("/rentals")
  }

  // Calculate rental duration and price
  const calculateDuration = () => {
    if (!startDate || !endDate) return 0
    const diff = endDate.getTime() - startDate.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const duration = calculateDuration()
  const dailyRate = 1200
  const totalPrice = duration * dailyRate

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="flex-shrink-0">
          <Link href="/rentals">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">Opret Ny Booking</h1>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            Udfyld oplysningerne nedenfor for at oprette en ny udlejning
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Kunde</CardTitle>
                <CardDescription>Vælg eller søg efter kunde</CardDescription>
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact">Kontaktperson</Label>
                    <Input id="contact" placeholder="Navn på kontaktperson" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input id="phone" type="tel" placeholder="+45 12 34 56 78" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Equipment Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Udstyr</CardTitle>
                <CardDescription>Vælg det udstyr der skal udlejes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="equipment">Udstyr *</Label>
                  <Select value={selectedEquipment} onValueChange={setSelectedEquipment} required>
                    <SelectTrigger id="equipment">
                      <SelectValue placeholder="Vælg udstyr" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cat-320">Caterpillar 320 Gravemaskine</SelectItem>
                      <SelectItem value="volvo-ec220">Volvo EC220 Gravemaskine</SelectItem>
                      <SelectItem value="bobcat-s650">Bobcat S650 Kompaktlæsser</SelectItem>
                      <SelectItem value="jcb-3cx">JCB 3CX Rendegraver</SelectItem>
                      <SelectItem value="komatsu-pc138">Komatsu PC138 Minigravemaskine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedEquipment && (
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Dagspris:</span>
                      <span className="font-medium">{dailyRate.toLocaleString("da-DK")} kr</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="text-green-600 font-medium">Tilgængelig</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Lokation:</span>
                      <span className="font-medium">København Nord</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rental Period */}
            <Card>
              <CardHeader>
                <CardTitle>Udlejningsperiode</CardTitle>
                <CardDescription>Vælg start- og slutdato for udlejningen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Startdato *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP", { locale: da }) : "Vælg dato"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Slutdato *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP", { locale: da }) : "Vælg dato"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          disabled={(date) => (startDate ? date < startDate : false)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                {duration > 0 && (
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Varighed:</span>
                      <span className="text-lg font-bold text-primary">{duration} dage</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery Details */}
            <Card>
              <CardHeader>
                <CardTitle>Levering & Afhentning</CardTitle>
                <CardDescription>Angiv leverings- og afhentningsdetaljer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="delivery-address">Leveringsadresse *</Label>
                  <Input id="delivery-address" placeholder="Adresse hvor udstyret skal leveres" required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="delivery-time">Leveringstidspunkt</Label>
                    <Input id="delivery-time" type="time" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickup-time">Afhentningstidspunkt</Label>
                    <Input id="pickup-time" type="time" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-notes">Leveringsnoter</Label>
                  <Textarea id="delivery-notes" placeholder="Særlige instruktioner for levering..." rows={3} />
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Yderligere Oplysninger</CardTitle>
                <CardDescription>Tilføj noter eller særlige betingelser</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Interne Noter</Label>
                  <Textarea id="notes" placeholder="Interne noter om denne booking..." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="po-number">PO Nummer</Label>
                  <Input id="po-number" placeholder="Kundens indkøbsordrenummer" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Prisoversigt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Dagspris:</span>
                    <span className="font-medium">{dailyRate.toLocaleString("da-DK")} kr</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Antal dage:</span>
                    <span className="font-medium">{duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">{totalPrice.toLocaleString("da-DK")} kr</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Levering:</span>
                    <span className="font-medium">800 kr</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Moms (25%):</span>
                    <span className="font-medium">{((totalPrice + 800) * 0.25).toLocaleString("da-DK")} kr</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total:</span>
                      <span className="text-xl font-bold text-primary">
                        {((totalPrice + 800) * 1.25).toLocaleString("da-DK")} kr
                      </span>
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
                      <SelectItem value="prepaid">Forudbetalt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deposit">Depositum (%)</Label>
                  <Input id="deposit" type="number" placeholder="0" min="0" max="100" />
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
                  <Label htmlFor="status">Booking Status</Label>
                  <Select defaultValue="pending">
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Afventer Godkendelse</SelectItem>
                      <SelectItem value="confirmed">Bekræftet</SelectItem>
                      <SelectItem value="draft">Kladde</SelectItem>
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
            <Link href="/rentals">Annuller</Link>
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            <Save className="h-4 w-4" />
            Opret Booking
          </Button>
        </div>
      </form>
    </div>
  )
}
