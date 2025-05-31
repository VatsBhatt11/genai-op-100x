import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import NotificationsClient from "./NotificationsClient";

interface NotificationMetadata {
  templateId?: string;
  candidateId?: string;
  outreachId?: string;
}

export default async function NotificationsPage() {
  const session = (await getServerSession(authOptions)) as Session & {
    user: { id: string };
  };
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const notifications = await prisma.notification.findMany({
    where: {
      receiverId: session.user.id,
    },
    include: {
      sender: {
        include: {
          CompanyProfile: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform the data to match the client component's expected structure
  const transformedNotifications = notifications.map(notification => ({
    id: notification.id,
    title: notification.title,
    content: notification.content,
    type: notification.type,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
    outreachId: notification.outreachId || (notification.metadata as NotificationMetadata)?.outreachId,
    sender: {
      companyProfile: notification.sender.CompanyProfile ? {
        name: notification.sender.CompanyProfile.name,
        logo: notification.sender.CompanyProfile.logo || "/default-company.png",
      } : undefined,
    },
  }));

  return <NotificationsClient notifications={transformedNotifications} />;
}
