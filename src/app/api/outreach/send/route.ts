import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { CandidateProfile, User } from "@prisma/client";
import { Session } from "next-auth";
import { generateJobFromQuery } from "@/lib/groq";

const outreachSchema = z.object({
  candidateIds: z.array(z.string()),
  message: z.string().min(1),
  query: z.string().min(1), // The natural language query used for search
});

export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session & {
      user: {
        id: string;
        role: string;
      };
    };

    if (!session?.user || session.user.role !== "COMPANY") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { candidateIds, message, query } = outreachSchema.parse(body);

    const candidates = await prisma.candidateProfile.findMany({
      where: {
        id: { in: candidateIds },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (candidates.length === 0) {
      return NextResponse.json(
        { error: "No valid candidates found" },
        { status: 400 }
      );
    }

    // Generate job data from the search query
    const jobData = await generateJobFromQuery(query);

    // Create the job posting with only valid fields
    const job = await prisma.job.create({
      data: {
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        experience: jobData.experience,
        employmentType: jobData.employmentType,
        isRemote: jobData.isRemote,
        skills: jobData.skills,
        companyId: session.user.id,
        status: "ACTIVE",
      },
    });

    // Create notifications for each candidate
    const notifications = await Promise.all(
      candidates.map(
        async (
          candidate: CandidateProfile & { user: Pick<User, "id" | "email"> }
        ) => {
          // Create outreach record first
          const outreach = await prisma.outreach.create({
            data: {
              senderId: session.user.id,
              receiverId: candidate.user.id,
              message,
            },
          });

          // Create notification
          const notification = await prisma.notification.create({
            data: {
              senderId: session.user.id,
              receiverId: candidate.user.id,
              type: "MESSAGE",
              title: "New Job Opportunity",
              content: message,
              outreachId: outreach.id,
              metadata: {
                candidateId: candidate.id,
                outreachId: outreach.id,
                jobId: job.id,
              },
            },
          });

          // Create message log
          await prisma.messageLog.create({
            data: {
              senderId: session.user.id,
              receiverId: candidate.user.id,
              channel: "PLATFORM",
              content: message,
              status: "SENT",
              sentAt: new Date(),
            },
          });

          return notification;
        }
      )
    );

    return NextResponse.json({
      success: true,
      sentCount: notifications.length,
      notifications,
      jobId: job.id,
    });
  } catch (error) {
    // console.error("Send outreach error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
