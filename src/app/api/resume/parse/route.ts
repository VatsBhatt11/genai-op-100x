import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { ResumeParser } from "@/src/lib/resumeParser";
import { getServerSession } from "next-auth/next";

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
        parsedProfile: parsedResume,
        rawResumeText: parsedResume.text,
        resumeText: parsedResume.text,
        resumeUrl: resumeUrl,
        skills: parsedResume.skills,
        experience: parsedResume.experience,
        education: parsedResume.education,
        workHistory: parsedResume.workHistory,
        certifications: parsedResume.certifications,
        languages: parsedResume.languages,
        completionScore: calculateCompletionScore(parsedResume),
      },
    });

    return NextResponse.json(
      { message: "Resume parsed successfully" },
      { status: 200 }
    );
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
