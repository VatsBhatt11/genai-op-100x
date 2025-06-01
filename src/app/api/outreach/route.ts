import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MessageChannel, NotificationType } from "@prisma/client";
import { Session } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session & {
      user: { id: string };
    };
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { profileIds, message } = await req.json();

    if (!Array.isArray(profileIds) || profileIds.length === 0 || !message) {
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

    // Create notifications and send WhatsApp messages for each candidate
    const notifications = await Promise.all(
      profileIds.map(async (profileId) => {
        const candidateProfile = await prisma.candidateProfile.findUnique({
          where: { id: profileId },
          include: { user: true },
        });

        if (!candidateProfile) return null;

        // Create outreach record first
        const outreach = await prisma.outreach.create({
          data: {
            senderId: session.user.id,
            receiverId: candidateProfile.userId,
            message: message,
          },
        });

        // Create in-app notification with outreachId
        const notification = await prisma.notification.create({
          data: {
            senderId: session.user.id,
            receiverId: candidateProfile.userId,
            type: NotificationType.MESSAGE,
            title: "New Job Opportunity",
            content: message,
            outreachId: outreach.id, // Link to the outreach record
            metadata: {
              companyId: companyProfile.id,
              companyName: companyProfile.name,
              profileId: profileId,
              outreachId: outreach.id, // Also store in metadata for redundancy
            },
          },
        });

        // Send WhatsApp message if phone number exists
        if (candidateProfile.phoneNumber) {
          await prisma.messageLog.create({
            data: {
              senderId: session.user.id,
              receiverId: candidateProfile.userId,
              channel: MessageChannel.WHATSAPP,
              content: `You have a new job opportunity from ${companyProfile.name}. Please check your notifications on our platform.`,
              status: "PENDING",
            },
          });
        }

        return notification;
      })
    );

    // Filter out any null notifications (from invalid profile IDs)
    const validNotifications = notifications.filter((n) => n !== null);

    return NextResponse.json({
      success: true,
      notificationsSent: validNotifications.length,
    });
  } catch (error) {
    // console.error("Outreach error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
