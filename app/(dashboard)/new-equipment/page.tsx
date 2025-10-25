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
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NewEquipmentPage() {
  const router = useRouter()
  const [isPublished, setIsPublished] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    router.push("/equipment")
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/equipment">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tilføj Nyt Udstyr</h1>
          <p className="text-muted-foreground mt-1">Udfyld oplysningerne nedenfor for at tilføje nyt udstyr</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Grundlæggende Oplysninger</CardTitle>
                <CardDescription>Indtast de grundlæggende detaljer om udstyret</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Navn *</Label>
                  <Input id="name" placeholder="f.eks. Caterpillar 320 Gravemaskine" required />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori *</Label>
                    <Select required>
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Årgang *</Label>
                    <Input id="year" type="number" placeholder="2023" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Beskrivelse</Label>
                  <Textarea
                    id="description"
                    placeholder="Beskriv udstyret, dets funktioner og specifikationer..."
                    rows={4}
                  />
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
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="region">Region *</Label>
                    <Select required>
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
                  <div className="space-y-2">
                    <Label htmlFor="depot">Depot *</Label>
                    <Select required>
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
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="daily-price">Dagspris (kr) *</Label>
                    <Input id="daily-price" type="number" placeholder="1200" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weekly-price">Ugepris (kr)</Label>
                    <Input id="weekly-price" type="number" placeholder="7000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthly-price">Månedspris (kr)</Label>
                    <Input id="monthly-price" type="number" placeholder="25000" />
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
                  <Switch id="published" checked={isPublished} onCheckedChange={setIsPublished} />
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
                  <Input id="weight" type="number" placeholder="22000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="power">Effekt (hk)</Label>
                  <Input id="power" type="number" placeholder="160" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Kapacitet</Label>
                  <Input id="capacity" placeholder="1.2 m³" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/equipment">Annuller</Link>
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4" />
            Gem Udstyr
          </Button>
        </div>
      </form>
    </div>
  )
}
