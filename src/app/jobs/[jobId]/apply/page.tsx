import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ApplyForm from "./ApplyForm";
import { Session } from "next-auth";

export default async function ApplyPage({
  params,
}: {
  params: { jobId: string };
}) {
  const session = (await getServerSession(authOptions)) as Session & {
    user: {
      id: string;
      role: string;
    };
  };

  if (!session?.user || session.user.role !== "CANDIDATE") {
    redirect("/login");
  }

  // Get job details
  const { jobId } = await params;
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
    include: {
      company: {
        include: {
          companyProfile: true,
        },
      },
    },
  });

  if (!job) {
    redirect("/jobs");
  }

  // Get outreach for this job with pre-screening questions
  const outreach = await prisma.outreach.findFirst({
    where: {
      senderId: job.companyId,
      receiverId: session.user.id,
    },
    include: {
      preScreening: {
        select: {
          questions: true,
        },
      },
    },
  });

  // If there's no outreach, create a default one with empty pre-screening
  const defaultOutreach = {
    id: "default",
    createdAt: new Date(),
    updatedAt: new Date(),
    senderId: job.companyId,
    receiverId: session.user.id,
    message: "",
    preScreeningId: null,
    preScreening: {
      questions: [],
    },
  };

  return (
    <ApplyForm 
      job={job} 
      outreach={outreach || defaultOutreach}
      companyName={job.company.companyProfile?.name || "Unknown Company"}
    />
  );
}