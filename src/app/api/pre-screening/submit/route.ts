import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session & {
      user: { id: string };
    };
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { preScreeningId, answers } = await req.json();

    if (!preScreeningId || !Array.isArray(answers)) {
      return new NextResponse("Invalid request", { status: 400 });
    }

    // Create pre-screening submission
    const submission = await prisma.preScreeningSubmission.create({
      data: {
        preScreeningId,
        candidateId: session.user.id,
        answers,
      },
    });

    return NextResponse.json({
      success: true,
      submission,
    });
  } catch (error) {
    console.error("Pre-screening submission error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
