import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import InterviewAgent from "./InterviewAgent";
import { getServerSession } from "next-auth/next";

export default async function InterviewPage({
  params,
}: {
  params: { jobId: Promise<string> };
}) {
  const { jobId } = await params;
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
      preScreening: {
        select: {
          questions: true,
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
  });

  const preScreeningQuestions = job?.preScreening?.questions || [];

  // Fetch the applicationId for this job and candidate
  const candidateProfile = await prisma.candidateProfile.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!candidateProfile) {
    redirect("/jobs"); // Redirect if no candidate profile found
  }

  const application = await prisma.application.findFirst({
    where: {
      jobId: job.id,
      candidateId: candidateProfile?.id,
    },
    select: {
      id: true,
      status: true,
      interviewReport: {
        select: {
          score: true,
          summary: true,
          strengths: true,
          areasForImprovement: true,
        }
      },
    },
  });

console.log("Application:", application); // Print the application ID for debugging purposes

  // if (!application) {
  //   redirect(`/jobs/${job.id}`); // Redirect if no application found
  // }

  if (application?.status === "INTERVIEW_COMPLETED" && application?.interviewReport) {
    return (
      <div className="interview-report-container">
        <h2>Interview Report for {job.title}</h2>
        <div className="report-grid">
          <div className="report-grid-row-full">
            <div className="report-section">
              <h3>Score: {application.interviewReport.score}/100</h3>
            </div>
          </div>
          <div className="report-grid-row-half">
            <div className="report-section">
              <h3>Strengths:</h3>
              <ul>
                {application.interviewReport.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            <div className="report-section">
              <h3>Areas for Improvement:</h3>
              <ul>
                {application.interviewReport.areasForImprovement.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="report-grid-row-full">
          <div className="report-section">
              <h3>Summary:</h3>
              <p>{application.interviewReport.summary}</p>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <InterviewAgent
        job={job}
        preScreeningQuestions={preScreeningQuestions}
        candidateId={session.user.id}
        applicationId={application?.id}
        outreach={outreach}
      />
    );
  }
}