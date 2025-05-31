"use client"

import { createUploadthing } from "uploadthing/next"
import { generateReactHelpers } from "@uploadthing/react"
import type { OurFileRouter } from "@/src/lib/uploadthing"

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>()

export function UploadThingProvider({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  )
} 