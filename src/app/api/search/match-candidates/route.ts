import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { searchCandidatesWithFilters } from "@/lib/enhanced-search";
import { z } from "zod";

const searchSchema = z.object({
  skills: z.array(z.string()).optional(),
  experience: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only companies should be able to search for candidates
    if (session.user.role !== "COMPANY") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const searchParams = searchSchema.parse(body);

    const { page, limit, ...filters } = searchParams;

    // Search for matching candidates
    const candidates = await searchCandidatesWithFilters(filters, page, limit);

    // Transform the results to include ranking information
    const results = candidates.map((candidate: any) => ({
      id: candidate.id,
      fullName: candidate.fullName,
      skills: candidate.skills,
      experience: candidate.experience,
      location: candidate.location,
      employmentType: candidate.employmentType,
      completionScore: candidate.completionScore,
      resumeUrl: candidate.resumeUrl,
      user: {
        id: candidate.user?.id || candidate.user_id,
        email: candidate.user?.email || candidate.email,
      },
      rank: candidate.rank || null, // FTS ranking score
      createdAt: candidate.createdAt,
    }));

    return NextResponse.json({
      candidates: results,
      pagination: {
        page,
        limit,
        hasMore: results.length === limit,
      },
      filters: filters,
    });
  } catch (error) {
    // console.error("Candidate search error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid search parameters", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to search candidates" },
      { status: 500 }
    );
  }
}
