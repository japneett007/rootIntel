import { Toaster } from "@/components/ui/toaster"
import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import ServiceWorkerRegistration from "@/components/service-worker-registration"
import ThemeProvider from "@/components/theme-provider"
import PWAInstallPrompt from "@/components/pwa-install-prompt"
import OfflineIndicator from "@/components/offline-indicator"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ServiceWorkerRegistration />
          <PWAInstallPrompt />
          <OfflineIndicator />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
