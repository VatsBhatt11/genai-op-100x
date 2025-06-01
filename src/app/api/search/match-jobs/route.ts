import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { searchJobsForCandidate } from "@/lib/enhanced-search";
import { generateJobMatchScore } from "@/lib/groq";
import { z } from "zod";

const searchSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  includeMatchScore: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only candidates should be able to search for jobs
    if (session.user.role !== "CANDIDATE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { page, limit, includeMatchScore } = searchSchema.parse(body);

    // Get candidate profile
    const candidateProfile = await prisma.candidateProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!candidateProfile) {
      return NextResponse.json(
        { error: "Candidate profile not found" },
        { status: 404 }
      );
    }

    // Search for matching jobs
    const jobs = await searchJobsForCandidate(candidateProfile.id, page, limit);

    // Optionally include AI-generated match scores
    const results = await Promise.all(
      jobs.map(async (job: any) => {
        let matchScore = null;
        let matchReasoning = null;

        if (includeMatchScore) {
          try {
            const matchResult = await generateJobMatchScore(
              candidateProfile,
              job.description,
              job.skills || []
            );
            matchScore = matchResult.score;
            matchReasoning = matchResult.reasoning;
          } catch (error) {
            // console.error("Error generating match score:", error)
          }
        }

        return {
          id: job.id,
          title: job.title,
          description: job.description,
          location: job.location,
          experience: job.experience,
          employmentType: job.employmentType,
          isRemote: job.isRemote,
          skills: job.skills,
          company: {
            id: job.companyId,
            email: job.company_email || job.company?.email,
          },
          rank: job.rank || null,
          matchScore,
          matchReasoning,
          createdAt: job.createdAt,
        };
      })
    );

    return NextResponse.json({
      jobs: results,
      pagination: {
        page,
        limit,
        hasMore: results.length === limit,
      },
      candidateProfile: {
        id: candidateProfile.id,
        skills: candidateProfile.skills,
        experience: candidateProfile.experience,
        location: candidateProfile.location,
      },
    });
  } catch (error) {
    // console.error("Job search error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid search parameters", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to search jobs" },
      { status: 500 }
    );
  }
}
