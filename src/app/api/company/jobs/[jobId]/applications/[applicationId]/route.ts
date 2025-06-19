import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { jobId: string; applicationId: string } }
) {
  try {
    const { jobId, applicationId } = params;

    if (!jobId || !applicationId) {
      return NextResponse.json(
        { error: "Missing jobId or applicationId" },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
        jobId: jobId,
      },
      include: {
        interviewReport: true, // Include the interview report if it exists
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error fetching application details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}