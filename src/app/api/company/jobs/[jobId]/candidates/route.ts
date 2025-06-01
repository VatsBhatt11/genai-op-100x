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

    // Get the job to verify ownership
    const job = await prisma.job.findUnique({
      where: {
        id: params.jobId,
        companyId: session.user.id,
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Get all applications for this job with candidate details
    const applications = await prisma.application.findMany({
      where: {
        jobId: params.jobId,
      },
      include: {
        candidate: {
          include: {
            user: {
              include: {
                candidateProfile: true,
              },
            },
          },
        },
        messageLogs: {
          where: {
            channel: "PLATFORM",
            status: "DELIVERED",
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    // Get all outreach messages for this job's company
    const outreachMessages = await prisma.outreach.findMany({
      where: {
        senderId: session.user.id,
      },
      include: {
        receiver: {
          include: {
            candidateProfile: true,
          },
        },
        preScreening: true,
      },
    });

    // Create a map of applications by candidate ID
    const applicationMap = new Map(
      applications.map((app) => [app.candidateId, app])
    );

    // Create a map to store all candidates
    const candidateMap = new Map();

    // Add candidates from applications
    applications.forEach((app) => {
      candidateMap.set(app.candidateId, {
        id: app.candidateId,
        fullName: app.candidate.user.candidateProfile?.fullName || "Anonymous",
        skills: app.candidate.user.candidateProfile?.skills || [],
        experience:
          app.candidate.user.candidateProfile?.experience || "Not specified",
        location:
          app.candidate.user.candidateProfile?.location || "Not specified",
        hasApplied: true,
        status: app.status,
        matchScore: app.matchScore,
        feedbackSuggestions: app.feedbackSuggestions,
        lastMessage: app.messageLogs[0]?.content || null,
        lastMessageDate: app.messageLogs[0]?.createdAt || null,
      });
    });

    // Add candidates from outreach who haven't applied
    outreachMessages.forEach((outreach) => {
      if (!candidateMap.has(outreach.receiverId)) {
        candidateMap.set(outreach.receiverId, {
          id: outreach.receiverId,
          fullName:
            outreach.receiver?.candidateProfile?.fullName || "Anonymous",
          skills: outreach.receiver?.candidateProfile?.skills || [],
          experience:
            outreach.receiver?.candidateProfile?.experience || "Not specified",
          location:
            outreach.receiver?.candidateProfile?.location || "Not specified",
          hasApplied: false,
          status: "PENDING",
          matchScore: null,
          feedbackSuggestions: null,
          lastMessage: null,
          lastMessageDate: null,
          preScreeningId: outreach.preScreening?.id || null,
        });
      }
    });

    const candidates = Array.from(candidateMap.values());

    return NextResponse.json(candidates);
  } catch (error) {
    // console.error("Error fetching candidates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
