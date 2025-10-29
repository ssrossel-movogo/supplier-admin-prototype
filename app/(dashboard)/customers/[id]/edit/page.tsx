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
import { z } from "zod"

// Zod validation schema
const contactSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Navn er påkrævet"),
  email: z.string().email("Ugyldig email adresse"),
  phone: z.string().min(8, "Telefonnummer skal være mindst 8 cifre"),
  role: z.string().optional(),
})

const customerSchema = z.object({
  companyName: z.string().min(1, "Virksomhedsnavn er påkrævet"),
  cvr: z.string().length(8, "CVR nummer skal være 8 cifre"),
  industry: z.string().optional(),
  website: z.string().url("Ugyldig URL").optional().or(z.literal("")),
  street: z.string().min(1, "Adresse er påkrævet"),
  postalCode: z.string().min(4, "Postnummer er påkrævet"),
  city: z.string().min(1, "By er påkrævet"),
  region: z.string().optional(),
  contacts: z.array(contactSchema).min(1, "Mindst én kontaktperson er påkrævet"),
  notes: z.string().optional(),
  specialRequirements: z.string().optional(),
  isActive: z.boolean(),
  customerType: z.enum(["business", "private", "government"]),
  creditLimit: z.number().min(0, "Kreditgrænse skal være positiv"),
  paymentTerms: z.enum(["net14", "net30", "net60", "prepaid"]),
  discount: z.number().min(0).max(100, "Rabat skal være mellem 0 og 100"),
  billingEmail: z.string().email("Ugyldig email adresse"),
  ean: z.string().optional(),
  billingReference: z.string().optional(),
  preferredDepot: z.string().optional(),
  communication: z.enum(["email", "phone", "sms"]),
})

type CustomerFormData = z.infer<typeof customerSchema>

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  role: string
}

// Mock existing customer data
const existingCustomer = {
  id: "1",
  companyName: "Jensen Entreprise A/S",
  cvr: "12345678",
  industry: "construction",
  website: "https://www.jensen-entreprise.dk",
  street: "Byggevej 42",
  postalCode: "2100",
  city: "København Ø",
  region: "hovedstaden",
  contacts: [
    {
      id: "1",
      name: "Lars Jensen",
      email: "lars@jensen-entreprise.dk",
      phone: "+45 12 34 56 78",
      role: "Direktør",
    },
    {
      id: "2",
      name: "Maria Jensen",
      email: "maria@jensen-entreprise.dk",
      phone: "+45 23 45 67 89",
      role: "Projektleder",
    },
  ],
  notes: "Vigtig kunde med mange projekter",
  specialRequirements: "Foretrækker levering om morgenen",
  isActive: true,
  customerType: "business" as const,
  creditLimit: 250000,
  paymentTerms: "net30" as const,
  discount: 5,
  billingEmail: "faktura@jensen-entreprise.dk",
  ean: "5798000000000",
  billingReference: "Afd. 42",
  preferredDepot: "kbh-nord",
  communication: "email" as const,
}

export default function EditCustomerPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isActive, setIsActive] = useState(existingCustomer.isActive)
  const [contacts, setContacts] = useState<Contact[]>(existingCustomer.contacts)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const data: CustomerFormData = {
      companyName: formData.get("company-name") as string,
      cvr: formData.get("cvr") as string,
      industry: formData.get("industry") as string,
      website: formData.get("website") as string,
      street: formData.get("street") as string,
      postalCode: formData.get("postal-code") as string,
      city: formData.get("city") as string,
      region: formData.get("region") as string,
      contacts: contacts,
      notes: formData.get("notes") as string,
      specialRequirements: formData.get("special-requirements") as string,
      isActive: isActive,
      customerType: formData.get("customer-type") as "business" | "private" | "government",
      creditLimit: Number(formData.get("credit-limit")),
      paymentTerms: formData.get("payment-terms") as "net14" | "net30" | "net60" | "prepaid",
      discount: Number(formData.get("discount")),
      billingEmail: formData.get("billing-email") as string,
      ean: formData.get("ean") as string,
      billingReference: formData.get("billing-reference") as string,
      preferredDepot: formData.get("preferred-depot") as string,
      communication: formData.get("communication") as "email" | "phone" | "sms",
    }

    const result = customerSchema.safeParse(data)

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
    console.log("Form data:", result.data)
    router.push(`/customers/${params.id}`)
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
          <Link href={`/customers/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">Rediger Kunde</h1>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            Opdater kundeoplysninger for {existingCustomer.companyName}
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
                  <Input
                    id="company-name"
                    name="company-name"
                    placeholder="f.eks. Jensen Entreprise A/S"
                    defaultValue={existingCustomer.companyName}
                    required
                  />
                  {errors.companyName && <p className="text-sm text-destructive">{errors.companyName}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cvr">CVR Nummer *</Label>
                    <Input id="cvr" name="cvr" placeholder="12345678" defaultValue={existingCustomer.cvr} required />
                    {errors.cvr && <p className="text-sm text-destructive">{errors.cvr}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Branche</Label>
                    <Select name="industry" defaultValue={existingCustomer.industry}>
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
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="https://www.example.dk"
                    defaultValue={existingCustomer.website}
                  />
                  {errors.website && <p className="text-sm text-destructive">{errors.website}</p>}
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
                  <Input
                    id="street"
                    name="street"
                    placeholder="Byggevej 123"
                    defaultValue={existingCustomer.street}
                    required
                  />
                  {errors.street && <p className="text-sm text-destructive">{errors.street}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="postal-code">Postnummer *</Label>
                    <Input
                      id="postal-code"
                      name="postal-code"
                      placeholder="2100"
                      defaultValue={existingCustomer.postalCode}
                      required
                    />
                    {errors.postalCode && <p className="text-sm text-destructive">{errors.postalCode}</p>}
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="city">By *</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="København Ø"
                      defaultValue={existingCustomer.city}
                      required
                    />
                    {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Select name="region" defaultValue={existingCustomer.region}>
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
                    <CardDescription>Opdater kontaktpersoner i virksomheden</CardDescription>
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
                        {errors[`contacts.${index}.name`] && (
                          <p className="text-sm text-destructive">{errors[`contacts.${index}.name`]}</p>
                        )}
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
                        {errors[`contacts.${index}.email`] && (
                          <p className="text-sm text-destructive">{errors[`contacts.${index}.email`]}</p>
                        )}
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
                        {errors[`contacts.${index}.phone`] && (
                          <p className="text-sm text-destructive">{errors[`contacts.${index}.phone`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {errors.contacts && <p className="text-sm text-destructive">{errors.contacts}</p>}
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
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Interne noter om denne kunde..."
                    rows={3}
                    defaultValue={existingCustomer.notes}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="special-requirements">Særlige Krav</Label>
                  <Textarea
                    id="special-requirements"
                    name="special-requirements"
                    placeholder="Særlige krav eller præferencer..."
                    rows={2}
                    defaultValue={existingCustomer.specialRequirements}
                  />
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
                  <Select name="customer-type" defaultValue={existingCustomer.customerType}>
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
                  <Input
                    id="credit-limit"
                    name="credit-limit"
                    type="number"
                    placeholder="100000"
                    defaultValue={existingCustomer.creditLimit}
                  />
                  {errors.creditLimit && <p className="text-sm text-destructive">{errors.creditLimit}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-terms">Betalingsbetingelser</Label>
                  <Select name="payment-terms" defaultValue={existingCustomer.paymentTerms}>
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
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    defaultValue={existingCustomer.discount}
                  />
                  {errors.discount && <p className="text-sm text-destructive">{errors.discount}</p>}
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
                  <Input
                    id="billing-email"
                    name="billing-email"
                    type="email"
                    placeholder="faktura@example.dk"
                    defaultValue={existingCustomer.billingEmail}
                    required
                  />
                  {errors.billingEmail && <p className="text-sm text-destructive">{errors.billingEmail}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ean">EAN Nummer</Label>
                  <Input id="ean" name="ean" placeholder="5798000000000" defaultValue={existingCustomer.ean} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing-reference">Faktura Reference</Label>
                  <Input
                    id="billing-reference"
                    name="billing-reference"
                    placeholder="Reference eller afdelingsnummer"
                    defaultValue={existingCustomer.billingReference}
                  />
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
                  <Select name="preferred-depot" defaultValue={existingCustomer.preferredDepot}>
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
                  <Select name="communication" defaultValue={existingCustomer.communication}>
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
            <Link href={`/customers/${params.id}`}>Annuller</Link>
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
