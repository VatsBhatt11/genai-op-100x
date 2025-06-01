import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";
import { generatePreScreeningQuestions } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session & {
      user: {
        id: string;
        role: string;
      };
    };

    if (!session?.user || session.user.role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { jobId, jobTitle, jobDescription, skills } = body;

    // Generate questions using Groq
    const questions = await generatePreScreeningQuestions({
      jobTitle,
      jobDescription,
      skills,
    });

    // Save questions to database
    const savedPreScreening = await prisma.preScreening.create({
      data: {
        companyId: session.user.id,
        questions: questions.map((qa) => qa.question),
      },
    });

    // Transform the saved questions to match the expected format
    const transformedQuestions = savedPreScreening.questions.map(
      (question, index) => ({
        id: `${savedPreScreening.id}-${index}`,
        question,
        answer: "", // We don't store answers in the database
      })
    );

    return NextResponse.json({ questions: transformedQuestions });
  } catch (error) {
    // console.error("Error generating pre-screening questions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
