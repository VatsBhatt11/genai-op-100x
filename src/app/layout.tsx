import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { Toaster } from "../components/ui/toaster"
import { NotificationBell } from "../components/NotificationBell"
import { NextAuthProvider } from "../components/providers/next-auth-provider"
import { UploadThingProvider } from "../components/providers/uploadthing-provider"
import { Navbar } from '@/components/Navbar'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { Session } from 'next-auth'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HireAI",
  description: "AI-powered hiring copilot",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions) as Session & {
    user?: {
      type?: 'candidate' | 'employer'
    }
  }
  const isAuthenticated = !!session
  const userType = session?.user?.type || 'candidate'

  return (
    <html lang="en">
      <body className={inter.className}>
        {isAuthenticated && <Navbar userType={userType} />}
        <main style={{ paddingTop: isAuthenticated ? '70px' : '0' }}>
          <NextAuthProvider>
            <UploadThingProvider>
              {children}
              <Toaster />
            </UploadThingProvider>
          </NextAuthProvider>
        </main>
      </body>
    </html>
  )
}
