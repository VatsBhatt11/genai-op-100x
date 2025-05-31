"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UploadButton } from "@uploadthing/react"
import { toast } from "sonner"
import "../../styles/upload.css"
import type { OurFileRouter } from "@/lib/uploadthing"

export default function UploadResumePage() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadComplete = async (res: { url: string }[]) => {
    if (!res?.[0]?.url) {
      toast.error("Failed to upload resume")
      return
    }

    setIsUploading(true)

    try {
      // Call API to parse resume and update profile
      const response = await fetch("/api/resume/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeUrl: res[0].url,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to parse resume")
      }

      toast.success("Resume uploaded and parsed successfully!")
      router.push("/dashboard")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h1 className="upload-title">Upload Your Resume</h1>
        <p className="upload-subtitle">
          Upload your resume to complete your profile. We'll automatically extract your skills and experience.
        </p>

        <div className="upload-content">
          <UploadButton<OurFileRouter, "resumeUploader">
            endpoint="resumeUploader"
            onClientUploadComplete={handleUploadComplete}
            onUploadError={(error: Error) => {
              toast.error(`ERROR! ${error.message}`)
            }}
          />
          <p className="upload-info">
            Supported formats: PDF, DOC, DOCX
          </p>
          {isUploading && (
            <p className="upload-progress">
              Processing your resume...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
