"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  role: string
}

export default function NewCustomerPage() {
  const router = useRouter()
  const [isActive, setIsActive] = useState(true)
  const [contacts, setContacts] = useState<Contact[]>([{ id: "1", name: "", email: "", phone: "", role: "" }])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    router.push("/customers")
  }

  const addContact = () => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name: "",
      email: "",
      phone: "",
      role: "",
    }
    setContacts([...contacts, newContact])
  }

  const removeContact = (id: string) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((contact) => contact.id !== id))
    }
  }

  const updateContact = (id: string, field: keyof Contact, value: string) => {
    setContacts(contacts.map((contact) => (contact.id === id ? { ...contact, [field]: value } : contact)))
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="flex-shrink-0">
          <Link href="/customers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">Tilføj Ny Kunde</h1>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            Udfyld oplysningerne nedenfor for at tilføje en ny kunde
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle>Virksomhedsoplysninger</CardTitle>
                <CardDescription>Grundlæggende information om virksomheden</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Virksomhedsnavn *</Label>
                  <Input id="company-name" placeholder="f.eks. Jensen Entreprise A/S" required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cvr">CVR Nummer *</Label>
                    <Input id="cvr" placeholder="12345678" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Branche</Label>
                    <Select>
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Vælg branche" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="construction">Byggeri & Anlæg</SelectItem>
                        <SelectItem value="landscaping">Anlægsgartner</SelectItem>
                        <SelectItem value="demolition">Nedrivning</SelectItem>
                        <SelectItem value="excavation">Jordarbejde</SelectItem>
                        <SelectItem value="other">Andet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Hjemmeside</Label>
                  <Input id="website" type="url" placeholder="https://www.example.dk" />
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle>Adresseoplysninger</CardTitle>
                <CardDescription>Virksomhedens adresse</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Adresse *</Label>
                  <Input id="street" placeholder="Byggevej 123" required />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="postal-code">Postnummer *</Label>
                    <Input id="postal-code" placeholder="2100" required />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="city">By *</Label>
                    <Input id="city" placeholder="København Ø" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Select>
                    <SelectTrigger id="region">
                      <SelectValue placeholder="Vælg region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hovedstaden">Hovedstaden</SelectItem>
                      <SelectItem value="sjaelland">Sjælland</SelectItem>
                      <SelectItem value="midtjylland">Midtjylland</SelectItem>
                      <SelectItem value="nordjylland">Nordjylland</SelectItem>
                      <SelectItem value="syddanmark">Syddanmark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Contact Persons */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Kontaktpersoner</CardTitle>
                    <CardDescription>Tilføj kontaktpersoner i virksomheden</CardDescription>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addContact}>
                    <Plus className="h-4 w-4" />
                    Tilføj Kontakt
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {contacts.map((contact, index) => (
                  <div key={contact.id} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Kontakt {index + 1}</span>
                      {contacts.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeContact(contact.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`contact-name-${contact.id}`}>Navn *</Label>
                        <Input
                          id={`contact-name-${contact.id}`}
                          placeholder="Navn"
                          value={contact.name}
                          onChange={(e) => updateContact(contact.id, "name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`contact-role-${contact.id}`}>Rolle</Label>
                        <Input
                          id={`contact-role-${contact.id}`}
                          placeholder="f.eks. Projektleder"
                          value={contact.role}
                          onChange={(e) => updateContact(contact.id, "role", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`contact-email-${contact.id}`}>Email *</Label>
                        <Input
                          id={`contact-email-${contact.id}`}
                          type="email"
                          placeholder="email@example.dk"
                          value={contact.email}
                          onChange={(e) => updateContact(contact.id, "email", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`contact-phone-${contact.id}`}>Telefon *</Label>
                        <Input
                          id={`contact-phone-${contact.id}`}
                          type="tel"
                          placeholder="+45 12 34 56 78"
                          value={contact.phone}
                          onChange={(e) => updateContact(contact.id, "phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Yderligere Oplysninger</CardTitle>
                <CardDescription>Noter og særlige forhold</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Interne Noter</Label>
                  <Textarea id="notes" placeholder="Interne noter om denne kunde..." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="special-requirements">Særlige Krav</Label>
                  <Textarea id="special-requirements" placeholder="Særlige krav eller præferencer..." rows={2} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="active">Aktiv Kunde</Label>
                    <p className="text-xs text-muted-foreground">Kan oprette nye bookinger</p>
                  </div>
                  <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-type">Kundetype</Label>
                  <Select defaultValue="business">
                    <SelectTrigger id="customer-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Erhvervskunde</SelectItem>
                      <SelectItem value="private">Privatkunde</SelectItem>
                      <SelectItem value="government">Offentlig</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Credit Information */}
            <Card>
              <CardHeader>
                <CardTitle>Kreditoplysninger</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="credit-limit">Kreditgrænse (kr)</Label>
                  <Input id="credit-limit" type="number" placeholder="100000" defaultValue="100000" />
                </div>
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
                  <Label htmlFor="discount">Rabat (%)</Label>
                  <Input id="discount" type="number" min="0" max="100" placeholder="0" />
                </div>
              </CardContent>
            </Card>

            {/* Billing Information */}
            <Card>
              <CardHeader>
                <CardTitle>Faktureringsoplysninger</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="billing-email">Faktura Email *</Label>
                  <Input id="billing-email" type="email" placeholder="faktura@example.dk" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ean">EAN Nummer</Label>
                  <Input id="ean" placeholder="5798000000000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing-reference">Faktura Reference</Label>
                  <Input id="billing-reference" placeholder="Reference eller afdelingsnummer" />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Præferencer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="preferred-depot">Foretrukket Depot</Label>
                  <Select>
                    <SelectTrigger id="preferred-depot">
                      <SelectValue placeholder="Vælg depot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kbh-nord">København Nord</SelectItem>
                      <SelectItem value="kbh-syd">København Syd</SelectItem>
                      <SelectItem value="roskilde">Roskilde</SelectItem>
                      <SelectItem value="aarhus">Aarhus</SelectItem>
                      <SelectItem value="aalborg">Aalborg</SelectItem>
                      <SelectItem value="odense">Odense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="communication">Foretrukken Kommunikation</Label>
                  <Select defaultValue="email">
                    <SelectTrigger id="communication">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Telefon</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
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
            <Link href="/customers">Annuller</Link>
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            <Save className="h-4 w-4" />
            Gem Kunde
          </Button>
        </div>
      </form>
    </div>
  )
}
