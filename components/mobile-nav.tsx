"use client"

import * as React from "react"
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
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <ScrollArea className="h-full py-6">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Movogo Admin</h2>
            <div className="space-y-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    pathname === route.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  <route.icon
                    className={cn("h-5 w-5", pathname === route.href ? "text-white" : "text-muted-foreground")}
                  />
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
