"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Calendar,
  ClipboardCheck,
  AlertTriangle,
  Receipt,
  Users,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

const routes = [
  {
    label: "Oversigt",
    icon: LayoutDashboard,
    href: "/overview",
  },
  {
    label: "Udstyr",
    icon: Package,
    href: "/equipment",
  },
  {
    label: "Udlejninger",
    icon: Calendar,
    href: "/rentals",
  },
  {
    label: "Inspektioner",
    icon: ClipboardCheck,
    href: "/inspections",
  },
  {
    label: "Skader & Tvister",
    icon: AlertTriangle,
    href: "/disputes",
  },
  {
    label: "Fakturering",
    icon: Receipt,
    href: "/billing",
  },
  {
    label: "Kunder",
    icon: Users,
    href: "/customers",
  },
  {
    label: "Indstillinger",
    icon: Settings,
    href: "/settings",
  },
]

export function DesktopNav() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r bg-card">
      <div className="p-6">
        <h2 className="text-xl font-bold tracking-tight">Riddance Admin</h2>
        <p className="text-sm text-muted-foreground mt-1">Leverandør Portal</p>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 pb-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === route.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              )}
            >
              <route.icon className={cn("h-5 w-5", pathname === route.href ? "text-white" : "text-muted-foreground")} />
              {route.label}
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
