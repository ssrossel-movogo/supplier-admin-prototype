"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Calendar,
  User,
  Building2,
  Wrench,
  Camera,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Send,
  Plus,
  X,
  PenTool,
  Upload,
} from "lucide-react"

// Mock data
const mockInspection = {
  id: "INS-2024-001",
  equipment: {
    name: "Caterpillar 320 Gravemaskine",
    serialNumber: "CAT320-2023-001",
    category: "Gravemaskiner",
  },
  type: "check-in",
  status: "completed",
  scheduledDate: "2024-11-16",
  scheduledTime: "09:00",
  completedDate: "2024-11-16",
  completedTime: "09:45",
  customer: {
    name: "Jensen Entreprise",
    contact: "Lars Jensen",
    phone: "+45 12 34 56 78",
  },
  rental: {
    id: "RNT-2024-123",
    startDate: "2024-10-15",
    endDate: "2024-11-15",
    duration: "31 dage",
  },
  inspector: {
    name: "John Doe",
    email: "john.doe@example.com",
  },
  findings: [
    { id: "1", category: "Karosseri", item: "Kabine", status: "ok", notes: "" },
    { id: "2", category: "Karosseri", item: "Dør og vinduer", status: "ok", notes: "" },
    {
      id: "3",
      category: "Karosseri",
      item: "Lygter",
      status: "damaged",
      notes: "Venstre forlygte revnet",
      severity: "minor",
    },
    { id: "4", category: "Motor", item: "Oliestander", status: "ok", notes: "" },
    { id: "5", category: "Motor", item: "Kølevæske", status: "ok", notes: "" },
    { id: "6", category: "Hydraulik", item: "Slanger", status: "ok", notes: "" },
    { id: "7", category: "Hydraulik", item: "Cylindre", status: "ok", notes: "" },
    {
      id: "8",
      category: "Dæk/Bælter",
      item: "Bælter",
      status: "worn",
      notes: "Slitage på højre bælte",
      severity: "moderate",
    },
    { id: "9", category: "Sikkerhed", item: "Sikkerhedsseler", status: "ok", notes: "" },
    { id: "10", category: "Sikkerhed", item: "Brandslukkere", status: "ok", notes: "" },
  ],
  photos: [
    { id: "1", url: "/excavator-front-view.jpg", caption: "Forside", category: "overview" },
    { id: "2", url: "/excavator-left-side.jpg", caption: "Venstre side", category: "overview" },
    { id: "3", url: "/excavator-right-side.jpg", caption: "Højre side", category: "overview" },
    { id: "4", url: "/excavator-back-view.jpg", caption: "Bagside", category: "overview" },
    { id: "5", url: "/cracked-headlight.jpg", caption: "Revnet forlygte", category: "damage" },
    { id: "6", url: "/worn-track.jpg", caption: "Slidt bælte", category: "damage" },
  ],
  notes: "Udstyret returneret i generelt god stand. To mindre problemer identificeret og dokumenteret.",
  signatureUrl: "/handwritten-signature.png",
  signedBy: "Lars Jensen",
  signedAt: "2024-11-16 09:45",
}

const statusConfig = {
  scheduled: { label: "Planlagt", variant: "secondary" as const, icon: Calendar },
  "in-progress": { label: "I Gang", variant: "default" as const, icon: Clock },
  completed: { label: "Afsluttet", variant: "outline" as const, icon: CheckCircle2 },
}

const typeConfig = {
  "check-in": { label: "Ind-Check", color: "text-chart-3" },
  "check-out": { label: "Ud-Check", color: "text-chart-4" },
}

const findingStatusConfig = {
  ok: { label: "OK", variant: "secondary" as const, icon: CheckCircle2 },
  damaged: { label: "Beskadiget", variant: "destructive" as const, icon: AlertTriangle },
  worn: { label: "Slidt", variant: "default" as const, icon: Clock },
  missing: { label: "Mangler", variant: "destructive" as const, icon: X },
}

const severityConfig = {
  minor: { label: "Mindre", color: "text-yellow-600" },
  moderate: { label: "Moderat", color: "text-orange-600" },
  major: { label: "Alvorlig", color: "text-red-600" },
}

export default function InspectionDetailPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [createDamageDialogOpen, setCreateDamageDialogOpen] = useState(false)
  const [selectedFinding, setSelectedFinding] = useState<string | null>(null)

  const issuesCount = mockInspection.findings.filter((f) => f.status !== "ok").length

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/inspections">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Tilbage</span>
            </Link>
          </Button>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight">{mockInspection.id}</h1>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={typeConfig[mockInspection.type as keyof typeof typeConfig].color}>
              {typeConfig[mockInspection.type as keyof typeof typeConfig].label}
            </Badge>
            <Badge variant={statusConfig[mockInspection.status as keyof typeof statusConfig].variant}>
              {statusConfig[mockInspection.status as keyof typeof statusConfig].label}
            </Badge>
            <span className="text-sm text-muted-foreground truncate">{mockInspection.equipment.name}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Eksporter PDF
            </Button>
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              <Send className="h-4 w-4 mr-2" />
              Send Rapport
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kunde</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-semibold">{mockInspection.customer.name}</div>
            <p className="text-sm text-muted-foreground">{mockInspection.customer.contact}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inspektør</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-semibold">{mockInspection.inspector.name}</div>
            <p className="text-sm text-muted-foreground">{mockInspection.inspector.email}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Afsluttet</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-semibold">{mockInspection.completedDate}</div>
            <p className="text-sm text-muted-foreground">{mockInspection.completedTime}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Problemer</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{issuesCount}</div>
            <p className="text-sm text-muted-foreground">Fund identificeret</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="findings" className="space-y-4">
        <TabsList className="inline-flex w-full overflow-x-auto">
          <TabsTrigger value="findings" className="flex-shrink-0">
            <FileText className="h-4 w-4" />
            Fund ({issuesCount})
          </TabsTrigger>
          <TabsTrigger value="photos" className="flex-shrink-0">
            <Camera className="h-4 w-4" />
            Fotos ({mockInspection.photos.length})
          </TabsTrigger>
          <TabsTrigger value="details" className="flex-shrink-0">
            <Wrench className="h-4 w-4" />
            Detaljer
          </TabsTrigger>
          <TabsTrigger value="signature" className="flex-shrink-0">
            <PenTool className="h-4 w-4" />
            Underskrift
          </TabsTrigger>
        </TabsList>

        {/* Findings Tab */}
        <TabsContent value="findings" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Inspektionsfund</CardTitle>
                {issuesCount > 0 && (
                  <Button onClick={() => setCreateDamageDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Opret Skadessag
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {["Karosseri", "Motor", "Hydraulik", "Dæk/Bælter", "Sikkerhed"].map((category) => {
                const categoryFindings = mockInspection.findings.filter((f) => f.category === category)
                return (
                  <div key={category}>
                    <h3 className="font-semibold mb-3">{category}</h3>
                    <div className="space-y-2">
                      {categoryFindings.map((finding) => (
                        <div
                          key={finding.id}
                          className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                          <Checkbox
                            checked={finding.status !== "ok"}
                            className="mt-1"
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedFinding(finding.id)
                                setCreateDamageDialogOpen(true)
                              }
                            }}
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{finding.item}</span>
                              <Badge
                                variant={
                                  findingStatusConfig[finding.status as keyof typeof findingStatusConfig].variant
                                }
                              >
                                {findingStatusConfig[finding.status as keyof typeof findingStatusConfig].label}
                              </Badge>
                              {finding.severity && (
                                <Badge
                                  variant="outline"
                                  className={severityConfig[finding.severity as keyof typeof severityConfig].color}
                                >
                                  {severityConfig[finding.severity as keyof typeof severityConfig].label}
                                </Badge>
                              )}
                            </div>
                            {finding.notes && <p className="text-sm text-muted-foreground">{finding.notes}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Generelle Bemærkninger</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{mockInspection.notes}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Photos Tab */}
        <TabsContent value="photos" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Inspektionsfotos</CardTitle>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Foto
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Overview Photos */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Oversigt</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mockInspection.photos
                      .filter((p) => p.category === "overview")
                      .map((photo) => (
                        <button
                          key={photo.id}
                          onClick={() => setSelectedPhoto(photo.url)}
                          className="group relative aspect-[4/3] rounded-lg overflow-hidden border bg-muted hover:ring-2 hover:ring-primary transition-all"
                        >
                          <Image
                            src={photo.url || "/placeholder.svg"}
                            alt={photo.caption}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="h-6 w-6 text-white" />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-xs text-white font-medium">{photo.caption}</p>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Damage Photos */}
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Skader & Problemer
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mockInspection.photos
                      .filter((p) => p.category === "damage")
                      .map((photo) => (
                        <button
                          key={photo.id}
                          onClick={() => setSelectedPhoto(photo.url)}
                          className="group relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-destructive/50 bg-muted hover:ring-2 hover:ring-destructive transition-all"
                        >
                          <Image
                            src={photo.url || "/placeholder.svg"}
                            alt={photo.caption}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="h-6 w-6 text-white" />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-xs text-white font-medium">{photo.caption}</p>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Equipment Info */}
            <Card>
              <CardHeader>
                <CardTitle>Udstyr</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-muted-foreground">Navn</Label>
                  <p className="font-medium">{mockInspection.equipment.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Serienummer</Label>
                  <p className="font-medium">{mockInspection.equipment.serialNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Kategori</Label>
                  <p className="font-medium">{mockInspection.equipment.category}</p>
                </div>
              </CardContent>
            </Card>

            {/* Rental Info */}
            <Card>
              <CardHeader>
                <CardTitle>Lejeaftale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-muted-foreground">Leje ID</Label>
                  <Link
                    href={`/rentals/${mockInspection.rental.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {mockInspection.rental.id}
                  </Link>
                </div>
                <div>
                  <Label className="text-muted-foreground">Periode</Label>
                  <p className="font-medium">
                    {mockInspection.rental.startDate} - {mockInspection.rental.endDate}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Varighed</Label>
                  <p className="font-medium">{mockInspection.rental.duration}</p>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Kunde</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-muted-foreground">Virksomhed</Label>
                  <p className="font-medium">{mockInspection.customer.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Kontaktperson</Label>
                  <p className="font-medium">{mockInspection.customer.contact}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Telefon</Label>
                  <p className="font-medium">{mockInspection.customer.phone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Inspection Info */}
            <Card>
              <CardHeader>
                <CardTitle>Inspektion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-muted-foreground">Planlagt</Label>
                  <p className="font-medium">
                    {mockInspection.scheduledDate} kl. {mockInspection.scheduledTime}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Afsluttet</Label>
                  <p className="font-medium">
                    {mockInspection.completedDate} kl. {mockInspection.completedTime}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Inspektør</Label>
                  <p className="font-medium">{mockInspection.inspector.name}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Signature Tab */}
        <TabsContent value="signature" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Kunde Underskrift</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/30">
                <Image
                  src={mockInspection.signatureUrl || "/placeholder.svg"}
                  alt="Kunde underskrift"
                  width={300}
                  height={150}
                  className="mx-auto"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Underskrevet af:</span>
                  <span className="font-medium">{mockInspection.signedBy}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Dato & tid:</span>
                  <span className="font-medium">{mockInspection.signedAt}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Ved at underskrive bekræfter kunden, at inspektionen er gennemført, og at de er enige i de
                identificerede fund.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Photo Viewer Dialog */}
      {selectedPhoto && (
        <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Inspektionsfoto</DialogTitle>
            </DialogHeader>
            <div className="relative aspect-[4/3] w-full">
              <Image src={selectedPhoto || "/placeholder.svg"} alt="Inspektionsfoto" fill className="object-contain" />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Damage Claim Dialog */}
      <Dialog open={createDamageDialogOpen} onOpenChange={setCreateDamageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Opret Skadessag</DialogTitle>
            <DialogDescription>
              Konverter inspektionsfund til en skadessag for opfølgning og fakturering.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="finding">Fund</Label>
              <Select defaultValue={selectedFinding || undefined}>
                <SelectTrigger id="finding">
                  <SelectValue placeholder="Vælg fund" />
                </SelectTrigger>
                <SelectContent>
                  {mockInspection.findings
                    .filter((f) => f.status !== "ok")
                    .map((finding) => (
                      <SelectItem key={finding.id} value={finding.id}>
                        {finding.item} - {finding.notes}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Alvorlighed</Label>
              <Select defaultValue="moderate">
                <SelectTrigger id="severity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minor">Mindre</SelectItem>
                  <SelectItem value="moderate">Moderat</SelectItem>
                  <SelectItem value="major">Alvorlig</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimated-cost">Estimeret Omkostning (DKK)</Label>
              <Input id="estimated-cost" type="number" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Beskrivelse</Label>
              <Textarea id="description" placeholder="Beskriv skaden og nødvendige reparationer..." rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDamageDialogOpen(false)}>
              Annuller
            </Button>
            <Button onClick={() => setCreateDamageDialogOpen(false)}>Opret Skadessag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
