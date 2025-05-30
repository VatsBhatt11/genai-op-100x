import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { parseResume, calculateCompletionScore, extractExperienceLevel } from "@/lib/resume-parser"
import { z } from "zod"

const parseSchema = z.object({
  userId: z.string(),
  fileUrl: z.string().url(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userId, fileUrl } = parseSchema.parse(body)

    // Verify user owns this profile or is admin
    if (session.user.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Parse the resume
    const { parsedProfile, rawText, cleanedText } = await parseResume(fileUrl)
    const completionScore = calculateCompletionScore(parsedProfile)
    const experienceLevel = extractExperienceLevel(parsedProfile)

    // Update candidate profile with enhanced data
    const candidateProfile = await prisma.candidateProfile.update({
      where: { userId },
      data: {
        fullName: parsedProfile.name,
        parsedProfile,
        rawResumeText: rawText,
        resumeText: cleanedText, // For FTS
        resumeUrl: fileUrl,
        completionScore,
        skills: parsedProfile.skills,
        experience: experienceLevel,
        // Try to extract location from parsed profile or use existing
        location: parsedProfile.name, // This should be improved to extract actual location
      },
    })

    return NextResponse.json(candidateProfile)
  } catch (error) {
    console.error("Parse error:", error)
    return NextResponse.json({ error: "Failed to parse resume" }, { status: 500 })
  }
}
