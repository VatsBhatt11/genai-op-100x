import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";

export async function GET(
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

    const outreach = await prisma.outreach.findUnique({
      where: {
        id: params.outreachId,
      },
      include: {
        preScreening: {
          include: {
            submissions: {
              where: {
                candidateId: session.user.id,
              },
            },
          },
        },
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

    return NextResponse.json({
      id: outreach.preScreening.id,
      questions: outreach.preScreening.questions,
      hasSubmitted: outreach.preScreening.submissions.length > 0,
    });
  } catch (error) {
    console.error("Error fetching pre-screening questions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
