"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  MessageSquare,
  FileText,
  ImageIcon,
  Send,
  Download,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Clock,
  User,
  Building2,
  Wrench,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

// Mock data
const mockDispute = {
  id: "DSP-2024-001",
  equipment: {
    name: "Volvo EC220 Gravemaskine",
    id: "EQ-220",
    serialNumber: "VCE220-2023-445",
  },
  rental: {
    id: "RNT-2024-156",
    startDate: "2024-11-01",
    endDate: "2024-11-15",
  },
  customer: {
    name: "Andersen Byg A/S",
    contact: "Lars Andersen",
    email: "lars@andersenbyg.dk",
    phone: "+45 20 12 34 56",
    avatar: "/placeholder-32px.png",
  },
  type: "damage",
  description: "Hydraulisk slange beskadiget under brug. Kunden hævder, at slangen var defekt ved levering.",
  reportedDate: "2024-11-15T14:30:00",
  reportedBy: "System (fra inspektion)",
  status: "under-review",
  severity: "medium",
  estimatedCost: 3500,
  assignedTo: "Maria Hansen",
  dueDate: "2024-11-22",
}

const mockEvidence = [
  {
    id: "1",
    type: "photo",
    title: "Beskadiget hydraulisk slange",
    url: "/cracked-headlight.jpg",
    uploadedBy: "Inspektør",
    uploadedAt: "2024-11-15T15:00:00",
  },
  {
    id: "2",
    type: "photo",
    title: "Oversigt af skadeområde",
    url: "/excavator-front-view.jpg",
    uploadedBy: "Inspektør",
    uploadedAt: "2024-11-15T15:02:00",
  },
  {
    id: "3",
    type: "document",
    title: "Inspektionsrapport",
    filename: "inspection-report-2024-11-15.pdf",
    uploadedBy: "System",
    uploadedAt: "2024-11-15T15:30:00",
  },
  {
    id: "4",
    type: "document",
    title: "Kundens modargument",
    filename: "customer-response.pdf",
    uploadedBy: "Lars Andersen",
    uploadedAt: "2024-11-16T09:15:00",
  },
]

const mockTimeline = [
  {
    id: "1",
    type: "created",
    title: "Sag oprettet",
    description: "Automatisk oprettet fra returinspektion",
    user: "System",
    timestamp: "2024-11-15T14:30:00",
  },
  {
    id: "2",
    type: "comment",
    title: "Kommentar tilføjet",
    description: "Inspektør noterer: Slangen ser ud til at være beskadiget af ydre kraft, ikke slitage.",
    user: "Inspektør Jensen",
    timestamp: "2024-11-15T15:05:00",
  },
  {
    id: "3",
    type: "status",
    title: "Status ændret",
    description: "Fra 'Åben' til 'Under Behandling'",
    user: "Maria Hansen",
    timestamp: "2024-11-16T08:00:00",
  },
  {
    id: "4",
    type: "communication",
    title: "Email sendt til kunde",
    description: "Anmodning om yderligere dokumentation",
    user: "Maria Hansen",
    timestamp: "2024-11-16T08:15:00",
  },
  {
    id: "5",
    type: "evidence",
    title: "Dokument uploadet",
    description: "Kundens modargument modtaget",
    user: "Lars Andersen",
    timestamp: "2024-11-16T09:15:00",
  },
]

const statusConfig = {
  open: { label: "Åben", variant: "destructive" as const, icon: AlertCircle },
  "under-review": { label: "Under Behandling", variant: "secondary" as const, icon: Clock },
  resolved: { label: "Løst", variant: "outline" as const, icon: CheckCircle2 },
  rejected: { label: "Afvist", variant: "outline" as const, icon: XCircle },
}

const severityConfig = {
  low: { label: "Lav", variant: "secondary" as const },
  medium: { label: "Mellem", variant: "default" as const },
  high: { label: "Høj", variant: "destructive" as const },
}

const typeConfig = {
  damage: { label: "Skade", color: "text-destructive" },
  dispute: { label: "Tvist", color: "text-accent" },
  complaint: { label: "Klage", color: "text-chart-4" },
}

const timelineIcons = {
  created: AlertCircle,
  comment: MessageSquare,
  status: Clock,
  communication: Mail,
  evidence: FileText,
}

export default function DisputeDetailPage() {
  const [newComment, setNewComment] = useState("")
  const [proposedCost, setProposedCost] = useState(mockDispute.estimatedCost.toString())
  const [resolution, setResolution] = useState("")

  const StatusIcon = statusConfig[mockDispute.status as keyof typeof statusConfig].icon

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/disputes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Tilbage</span>
            </Button>
          </Link>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight">{mockDispute.id}</h1>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={statusConfig[mockDispute.status as keyof typeof statusConfig].variant}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[mockDispute.status as keyof typeof statusConfig].label}
            </Badge>
            <Badge variant={severityConfig[mockDispute.severity as keyof typeof severityConfig].variant}>
              {severityConfig[mockDispute.severity as keyof typeof severityConfig].label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{mockDispute.description}</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Eksporter</span>
              <span className="sm:hidden">Eksporter</span>
            </Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
              <Mail className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Send Email</span>
              <span className="sm:hidden">Email</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="inline-flex w-full overflow-x-auto">
              <TabsTrigger value="overview" className="flex-shrink-0">
                Oversigt
              </TabsTrigger>
              <TabsTrigger value="evidence" className="flex-shrink-0">
                Beviser ({mockEvidence.length})
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex-shrink-0">
                Tidslinje ({mockTimeline.length})
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Dispute Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Sag Detaljer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Type</Label>
                      <div>
                        <Badge
                          variant="outline"
                          className={typeConfig[mockDispute.type as keyof typeof typeConfig].color}
                        >
                          {typeConfig[mockDispute.type as keyof typeof typeConfig].label}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Rapporteret</Label>
                      <p className="text-sm">
                        {new Date(mockDispute.reportedDate).toLocaleDateString("da-DK", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Rapporteret Af</Label>
                      <p className="text-sm">{mockDispute.reportedBy}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Tildelt Til</Label>
                      <p className="text-sm">{mockDispute.assignedTo}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Forfaldsdato</Label>
                      <p className="text-sm flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(mockDispute.dueDate).toLocaleDateString("da-DK")}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Estimeret Omkostning</Label>
                      <p className="text-sm font-semibold flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {mockDispute.estimatedCost.toLocaleString("da-DK")} kr
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resolution Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Løsning</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="proposed-cost">Foreslået Omkostning</Label>
                    <div className="flex gap-2">
                      <Input
                        id="proposed-cost"
                        type="number"
                        value={proposedCost}
                        onChange={(e) => setProposedCost(e.target.value)}
                        placeholder="0"
                      />
                      <span className="flex items-center text-sm text-muted-foreground">kr</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resolution">Løsningsbeskrivelse</Label>
                    <Textarea
                      id="resolution"
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      placeholder="Beskriv hvordan sagen blev løst..."
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Accepter & Luk Sag
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <XCircle className="h-4 w-4" />
                      Afvis Sag
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Evidence Tab */}
            <TabsContent value="evidence" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Beviser & Dokumentation</CardTitle>
                    <Button size="sm">
                      <ImageIcon className="h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {mockEvidence.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          {item.type === "photo" ? (
                            <div className="space-y-2">
                              <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                                <img
                                  src={item.url || "/placeholder.svg"}
                                  alt={item.title}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="space-y-1">
                                <p className="font-medium text-sm">{item.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  Uploadet af {item.uploadedBy} •{" "}
                                  {new Date(item.uploadedAt).toLocaleDateString("da-DK")}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-muted">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <p className="font-medium text-sm">{item.title}</p>
                                <p className="text-xs text-muted-foreground">{item.filename}</p>
                                <p className="text-xs text-muted-foreground">
                                  Uploadet af {item.uploadedBy} •{" "}
                                  {new Date(item.uploadedAt).toLocaleDateString("da-DK")}
                                </p>
                                <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                                  <Download className="h-3 w-3" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Aktivitets Tidslinje</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTimeline.map((event, index) => {
                      const Icon = timelineIcons[event.type as keyof typeof timelineIcons]
                      return (
                        <div key={event.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="p-2 rounded-full bg-muted">
                              <Icon className="h-4 w-4" />
                            </div>
                            {index < mockTimeline.length - 1 && <div className="w-px h-full bg-border mt-2" />}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1">
                                <p className="font-medium text-sm">{event.title}</p>
                                <p className="text-sm text-muted-foreground">{event.description}</p>
                                <p className="text-xs text-muted-foreground">
                                  {event.user} •{" "}
                                  {new Date(event.timestamp).toLocaleDateString("da-DK", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Add Comment */}
              <Card>
                <CardHeader>
                  <CardTitle>Tilføj Kommentar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Skriv en kommentar..."
                    rows={3}
                  />
                  <Button>
                    <Send className="h-4 w-4" />
                    Send Kommentar
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Equipment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Udstyr
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Link href={`/equipment/${mockDispute.equipment.id}`} className="font-medium hover:underline">
                  {mockDispute.equipment.name}
                </Link>
                <p className="text-sm text-muted-foreground">ID: {mockDispute.equipment.id}</p>
                <p className="text-sm text-muted-foreground">S/N: {mockDispute.equipment.serialNumber}</p>
              </div>
            </CardContent>
          </Card>

          {/* Rental Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Lejeaftale
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Link href={`/rentals/${mockDispute.rental.id}`} className="font-medium hover:underline">
                  {mockDispute.rental.id}
                </Link>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Start: {new Date(mockDispute.rental.startDate).toLocaleDateString("da-DK")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Slut: {new Date(mockDispute.rental.endDate).toLocaleDateString("da-DK")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Kunde
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={mockDispute.customer.avatar || "/placeholder.svg"}
                    alt={mockDispute.customer.name}
                  />
                  <AvatarFallback>{mockDispute.customer.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <Link href={`/customers/${mockDispute.customer.name}`} className="font-medium hover:underline">
                    {mockDispute.customer.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{mockDispute.customer.contact}</p>
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${mockDispute.customer.email}`} className="hover:underline">
                    {mockDispute.customer.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${mockDispute.customer.phone}`} className="hover:underline">
                    {mockDispute.customer.phone}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hurtige Handlinger</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <User className="h-4 w-4" />
                Tildel til Anden
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Clock className="h-4 w-4" />
                Ændr Forfaldsdato
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <AlertTriangle className="h-4 w-4" />
                Ændr Alvorlighed
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
