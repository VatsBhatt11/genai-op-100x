import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";

export async function GET(
  request: Request,
  context: { params: { jobId: string } }
) {
  try {
    const params = await context.params;
    const session = (await getServerSession(authOptions)) as Session & {
      user: {
        id: string;
        role: string;
      };
    };

    if (!session?.user || session.user.role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const job = await prisma.job.findUnique({
      where: {
        id: params.jobId,
        companyId: session.user.id,
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Fetch pre-screening questions for this job
    const preScreening = await prisma.preScreening.findFirst({
      where: {
        companyId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data to match the expected format
    const transformedJob = {
      ...job,
      preScreeningQuestions:
        preScreening?.questions.map((question, index) => ({
          id: `${preScreening.id}-${index}`,
          question,
          answer: "", // We don't store answers in the database
        })) || [],
    };

    return NextResponse.json(transformedJob);
  } catch (error) {
    // console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { jobId: string } }
) {
  try {
    const params = await context.params;
    const session = (await getServerSession(authOptions)) as Session & {
      user: {
        id: string;
        role: string;
      };
    };

    if (!session?.user || session.user.role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete the job
    await prisma.job.delete({
      where: {
        id: params.jobId,
        companyId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // console.error("Error deleting job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
