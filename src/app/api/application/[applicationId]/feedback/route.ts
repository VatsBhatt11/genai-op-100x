import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateMatchScore, generateFeedback } from "@/lib/search";

export async function POST(
  request: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const application = await prisma.application.findUnique({
      where: { id: params.applicationId },
      include: {
        job: true,
        candidate: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Check permissions
    const isCandidate = session.user.id === application.candidate.user.id;
    const isCompany = session.user.id === application.job.companyId;

    if (!isCandidate && !isCompany) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Regenerate feedback
    const matchScore = await calculateMatchScore(
      application.candidateId,
      application.jobId
    );
    const feedbackSuggestions = await generateFeedback(
      application.candidateId,
      application.jobId,
      matchScore
    );

    const updatedApplication = await prisma.application.update({
      where: { id: params.applicationId },
      data: {
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
    });

    return NextResponse.json(updatedApplication);
  } catch (error) {
    // console.error("Update feedback error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
