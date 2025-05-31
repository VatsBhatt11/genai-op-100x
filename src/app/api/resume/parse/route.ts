import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ResumeParser } from "@/lib/resumeParser";
import { getServerSession } from "next-auth";
import { initResumeCollection, processResume } from "@/lib/document-processor";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { resumeUrl } = await req.json();
    if (!resumeUrl) {
      return NextResponse.json(
        { message: "Resume URL is required" },
        { status: 400 }
      );
    }

    // Get user and their candidate profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { candidateProfile: true },
    });

    if (!user || !user.candidateProfile) {
      return NextResponse.json(
        { message: "User or candidate profile not found" },
        { status: 404 }
      );
    }

    // Parse resume
    const parser = new ResumeParser();
    const parsedResume = await parser.parseResumeFromUrl(resumeUrl);

    // Update candidate profile with parsed data
    await prisma.candidateProfile.update({
      where: { userId: user.id },
      data: {
        fullName: parsedResume.name,
        parsedProfile: parsedResume as any, // Type assertion for JSON field
        rawResumeText: parsedResume.text,
        resumeText: parsedResume.text,
        resumeUrl: resumeUrl,
        skills: parsedResume.skills,
        experience: parsedResume.experience,
        education: parsedResume.education as any, // Type assertion for JSON field
        workHistory: parsedResume.workHistory as any, // Type assertion for JSON field
        certifications: parsedResume.certifications.map((cert) => cert.name), // Convert to string array
        languages: parsedResume.languages,
        completionScore: calculateCompletionScore(parsedResume),
      },
    });

    // Initialize Qdrant collection and store resume chunks
    try {
      console.log("Initializing Qdrant collection...");
      await initResumeCollection();
      console.log("Qdrant collection initialized successfully");

      // Download the PDF file
      const response = await axios.get(resumeUrl, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(response.data);

      // Process resume and store chunks in Qdrant
      console.log("Processing resume for vector storage...");
      const processResult = await processResume(
        buffer,
        user.candidateProfile.id,
        resumeUrl.split("/").pop() || "resume.pdf"
      );
      console.log("Resume chunks stored in Qdrant:", processResult);

      return NextResponse.json(
        {
          message: "Resume parsed and processed successfully",
          chunksCount: processResult.chunksCount,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error processing resume for vector storage:", error);
      // Still return success for parsing, but include error message for vector storage
      return NextResponse.json(
        {
          message:
            "Resume parsed successfully but failed to process for vector storage",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Resume parsing error:", error);
    return NextResponse.json(
      { message: "Failed to parse resume" },
      { status: 500 }
    );
  }
}

function calculateCompletionScore(parsedResume: any): number {
  let score = 0;
  const totalFields = 8; // Total number of fields we check

  if (parsedResume.name) score++;
  if (parsedResume.skills?.length > 0) score++;
  if (parsedResume.experience) score++;
  if (parsedResume.education) score++;
  if (parsedResume.workHistory?.length > 0) score++;
  if (parsedResume.certifications?.length > 0) score++;
  if (parsedResume.languages?.length > 0) score++;
  if (parsedResume.text) score++;

  return (score / totalFields) * 100;
}
