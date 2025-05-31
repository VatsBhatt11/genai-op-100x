import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { z } from "zod";

const outreachSchema = z.object({
  candidateIds: z.array(z.string()).min(1),
  subject: z.string().min(1),
  message: z.string().min(1),
  templateId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { candidateIds, subject, message, templateId } =
      outreachSchema.parse(body);

    // Get candidate profiles
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

    // Create notifications for each candidate
    const notifications = await Promise.all(
      candidates.map(async (candidate) => {
        // Create notification
        const notification = await prisma.notification.create({
          data: {
            senderId: session.user.id,
            receiverId: candidate.user.id,
            type: "MESSAGE",
            title: subject,
            content: message,
            metadata: {
              templateId,
              candidateId: candidate.id,
            },
          },
        });

        // Create message log
        await prisma.messageLog.create({
          data: {
            senderId: session.user.id,
            receiverId: candidate.user.id,
            channel: "PLATFORM",
            content: `${subject}\n\n${message}`,
            status: "SENT",
            sentAt: new Date(),
          },
        });

        return notification;
      })
    );

    return NextResponse.json({
      success: true,
      sentCount: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Send outreach error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
