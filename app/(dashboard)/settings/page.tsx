"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Building2,
  Users,
  DollarSign,
  FileText,
  Clock,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  MapPin,
  Save,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data
const teamMembers = [
  { id: 1, name: "John Doe", email: "john@leverandor.dk", role: "Admin", status: "active" },
  { id: 2, name: "Jane Smith", email: "jane@leverandor.dk", role: "Manager", status: "active" },
  { id: 3, name: "Mike Johnson", email: "mike@leverandor.dk", role: "Inspector", status: "active" },
]

const depots = [
  { id: 1, name: "København Depot", address: "Industrivej 12, 2300 København S", region: "Sjælland", capacity: 50 },
  { id: 2, name: "Aarhus Depot", address: "Havnevej 8, 8000 Aarhus C", region: "Jylland", capacity: 35 },
  { id: 3, name: "Odense Depot", address: "Ringvej 45, 5000 Odense C", region: "Fyn", capacity: 25 },
]

const pricingRules = [
  { id: 1, category: "Gravemaskiner", dailyRate: 850, weeklyRate: 4500, monthlyRate: 15000 },
  { id: 2, category: "Hjullæssere", dailyRate: 950, weeklyRate: 5000, monthlyRate: 17000 },
  { id: 3, category: "Kompaktlæssere", dailyRate: 650, weeklyRate: 3500, monthlyRate: 12000 },
]

const slaConfig = [
  { id: 1, type: "Levering", target: 24, unit: "timer", current: 22 },
  { id: 2, type: "Returnering", target: 24, unit: "timer", current: 20 },
  { id: 3, type: "Inspektion", target: 48, unit: "timer", current: 36 },
  { id: 4, type: "Skadesrapport", target: 72, unit: "timer", current: 60 },
]

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Indstillinger</h1>
        <p className="text-muted-foreground mt-1">Administrer dine systemindstillinger og konfiguration</p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="inline-flex w-full overflow-x-auto lg:grid lg:grid-cols-6">
          <TabsTrigger value="company" className="flex-shrink-0">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Virksomhed</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex-shrink-0">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Team</span>
          </TabsTrigger>
          <TabsTrigger value="depots" className="flex-shrink-0">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Depoter</span>
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex-shrink-0">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Priser</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex-shrink-0">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Skabeloner</span>
          </TabsTrigger>
          <TabsTrigger value="sla" className="flex-shrink-0">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">SLA</span>
          </TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Virksomhedsoplysninger</CardTitle>
              <CardDescription>Opdater dine virksomhedsoplysninger og kontaktinformation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Virksomhedsnavn</Label>
                  <Input id="company-name" defaultValue="Riddance Udlejning A/S" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvr">CVR-nummer</Label>
                  <Input id="cvr" defaultValue="12345678" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" defaultValue="Industrivej 42, 2300 København S" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" type="tel" defaultValue="+45 12 34 56 78" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="kontakt@riddance.dk" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Hjemmeside</Label>
                <Input id="website" type="url" defaultValue="https://riddance.dk" />
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4" />
                  Gem Ændringer
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifikationsindstillinger</CardTitle>
              <CardDescription>Vælg hvilke notifikationer du vil modtage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nye Bookinger</Label>
                  <p className="text-sm text-muted-foreground">Modtag notifikationer om nye bookinganmodninger</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Forfaldne Inspektioner</Label>
                  <p className="text-sm text-muted-foreground">Få besked når inspektioner er forfaldne</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Betalingspåmindelser</Label>
                  <p className="text-sm text-muted-foreground">Notifikationer om ubetalte fakturaer</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nye Tvister</Label>
                  <p className="text-sm text-muted-foreground">Få besked når der oprettes nye tvister</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Management */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Teammedlemmer</CardTitle>
                <CardDescription>Administrer brugere og deres roller</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4" />
                Tilføj Medlem
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bruger</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rolle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Handlinger</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`/placeholder-32px.png?height=32&width=32`} />
                            <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{member.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.status === "active" ? "default" : "secondary"}>
                          {member.status === "active" ? "Aktiv" : "Inaktiv"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4" />
                              Rediger
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive">
                              <Trash2 className="h-4 w-4" />
                              Fjern
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Roller & Tilladelser</CardTitle>
              <CardDescription>Definer roller og deres tilladelser</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Admin</p>
                    <p className="text-sm text-muted-foreground">Fuld adgang til alle funktioner</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Rediger
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Manager</p>
                    <p className="text-sm text-muted-foreground">Kan administrere udlejninger og kunder</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Rediger
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Inspector</p>
                    <p className="text-sm text-muted-foreground">Kan udføre inspektioner og rapportere skader</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Rediger
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Depots & Regions */}
        <TabsContent value="depots" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Depoter & Regioner</CardTitle>
                <CardDescription>Administrer dine lagerlokationer</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4" />
                Tilføj Depot
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Navn</TableHead>
                    <TableHead>Adresse</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead className="text-right">Kapacitet</TableHead>
                    <TableHead className="text-right">Handlinger</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {depots.map((depot) => (
                    <TableRow key={depot.id}>
                      <TableCell className="font-medium">{depot.name}</TableCell>
                      <TableCell>{depot.address}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{depot.region}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{depot.capacity} enheder</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4" />
                              Rediger
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive">
                              <Trash2 className="h-4 w-4" />
                              Slet
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Rules */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Prisregler</CardTitle>
                <CardDescription>Definer standardpriser for udstyrskategorier</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4" />
                Tilføj Regel
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-right">Dagspris</TableHead>
                    <TableHead className="text-right">Ugepris</TableHead>
                    <TableHead className="text-right">Månedspris</TableHead>
                    <TableHead className="text-right">Handlinger</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricingRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.category}</TableCell>
                      <TableCell className="text-right">{rule.dailyRate.toLocaleString("da-DK")} kr</TableCell>
                      <TableCell className="text-right">{rule.weeklyRate.toLocaleString("da-DK")} kr</TableCell>
                      <TableCell className="text-right">{rule.monthlyRate.toLocaleString("da-DK")} kr</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4" />
                              Rediger
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive">
                              <Trash2 className="h-4 w-4" />
                              Slet
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rabatregler</CardTitle>
              <CardDescription>Konfigurer automatiske rabatter baseret på udlejningsperiode</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="weekly-discount">Ugerabat (%)</Label>
                  <Input id="weekly-discount" type="number" defaultValue="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthly-discount">Månedsrabat (%)</Label>
                  <Input id="monthly-discount" type="number" defaultValue="20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bulk-discount">Bulkrabat (%)</Label>
                  <Input id="bulk-discount" type="number" defaultValue="15" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4" />
                  Gem Rabatter
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Document Templates */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dokumentskabeloner</CardTitle>
              <CardDescription>Administrer skabeloner til kontrakter, fakturaer og rapporter</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Lejekontrakt Skabelon</p>
                      <p className="text-sm text-muted-foreground">Standard lejekontrakt for udstyr</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Forhåndsvisning
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Faktura Skabelon</p>
                      <p className="text-sm text-muted-foreground">Standard faktura layout</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Forhåndsvisning
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Inspektionsrapport</p>
                      <p className="text-sm text-muted-foreground">Skabelon til leverings- og returinspektioner</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Forhåndsvisning
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Skadesrapport</p>
                      <p className="text-sm text-muted-foreground">Dokumentation af skader og omkostninger</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Forhåndsvisning
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                <Plus className="h-4 w-4" />
                Upload Ny Skabelon
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SLA Configuration */}
        <TabsContent value="sla" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SLA Konfiguration</CardTitle>
              <CardDescription>Definer service level agreements for forskellige processer</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proces Type</TableHead>
                    <TableHead className="text-right">Mål</TableHead>
                    <TableHead className="text-right">Nuværende Gns.</TableHead>
                    <TableHead className="text-right">Performance</TableHead>
                    <TableHead className="text-right">Handlinger</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slaConfig.map((sla) => {
                    const performance = ((sla.target - sla.current) / sla.target) * 100
                    const performanceStatus = performance > 20 ? "default" : performance > 0 ? "default" : "destructive"

                    return (
                      <TableRow key={sla.id}>
                        <TableCell className="font-medium">{sla.type}</TableCell>
                        <TableCell className="text-right">
                          {sla.target} {sla.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          {sla.current} {sla.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={performanceStatus}>
                            {performance > 0 ? `${performance.toFixed(0)}% under mål` : "Over mål"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Eskalationsregler</CardTitle>
              <CardDescription>Automatiske notifikationer når SLA'er er i fare</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Advar ved 80% af SLA</Label>
                  <p className="text-sm text-muted-foreground">Send notifikation når 80% af SLA tid er brugt</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Eskaler ved SLA brud</Label>
                  <p className="text-sm text-muted-foreground">Notificer manager når SLA overskrides</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="escalation-email">Eskalerings Email</Label>
                <Input id="escalation-email" type="email" defaultValue="manager@riddance.dk" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
