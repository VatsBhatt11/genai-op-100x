import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import JobUpdatesClient from "./JobUpdatesClient";
import { Session } from "next-auth";

export default async function JobUpdatesPage() {
  const session = (await getServerSession(authOptions)) as Session & {
    user: { id: string };
  };
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const outreachMessages = await prisma.outreach.findMany({
    where: {
      receiverId: session.user.id,
    },
    include: {
      sender: {
        include: {
          CompanyProfile: true,
        },
      },
      preScreening: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform the data to match the client component's expected structure
  const transformedMessages = outreachMessages.map(message => ({
    id: message.id,
    message: message.message,
    createdAt: message.createdAt,
    sender: {
      companyProfile: message.sender.CompanyProfile ? {
        name: message.sender.CompanyProfile.name,
        logo: message.sender.CompanyProfile.logo || "/default-company.png",
        location: message.sender.CompanyProfile.location || "",
      } : undefined,
    },
    preScreening: message.preScreening ? {
      id: message.preScreening.id,
    } : undefined,
  }));

  return <JobUpdatesClient outreachMessages={transformedMessages} />;
} 