import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PreScreeningClient from "./PreScreeningClient";
import { Session } from "next-auth";

export default async function PreScreeningPage({
  params,
}: {
  params: { id: string };
}) {
  const session = (await getServerSession(authOptions)) as Session & {
    user: { id: string };
  };
  if (!session?.user) {
    redirect("/login");
  }

  const preScreening = await prisma.preScreening.findUnique({
    where: { id: params.id },
    include: {
      company: {
        include: {
          CompanyProfile: true,
        },
      },
    },
  });

  if (!preScreening) {
    redirect("/candidate/job-updates");
  }

  // Transform the data to match the client component's expected structure
  const transformedPreScreening = {
    id: preScreening.id,
    questions: preScreening.questions,
    company: {
      companyProfile: preScreening.company.CompanyProfile ? {
        name: preScreening.company.CompanyProfile.name,
        logo: preScreening.company.CompanyProfile.logo || "/default-company.png",
      } : undefined,
    },
  };

  return <PreScreeningClient preScreening={transformedPreScreening} />;
} 