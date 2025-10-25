"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, Package, Calendar, ClipboardCheck, AlertTriangle, Receipt, Users } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"

interface SearchResult {
  id: string
  type: "equipment" | "rental" | "inspection" | "dispute" | "invoice" | "customer"
  title: string
  subtitle: string
  href: string
  icon: React.ElementType
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    type: "equipment",
    title: "Minigraver Kubota KX080-4",
    subtitle: "EXC-001 • Tilgængelig",
    href: "/equipment/1",
    icon: Package,
  },
  {
    id: "2",
    type: "rental",
    title: "Udlejning #R-2024-001",
    subtitle: "Byggefirma A/S • Aktiv",
    href: "/rentals/1",
    icon: Calendar,
  },
  {
    id: "3",
    type: "customer",
    title: "Byggefirma A/S",
    subtitle: "København • Aktiv",
    href: "/customers/1",
    icon: Users,
  },
  {
    id: "4",
    type: "inspection",
    title: "Leveringsinspektionen",
    subtitle: "EXC-001 • Planlagt i dag",
    href: "/inspections/1",
    icon: ClipboardCheck,
  },
  {
    id: "5",
    type: "dispute",
    title: "Skadessag #1234",
    subtitle: "Revnet forlygter • Høj",
    href: "/disputes/1",
    icon: AlertTriangle,
  },
  {
    id: "6",
    type: "invoice",
    title: "Faktura #INV-2024-001",
    subtitle: "15.000 kr • Ubetalt",
    href: "/billing",
    icon: Receipt,
  },
]

export function SearchDialog() {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const filteredResults = mockResults.filter(
    (result) =>
      result.title.toLowerCase().includes(search.toLowerCase()) ||
      result.subtitle.toLowerCase().includes(search.toLowerCase()),
  )

  const groupedResults = filteredResults.reduce(
    (acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = []
      }
      acc[result.type].push(result)
      return acc
    },
    {} as Record<string, SearchResult[]>,
  )

  const typeLabels: Record<string, string> = {
    equipment: "Udstyr",
    rental: "Udlejninger",
    inspection: "Inspektioner",
    dispute: "Tvister",
    invoice: "Fakturaer",
    customer: "Kunder",
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full max-w-sm justify-start text-sm text-muted-foreground hidden sm:flex bg-transparent"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Søg udstyr, kunder, udlejninger...
        <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Søg udstyr, kunder, udlejninger..." value={search} onValueChange={setSearch} />
        <CommandList>
          <CommandEmpty>Ingen resultater fundet.</CommandEmpty>
          {Object.entries(groupedResults).map(([type, results]) => (
            <CommandGroup key={type} heading={typeLabels[type]}>
              {results.map((result) => {
                const Icon = result.icon
                return (
                  <CommandItem
                    key={result.id}
                    value={result.title}
                    onSelect={() => {
                      router.push(result.href)
                      setOpen(false)
                    }}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span>{result.title}</span>
                      <span className="text-xs text-muted-foreground">{result.subtitle}</span>
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
