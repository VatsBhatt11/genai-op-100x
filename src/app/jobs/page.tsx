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
    };
  };

  if (!session?.user) {
    redirect("/login");
  }

  // Get jobs where the candidate has received outreach
  const outreach = await prisma.outreach.findMany({
    where: {
      receiverId: session.user.id,
    },
    include: {
      sender: {
        include: {
          companyProfile: true,
          jobs: true,
        },
      },
      preScreening: true,
    },
  });

  // Transform and deduplicate the data
  const jobMap = new Map();
  
  outreach.forEach(outreach => {
    outreach.sender.jobs.forEach(job => {
      if (!jobMap.has(job.id)) {
        jobMap.set(job.id, {
          id: job.id,
          title: job.title,
          description: job.description,
          location: job.location,
          employmentType: job.employmentType,
          company: {
            name: outreach.sender.companyProfile?.name || "Unknown Company",
            logo: outreach.sender.companyProfile?.logo || "/default-company-logo.png",
          },
          outreach: [{
            id: outreach.id,
            preScreening: outreach.preScreening ? { id: outreach.preScreening.id } : null,
          }],
        });
      }
    });
  });

  const transformedJobs = Array.from(jobMap.values());

  return <JobsList jobs={transformedJobs} />;
}
