import type React from "react"
import type { Metadata } from "next"
import "../styles/globals.css"

export const metadata: Metadata = {
  title: "JobMatch AI - Find Your Perfect Career Match",
  description:
    "Connect talented professionals with their dream jobs using advanced AI matching algorithms. Get personalized recommendations, skill assessments, and career insights that matter.",
  keywords: ["jobs", "career", "AI", "matching", "recruitment", "hiring"],
  authors: [{ name: "JobMatch AI Team" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
