import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/src/styles/globals.css"
import { Toaster } from "../components/ui/toaster"
import { NotificationBell } from "../components/NotificationBell"
import { NextAuthProvider } from "../components/providers/next-auth-provider"
import { UploadThingProvider } from "../components/providers/uploadthing-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "JobMatch AI",
  description: "AI-powered job matching platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="border-b bg-white">
          <div className="max-w-7xl mx-auto px:4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold">JobMatch AI</h1>
              </div>
              <div className="flex items-center space-x-4">
                <NotificationBell />
              </div>
            </div>
          </div>
        </nav>
        <NextAuthProvider>
          <UploadThingProvider>
            {children}
            <Toaster />
          </UploadThingProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
