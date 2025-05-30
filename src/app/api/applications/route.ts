import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let applications

    if (session.user.role === "CANDIDATE") {
      const candidateProfile = await prisma.candidateProfile.findUnique({
        where: { userId: session.user.id },
      })

      if (!candidateProfile) {
        return NextResponse.json([])
      }

      applications = await prisma.application.findMany({
        where: { candidateId: candidateProfile.id },
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
        },
        orderBy: { createdAt: "desc" },
      })
    } else {
      // Company user - get applications for their jobs
      applications = await prisma.application.findMany({
        where: {
          job: {
            companyId: session.user.id,
          },
        },
        include: {
          job: true,
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
        orderBy: { createdAt: "desc" },
      })
    }

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Get applications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
