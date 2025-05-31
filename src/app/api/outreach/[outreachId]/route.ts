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
        sender: {
          include: {
            CompanyProfile: true,
          },
        },
        receiver: {
          include: {
            candidateProfile: true,
          },
        },
      },
    });

    if (!outreach) {
      return new NextResponse("Outreach not found", { status: 404 });
    }

    // Check if the user is either the sender or receiver
    if (
      outreach.senderId !== session.user.id &&
      outreach.receiverId !== session.user.id
    ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.json(outreach);
  } catch (error) {
    console.error("Error fetching outreach:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
