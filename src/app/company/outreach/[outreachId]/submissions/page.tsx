import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import { ArrowLeft, User, Calendar } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

export default async function SubmissionsPage({
  params,
}: {
  params: { outreachId: string };
}) {
  const session = (await getServerSession(authOptions)) as Session & {
    user: { id: string };
  };
  if (!session?.user) {
    redirect("/login");
  }

  const outreach = await prisma.outreach.findUnique({
    where: {
      id: params.outreachId,
    },
    include: {
      preScreening: {
        include: {
          submissions: {
            include: {
              candidate: {
                include: {
                  candidateProfile: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!outreach) {
    redirect("/company/dashboard");
  }

  // Check if the user is the sender
  if (outreach.senderId !== session.user.id) {
    redirect("/company/dashboard");
  }

  return (
    <div className={styles.container}>
      <Link href="/company/dashboard">
        <button className={styles.backButton}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
      </Link>

      <div className={styles.header}>
        <h1 className={styles.title}>Pre-screening Submissions</h1>
        <p className={styles.description}>
          View responses from candidates who completed the pre-screening questions.
        </p>
      </div>

      <div className={styles.submissionsList}>
        {outreach.preScreening?.submissions.map((submission) => (
          <div key={submission.id} className={styles.submissionCard}>
            <div className={styles.submissionHeader}>
              <div className={styles.candidateInfo}>
                <User size={20} />
                <span>{submission.candidate.candidateProfile?.fullName || "Anonymous"}</span>
              </div>
              <div className={styles.submissionDate}>
                <Calendar size={16} />
                <span>
                  {new Date(submission.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className={styles.answersList}>
              {Array.isArray(submission.answers) && submission.answers.map((answer, idx) => {
                const question = outreach.preScreening?.questions[idx];
                return (
                  <div key={idx} className={styles.answerContainer}>
                    <h3 className={styles.questionText}>{question}</h3>
                    <p className={styles.answerText}>{answer}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {outreach.preScreening?.submissions.length === 0 && (
          <div className={styles.noSubmissions}>
            No submissions yet. Candidates will appear here once they complete the pre-screening questions.
          </div>
        )}
      </div>
    </div>
  );
} 