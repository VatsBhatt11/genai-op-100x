import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";

export async function POST(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session & {
      user: {
        id: string;
        role: string;
      };
    };

    if (!session?.user || session.user.role !== "CANDIDATE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId, outreachId, answers } = await request.json();

    // Verify the outreach belongs to the candidate
    const outreach = await prisma.outreach.findFirst({
      where: {
        id: outreachId,
        receiverId: session.user.id,
      },
      include: {
        preScreening: true,
      },
    });

    if (!outreach) {
      return NextResponse.json(
        { error: "Outreach not found" },
        { status: 404 }
      );
    }

    if (!outreach.preScreening) {
      return NextResponse.json(
        { error: "No pre-screening questions found" },
        { status: 404 }
      );
    }

    // Create pre-screening submission
    const submission = await prisma.preScreeningSubmission.create({
      data: {
        preScreeningId: outreach.preScreening.id,
        candidateId: session.user.id,
        answers: Object.values(answers),
      },
    });

    return NextResponse.json(submission);
  } catch (error) {
    // console.error("Error submitting pre-screening:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
