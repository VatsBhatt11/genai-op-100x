import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { calculateMatchScore, generateFeedback } from "@/lib/search"

export async function POST(request: NextRequest, { params }: { params: { jobId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "CANDIDATE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get candidate profile
    const candidateProfile = await prisma.candidateProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!candidateProfile) {
      return NextResponse.json({ error: "Candidate profile not found" }, { status: 404 })
    }

    // Check if already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_candidateId: {
          jobId: params.jobId,
          candidateId: candidateProfile.id,
        },
      },
    })

    if (existingApplication) {
      return NextResponse.json({ error: "Already applied to this job" }, { status: 400 })
    }

    // Calculate match score and generate feedback
    const matchScore = await calculateMatchScore(candidateProfile.id, params.jobId)
    const feedbackSuggestions = await generateFeedback(candidateProfile.id, params.jobId, matchScore)

    // Create application
    const application = await prisma.application.create({
      data: {
        jobId: params.jobId,
        candidateId: candidateProfile.id,
        matchScore,
        feedbackSuggestions,
      },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        candidate: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    console.error("Apply error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
