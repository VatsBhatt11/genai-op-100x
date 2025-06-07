import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import { prisma } from "@/lib/prisma";
import UploadResumeClient from "./UploadResumeClient";

export default async function UploadResumePage() {
  const session = (await getServerSession(authOptions)) as Session & {
    user: {
      id: string;
      role: string;
    };
  };

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      candidateProfile: true,
    },
  });

  return <UploadResumeClient user={user} />;
}
