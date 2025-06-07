import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import NotificationsClient from "./NotificationsClient";

export default async function NotificationsPage() {
  const session = (await getServerSession(authOptions)) as Session & {
    user: {
      id: string;
      role: string;
    };
  };

  if (!session?.user) {
    redirect("/login");
  }

  const notifications = await prisma.notification.findMany({
    where: {
      receiverId: session.user.id,
    },
    include: {
      sender: {
        include: {
          companyProfile: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <NotificationsClient notifications={notifications} />;
}
