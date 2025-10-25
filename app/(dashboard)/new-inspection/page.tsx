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
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, CalendarIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { da } from "date-fns/locale"

export default function NewInspectionPage() {
  const router = useRouter()
  const [inspectionDate, setInspectionDate] = useState<Date>()
  const [selectedRental, setSelectedRental] = useState("")
  const [inspectionType, setInspectionType] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    router.push("/inspections")
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="flex-shrink-0">
          <Link href="/inspections">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">Planlæg Ny Inspektion</h1>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            Udfyld oplysningerne nedenfor for at planlægge en ny inspektion
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Inspection Type */}
            <Card>
              <CardHeader>
                <CardTitle>Inspektionstype</CardTitle>
                <CardDescription>Vælg type af inspektion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select value={inspectionType} onValueChange={setInspectionType} required>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Vælg inspektionstype" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delivery">Leveringsinspektion</SelectItem>
                      <SelectItem value="return">Returinspektion</SelectItem>
                      <SelectItem value="periodic">Periodisk Inspektion</SelectItem>
                      <SelectItem value="damage">Skadesinspektion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {inspectionType && (
                  <div className="p-4 bg-muted rounded-lg text-sm">
                    {inspectionType === "delivery" && (
                      <p>Leveringsinspektion udføres når udstyret leveres til kunden for at dokumentere tilstanden.</p>
                    )}
                    {inspectionType === "return" && (
                      <p>Returinspektion udføres når udstyret returneres for at identificere eventuelle skader.</p>
                    )}
                    {inspectionType === "periodic" && (
                      <p>Periodisk inspektion udføres under udlejningen for at sikre udstyrets tilstand.</p>
                    )}
                    {inspectionType === "damage" && (
                      <p>Skadesinspektion udføres når der er rapporteret skader på udstyret.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rental Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Udlejning</CardTitle>
                <CardDescription>Vælg den udlejning der skal inspiceres</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rental">Udlejning *</Label>
                  <Select value={selectedRental} onValueChange={setSelectedRental} required>
                    <SelectTrigger id="rental">
                      <SelectValue placeholder="Vælg udlejning" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="r-001">R-001 - Caterpillar 320 (Jensen Entreprise)</SelectItem>
                      <SelectItem value="r-002">R-002 - Volvo EC220 (Andersen Byg)</SelectItem>
                      <SelectItem value="r-003">R-003 - Bobcat S650 (Nielsen Construction)</SelectItem>
                      <SelectItem value="r-004">R-004 - JCB 3CX (Hansen & Sønner)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedRental && (
                  <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Udstyr:</span>
                      <span className="font-medium">Caterpillar 320 Gravemaskine</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Kunde:</span>
                      <span className="font-medium">Jensen Entreprise A/S</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Periode:</span>
                      <span className="font-medium">15. jan - 28. jan 2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Lokation:</span>
                      <span className="font-medium">Byggevej 123, København</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Planlægning</CardTitle>
                <CardDescription>Vælg dato og tidspunkt for inspektionen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Dato *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {inspectionDate ? format(inspectionDate, "PPP", { locale: da }) : "Vælg dato"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={inspectionDate} onSelect={setInspectionDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Tidspunkt *</Label>
                    <Input id="time" type="time" defaultValue="09:00" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Forventet Varighed (minutter)</Label>
                  <Input id="duration" type="number" placeholder="30" defaultValue="30" />
                </div>
              </CardContent>
            </Card>

            {/* Inspector Assignment */}
            <Card>
              <CardHeader>
                <CardTitle>Inspektør</CardTitle>
                <CardDescription>Tildel en inspektør til denne opgave</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inspector">Inspektør *</Label>
                  <Select required>
                    <SelectTrigger id="inspector">
                      <SelectValue placeholder="Vælg inspektør" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lars">Lars Nielsen</SelectItem>
                      <SelectItem value="mette">Mette Hansen</SelectItem>
                      <SelectItem value="peter">Peter Andersen</SelectItem>
                      <SelectItem value="anne">Anne Jensen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Kontaktperson hos Kunde</Label>
                  <Input id="contact" placeholder="Navn på kontaktperson" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Kontakt Telefon</Label>
                  <Input id="contact-phone" type="tel" placeholder="+45 12 34 56 78" />
                </div>
              </CardContent>
            </Card>

            {/* Checklist Template */}
            <Card>
              <CardHeader>
                <CardTitle>Inspektionsskabelon</CardTitle>
                <CardDescription>Vælg skabelon for inspektionscheckliste</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template">Skabelon *</Label>
                  <Select defaultValue="excavator-standard">
                    <SelectTrigger id="template">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excavator-standard">Gravemaskine - Standard</SelectItem>
                      <SelectItem value="excavator-detailed">Gravemaskine - Detaljeret</SelectItem>
                      <SelectItem value="loader-standard">Hjullæsser - Standard</SelectItem>
                      <SelectItem value="compact-standard">Kompaktlæsser - Standard</SelectItem>
                      <SelectItem value="general">Generel Inspektion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <p className="text-sm font-medium">Skabelon inkluderer:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                    <li>Generel tilstand (10 punkter)</li>
                    <li>Motor og hydraulik (8 punkter)</li>
                    <li>Kabine og betjening (6 punkter)</li>
                    <li>Sikkerhedsudstyr (5 punkter)</li>
                    <li>Dokumentation (4 punkter)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Yderligere Oplysninger</CardTitle>
                <CardDescription>Tilføj noter eller særlige instruktioner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Inspektionsnoter</Label>
                  <Textarea id="notes" placeholder="Særlige forhold eller instruktioner..." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="access-instructions">Adgangsinstruktioner</Label>
                  <Textarea
                    id="access-instructions"
                    placeholder="Hvordan inspektøren får adgang til stedet..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Priority */}
            <Card>
              <CardHeader>
                <CardTitle>Prioritet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioritetsniveau</Label>
                  <Select defaultValue="normal">
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Lav</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">Høj</SelectItem>
                      <SelectItem value="urgent">Akut</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Notifikationer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox id="notify-inspector" defaultChecked />
                    <div className="space-y-1">
                      <Label htmlFor="notify-inspector" className="text-sm font-normal cursor-pointer">
                        Notificer inspektør
                      </Label>
                      <p className="text-xs text-muted-foreground">Send email til inspektør</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox id="notify-customer" defaultChecked />
                    <div className="space-y-1">
                      <Label htmlFor="notify-customer" className="text-sm font-normal cursor-pointer">
                        Notificer kunde
                      </Label>
                      <p className="text-xs text-muted-foreground">Send bekræftelse til kunde</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox id="reminder" defaultChecked />
                    <div className="space-y-1">
                      <Label htmlFor="reminder" className="text-sm font-normal cursor-pointer">
                        Send påmindelse
                      </Label>
                      <p className="text-xs text-muted-foreground">24 timer før inspektion</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SLA */}
            <Card>
              <CardHeader>
                <CardTitle>Service Level</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sla">SLA Niveau</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger id="sla">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (48 timer)</SelectItem>
                      <SelectItem value="priority">Prioritet (24 timer)</SelectItem>
                      <SelectItem value="express">Express (12 timer)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-3 bg-muted rounded-lg text-xs text-muted-foreground">
                  Inspektion skal være gennemført inden for den valgte SLA-periode
                </div>
              </CardContent>
            </Card>

            {/* Photos */}
            <Card>
              <CardHeader>
                <CardTitle>Fotodokumentation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox id="require-photos" defaultChecked />
                  <div className="space-y-1">
                    <Label htmlFor="require-photos" className="text-sm font-normal cursor-pointer">
                      Kræv fotos
                    </Label>
                    <p className="text-xs text-muted-foreground">Minimum 4 fotos påkrævet</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
          <Button type="button" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
            <Link href="/inspections">Annuller</Link>
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            <Save className="h-4 w-4" />
            Planlæg Inspektion
          </Button>
        </div>
      </form>
    </div>
  )
}
