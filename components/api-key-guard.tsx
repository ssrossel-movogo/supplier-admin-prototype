"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { verifyApiKey } from "@/app/actions/verify-api-key"

const STORAGE_KEY = "supplier_admin_validated"

export function ApiKeyGuard({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    async function checkAuthorization() {
      // Check for API key in URL query params
      const apiKeyFromUrl = searchParams.get("apiKey")

      // Check for stored validation status in sessionStorage
      const isValidated = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) === "true" : false

      if (apiKeyFromUrl) {
        const isValid = await verifyApiKey(apiKeyFromUrl)
        if (isValid) {
          sessionStorage.setItem(STORAGE_KEY, "true")
          setIsAuthorized(true)
        } else {
          setIsAuthorized(false)
        }
      } else if (isValidated) {
        // Use stored validation status
        setIsAuthorized(true)
      } else {
        // No valid authorization found
        setIsAuthorized(false)
      }
    }

    checkAuthorization()
  }, [searchParams])

  // Show loading state while checking
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse text-muted-foreground">Verificerer adgang...</div>
      </div>
    )
  }

  // Show access denied if not authorized
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Adgang Nægtet</CardTitle>
            </div>
            <CardDescription>Du har ikke tilladelse til at få adgang til denne applikation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              For at få adgang skal du have en gyldig API-nøgle. Kontakt din administrator for at få adgang.
            </p>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-xs text-muted-foreground font-mono">
                Tilføj ?apiKey=DIN_NØGLE til URL'en for at få adgang
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render app if authorized
  return <>{children}</>
}
