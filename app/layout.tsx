import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ApiKeyGuard } from "@/components/api-key-guard"
import { Suspense } from "react"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Leverandør Admin | Riddance",
  description: "Administrer udstyr, udlejninger, inspektioner og mere",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="da">
      <body className={`font-sans antialiased`}>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Indlæser...</div>}>
          <ApiKeyGuard>{children}</ApiKeyGuard>
        </Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
