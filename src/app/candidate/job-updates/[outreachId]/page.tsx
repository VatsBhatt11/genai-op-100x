import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import { MessageSquare, ArrowLeft, ClipboardList } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

export default async function OutreachPage({
  params,
}: {
  params: { outreachId: string };
}) {
  const session = (await getServerSession(authOptions)) as Session & {
    user: { id: string };
  };
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const outreach = await prisma.outreach.findUnique({
    where: {
      id: params.outreachId,
    },
    include: {
      sender: {
        include: {
          CompanyProfile: true,
        },
      },
      receiver: {
        include: {
          candidateProfile: true,
        },
      },
      preScreening: {
        include: {
          submissions: {
            where: {
              candidateId: session.user.id,
            },
          },
        },
      },
    },
  });

  if (!outreach) {
    redirect("/dashboard");
  }

  // Check if the user is the receiver
  if (outreach.receiverId !== session.user.id) {
    redirect("/dashboard");
  }

  const hasPreScreening = Boolean(outreach.preScreening?.questions?.length);
  const hasSubmitted = Boolean(outreach.preScreening?.submissions?.length);

  return (
    <div className={styles.container}>
      <Link href="/dashboard">
        <button className={styles.backButton}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
      </Link>

      <div className={styles.messageCard}>
        <div className={styles.messageHeader}>
          <div className={styles.iconContainer}>
            <MessageSquare />
          </div>
          <div className={styles.messageContent}>
            <h1 className={styles.title}>
              Message from {outreach.sender.CompanyProfile?.name || "Company"}
            </h1>
            <div className={styles.date}>
              {new Date(outreach.createdAt).toLocaleDateString()}
            </div>
            <div className={styles.message}>
              {outreach.message}
            </div>
            
            {hasPreScreening && !hasSubmitted && (
              <Link 
                href={`/candidate/job-updates/${params.outreachId}/pre-screening`}
                className={styles.preScreeningButton}
              >
                <ClipboardList size={20} />
                Complete Pre-screening Questions
              </Link>
            )}
            
            {hasSubmitted && (
              <div className={styles.submittedBadge}>
                Pre-screening completed ✓
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 