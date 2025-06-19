import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { CandidateProfile, User } from "@prisma/client";
import { Session } from "next-auth";
import { generateJobFromQuery } from "@/lib/groq";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const outreachSchema = z.object({
  subject: z.string().min(1),
  message: z.string().min(1),
  query: z.string().min(1),
  jobId: z.string().optional(), // Add jobId as an optional string
  candidateId: z.string(), // Add candidateId as a required string
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
    const { subject, message, query, jobId, candidateId } = outreachSchema.parse(body);

    const candidate = await prisma.candidateProfile.findUnique({
      where: { id: candidateId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        }
      },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 400 }
      );
    }

    let finalJobId: string | null = null;

    if (jobId) {
      // If jobId is provided, use the existing job
      finalJobId = jobId;
    } else {
      // If no jobId, generate job data and create a new job
      const jobData = await generateJobFromQuery(query);
      const newJob = await prisma.job.create({
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
      finalJobId = newJob.id;
    }

    // Create notification for the candidate
    // The 'candidate' variable is already defined above as a single object
    // No need to map over 'candidates' array anymore
    // The rest of the logic inside this block will now apply to the single 'candidate' object
    let application = await prisma.application.findUnique({
      where: {
        jobId_candidateId: {
          jobId: finalJobId,
          candidateId: candidate.id,
        },
      },
    });

    if (!application) {
      try {
        application = await prisma.application.create({
          data: {
            job: finalJobId ? { connect: { id: finalJobId } } : undefined,
            candidate: { connect: { id: candidate.id } },
            user: { connect: { id: session.user.id } },
            status: "PENDING",
          },
        });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
          // Handle unique constraint violation if an application already exists
          // This might happen if findUnique above didn't catch it due to a race condition
          application = await prisma.application.findUnique({
            where: {
              jobId_candidateId: {
                jobId: finalJobId,
                candidateId: candidate.id,
              },
            },
          });
          if (!application) {
            return NextResponse.json({ error: "Failed to create application due to unexpected unique constraint" }, { status: 500 });
          }
        } else {
          console.error("Error creating application:", error);
          return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
        }
      }
    }

    // Create outreach record
    const outreach = await prisma.outreach.create({
      data: {
        sender: {
          connect: { id: session.user.id },
        },
        receiver: {
          connect: { id: candidate.user.id },
        },
        message,
        job: finalJobId ? { connect: { id: finalJobId } } : undefined,
        application: { connect: { id: application.id } }, // Link to application
      },
    });

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        senderId: session.user.id,
        receiverId: candidate.user.id,
        title: "New Job Opportunity",
        content: message,
        outreachId: outreach.id,
        metadata: {
          candidateId: candidate.id,
          outreachId: outreach.id,
          jobId: finalJobId,
          applicationId: application.id, // Include applicationId in metadata
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

    return NextResponse.json({
      success: true,
      sentCount: 1,
      notifications: [notification],
      jobId: finalJobId,
    });
  } catch (error) {
    console.error("Send outreach error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
