import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { searchResumeContent } from "@/lib/document-processor";
import { prisma } from "@/lib/prisma";

// Minimum similarity threshold (0.3 = 30% similarity)
const MIN_SIMILARITY_THRESHOLD = 0.3;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { query } = await req.json();

    // Search resume content using semantic search
    const resumeResults = await searchResumeContent(query);

    // Filter out results below the similarity threshold
    const relevantResults = resumeResults.filter(
      (result) => result.score >= MIN_SIMILARITY_THRESHOLD
    );

    if (relevantResults.length === 0) {
      return NextResponse.json([]);
    }

    // Get user information for each candidate
    const candidateIds = relevantResults.map((result) => result.candidateId);
    const candidateProfiles = await prisma.candidateProfile.findMany({
      where: {
        id: {
          in: candidateIds,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    // Create a map of candidate profiles for easy lookup
    const profileMap = new Map(
      candidateProfiles.map((profile) => [profile.id, profile])
    );

    // Transform results to include all necessary information
    const results = relevantResults.map((result) => {
      const profile = profileMap.get(result.candidateId);
      return {
        profile: {
          id: result.candidateId,
          fullName: result.parsedData.name,
          skills: result.parsedData.skills,
          experience: result.parsedData.experience,
          location: result.parsedData.location,
          education: result.parsedData.education,
          certifications: result.parsedData.certifications,
          contact: result.parsedData.contact,
          user: profile?.user || { email: result.parsedData.contact.email },
        },
        matchScore: Math.round(result.score * 100), // Convert similarity score to percentage
        matchDetails: {
          matchingSkills: result.parsedData.skills,
          locationMatch: true,
          experienceMatch: true,
          employmentTypeMatch: true,
          vectorSimilarity: result.score,
          resumeContent: [
            {
              content: result.content,
              score: result.score,
            },
          ],
        },
      };
    });

    // Sort by match score
    results.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json(results);
  } catch (error) {
    // console.error("Search error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
