import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import JobsList from "./JobsList";
import { Session } from "next-auth";

export default async function JobsPage() {
  const session = (await getServerSession(authOptions)) as Session & {
    user: {
      id: string;
      role: string;
      candidateProfileId?: string;
    };
  };

  if (!session?.user) {
    redirect("/login");
  }

  const jobs = await prisma.job.findMany({
    where: {
      OR: [
        {
          applications: {
            some: {
              userId: session.user.id,
            },
          },
        },
        {
          outreach: {
            some: {
              receiverId: session.user.id,
            },
          },
        },
      ],
    },
    include: {
      company: {
        include: {
          companyProfile: true,
        },
      },
      preScreening: true,
      applications: {
        where: {
          candidateId: session.user.candidateProfileId,
        },
        include: {
          interviewReport: true,
        },
      },
      outreach: {
        where: {
          receiverId: session.user.id,
        },
      },
    },
  });

  const transformedJobs = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    description: job.description,
    location: job.location,
    employmentType: job.employmentType,
    company: {
      name: job.company.companyProfile?.name || "Unknown Company",
      logo: job.company.companyProfile?.logo || "/default-company-logo.png",
    },
    preScreening: job.preScreening ? { id: job.preScreening.id } : null,
    hasApplied: job.applications.length > 0,
    hasOutreach: job.outreach.length > 0,
    application: job.applications.length > 0 ? {
      id: job.applications[0].id,
      status: job.applications[0].status,
      interviewReport: job.applications[0].interviewReport || null,
      candidateId: job.applications[0].candidateId,
    } : null,
    hasInterviewReport: job.applications.length > 0 && job.applications[0].interviewReport !== null,
  }));

  return <JobsList jobs={transformedJobs} />;
}
