import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";

export async function POST(
  req: Request,
  { params }: { params: { outreachId: string } }
) {
  try {
    const session = (await getServerSession(authOptions)) as Session & {
      user: { id: string };
    };
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { answers } = await req.json();

    // Get the outreach and verify the user is the receiver
    const outreach = await prisma.outreach.findUnique({
      where: {
        id: params.outreachId,
      },
      include: {
        preScreening: true,
      },
    });

    if (!outreach) {
      return new NextResponse("Outreach not found", { status: 404 });
    }

    if (outreach.receiverId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!outreach.preScreening) {
      return new NextResponse("No pre-screening questions found", {
        status: 404,
      });
    }

    // Create submission
    const submission = await prisma.preScreeningSubmission.create({
      data: {
        preScreeningId: outreach.preScreening.id,
        candidateId: session.user.id,
        answers: answers,
      },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Error submitting pre-screening answers:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
