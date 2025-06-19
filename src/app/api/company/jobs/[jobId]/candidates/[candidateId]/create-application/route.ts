import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  context: { params: { jobId: string; candidateId: string } }
) {
  try {
    const params = context.params;
    const session = (await getServerSession(authOptions)) as Session & {
      user: {
        id: string;
        role: string;
      };
    };

    if (!session?.user || session.user.role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify job ownership
    const job = await prisma.job.findUnique({
      where: {
        id: params.jobId,
        companyId: session.user.id,
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Verify candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: {
        id: params.candidateId,
      },
    });

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    // Check if an application already exists for this job and candidate
    let application = await prisma.application.findFirst({
      where: {
        jobId: params.jobId,
        candidateId: params.candidateId,
      },
    });

    if (!application) {
      // Create a new application if one doesn't exist
      application = await prisma.application.create({
        data: {
          jobId: params.jobId,
          candidateId: params.candidateId,
          status: "REVIEWED", // Default status for newly created applications for report generation
          appliedDate: new Date(),
        },
      });
    }

    return NextResponse.json({ applicationId: application.id });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}