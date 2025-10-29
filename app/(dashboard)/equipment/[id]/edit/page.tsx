"use client"

import type React from "react"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Upload } from "lucide-react"
import { z } from "zod"

const equipmentSchema = z.object({
  name: z.string().min(3, "Navn skal være mindst 3 tegn").max(100, "Navn må ikke overstige 100 tegn"),
  category: z.string().min(1, "Kategori er påkrævet"),
  year: z.coerce
    .number()
    .min(1990, "Årgang skal være efter 1990")
    .max(new Date().getFullYear() + 1, "Årgang kan ikke være i fremtiden"),
  description: z.string().optional(),
  region: z.string().min(1, "Region er påkrævet"),
  depot: z.string().min(1, "Depot er påkrævet"),
  dailyPrice: z.coerce.number().min(0, "Dagspris skal være positiv").max(1000000, "Dagspris er for høj"),
  weeklyPrice: z.coerce.number().min(0, "Ugepris skal være positiv").optional(),
  monthlyPrice: z.coerce.number().min(0, "Månedspris skal være positiv").optional(),
  weight: z.coerce.number().min(0, "Vægt skal være positiv").optional(),
  power: z.coerce.number().min(0, "Effekt skal være positiv").optional(),
  capacity: z.string().optional(),
  published: z.boolean(),
})

type EquipmentFormData = z.infer<typeof equipmentSchema>

// Mock data - would come from loader
const mockEquipment = {
  id: "EQ-001",
  name: "Caterpillar 320 Gravemaskine",
  category: "excavators",
  year: 2022,
  description: "Kraftfuld gravemaskine til store projekter",
  region: "hovedstaden",
  depot: "kbh-nord",
  dailyPrice: 850,
  weeklyPrice: 4500,
  monthlyPrice: 15000,
  weight: 20000,
  power: 121,
  capacity: "1.2 m³",
  published: true,
}

export default function EditEquipmentPage() {
  const router = useRouter()
  const params = useParams()
  const [errors, setErrors] = useState<Partial<Record<keyof EquipmentFormData, string>>>({})
  const [formData, setFormData] = useState<EquipmentFormData>(mockEquipment)

  const handleInputChange = (field: keyof EquipmentFormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate with Zod
    const result = equipmentSchema.safeParse(formData)

    if (!result.success) {
      // Convert Zod errors to our error format
      const newErrors: Partial<Record<keyof EquipmentFormData, string>> = {}
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof EquipmentFormData
        newErrors[field] = error.message
      })
      setErrors(newErrors)
      return
    }

    // Handle form submission
    console.log("[v0] Form validated successfully:", result.data)
    router.push(`/equipment/${params.id}`)
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight truncate">Rediger Udstyr</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1 truncate">{formData.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Grundlæggende Oplysninger</CardTitle>
                <CardDescription>Opdater de grundlæggende detaljer om udstyret</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Navn *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="f.eks. Caterpillar 320 Gravemaskine"
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Vælg kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excavators">Gravemaskiner</SelectItem>
                        <SelectItem value="loaders">Hjullæssere</SelectItem>
                        <SelectItem value="compact">Kompaktlæssere</SelectItem>
                        <SelectItem value="backhoe">Rendegravere</SelectItem>
                        <SelectItem value="mini">Minigravere</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Årgang *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => handleInputChange("year", e.target.value)}
                      placeholder="2023"
                    />
                    {errors.year && <p className="text-sm text-destructive">{errors.year}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Beskrivelse</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Beskriv udstyret, dets funktioner og specifikationer..."
                    rows={4}
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Lokation</CardTitle>
                <CardDescription>Angiv hvor udstyret er placeret</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="region">Region *</Label>
                    <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
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
                    {errors.region && <p className="text-sm text-destructive">{errors.region}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="depot">Depot *</Label>
                    <Select value={formData.depot} onValueChange={(value) => handleInputChange("depot", value)}>
                      <SelectTrigger id="depot">
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
                    {errors.depot && <p className="text-sm text-destructive">{errors.depot}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Prissætning</CardTitle>
                <CardDescription>Angiv udlejningspriser</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="daily-price">Dagspris (kr) *</Label>
                    <Input
                      id="daily-price"
                      type="number"
                      value={formData.dailyPrice}
                      onChange={(e) => handleInputChange("dailyPrice", e.target.value)}
                      placeholder="1200"
                    />
                    {errors.dailyPrice && <p className="text-sm text-destructive">{errors.dailyPrice}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weekly-price">Ugepris (kr)</Label>
                    <Input
                      id="weekly-price"
                      type="number"
                      value={formData.weeklyPrice || ""}
                      onChange={(e) => handleInputChange("weeklyPrice", e.target.value)}
                      placeholder="7000"
                    />
                    {errors.weeklyPrice && <p className="text-sm text-destructive">{errors.weeklyPrice}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthly-price">Månedspris (kr)</Label>
                    <Input
                      id="monthly-price"
                      type="number"
                      value={formData.monthlyPrice || ""}
                      onChange={(e) => handleInputChange("monthlyPrice", e.target.value)}
                      placeholder="25000"
                    />
                    {errors.monthlyPrice && <p className="text-sm text-destructive">{errors.monthlyPrice}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media */}
            <Card>
              <CardHeader>
                <CardTitle>Billeder</CardTitle>
                <CardDescription>Upload billeder af udstyret</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">Klik for at uploade eller træk og slip</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG op til 10MB</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publicering</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="published">Publicer Udstyr</Label>
                    <p className="text-xs text-muted-foreground">Gør udstyret synligt for kunder</p>
                  </div>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => handleInputChange("published", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Specifikationer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Vægt (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight || ""}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    placeholder="22000"
                  />
                  {errors.weight && <p className="text-sm text-destructive">{errors.weight}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="power">Effekt (hk)</Label>
                  <Input
                    id="power"
                    type="number"
                    value={formData.power || ""}
                    onChange={(e) => handleInputChange("power", e.target.value)}
                    placeholder="160"
                  />
                  {errors.power && <p className="text-sm text-destructive">{errors.power}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Kapacitet</Label>
                  <Input
                    id="capacity"
                    value={formData.capacity || ""}
                    onChange={(e) => handleInputChange("capacity", e.target.value)}
                    placeholder="1.2 m³"
                  />
                  {errors.capacity && <p className="text-sm text-destructive">{errors.capacity}</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
            Annuller
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
