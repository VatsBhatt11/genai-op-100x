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

    const { questions } = await req.json();

    if (!Array.isArray(questions) || questions.length === 0) {
      return new NextResponse("Invalid request", { status: 400 });
    }

    // Get company profile
    const companyProfile = await prisma.companyProfile.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!companyProfile) {
      return new NextResponse("Company profile not found", { status: 404 });
    }

    // Save pre-screening questions
    const preScreening = await prisma.preScreening.create({
      data: {
        companyId: session.user.id,
        questions: questions,
      },
    });

    return NextResponse.json({
      success: true,
      preScreening,
    });
  } catch (error) {
    console.error("Pre-screening error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
