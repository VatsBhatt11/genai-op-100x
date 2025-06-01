import Link from "next/link"
import "../../styles/dashboard.css"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Session } from "next-auth";

export default async function DashboardPage() {
  const session = (await getServerSession(authOptions)) as Session & {
    user: {
      id: string;
      role: string;
    };
  };

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role === "COMPANY") {
    redirect("/company/dashboard");
  }

  // Get candidate profile
  const candidateProfile = await prisma.candidateProfile.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  // Get applications count
  const applications = await prisma.application.findMany({
    where: {
      candidateId: candidateProfile?.id,
    },
  });

  const totalApplied = applications.length;
  const inReview = applications.filter(app => app.status === "PENDING").length;

  // Get outreach count
  const outreachCount = await prisma.outreach.count({
    where: {
      receiverId: session.user.id,
    },
  });

  // Calculate profile completion rate
  const profileFields = [
    candidateProfile?.fullName,
    candidateProfile?.skills?.length,
    candidateProfile?.experience,
    candidateProfile?.location,
  ];
  const completedFields = profileFields.filter(Boolean).length;
  const completionRate = Math.round((completedFields / profileFields.length) * 100);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header animate-fade-in">
        <h1 className="dashboard-title">Welcome back, {candidateProfile?.fullName || 'User'}!</h1>
        <p className="dashboard-subtitle">Here's what's happening with your job search</p>
      </div>

      <div className="dashboard-grid animate-fade-in-up delay-200">
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Applications</h3>
          <div className="dashboard-stats">
            <div>
              <div className="dashboard-stat-number">{totalApplied}</div>
              <div className="dashboard-stat-label">Total Applied</div>
            </div>
            <div>
              <div className="dashboard-stat-number">{inReview}</div>
              <div className="dashboard-stat-label">In Review</div>
            </div>
          </div>
          <div className="dashboard-actions">
            <Link href="/jobs" className="btn btn-primary">
              Browse Jobs
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Profile</h3>
          <div className="dashboard-stats">
            <div>
              <div className="dashboard-stat-number">{completionRate}%</div>
              <div className="dashboard-stat-label">Complete</div>
            </div>
          </div>
          <div className="dashboard-actions">
            <Link href="/profile-edit" className="btn btn-secondary">
              Edit Profile
            </Link>
            <Link href="/upload-resume" className="btn btn-secondary">
              Upload Resume
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Recent Activity</h3>
          <div style={{ color: "var(--text-secondary)", fontSize: "var(--fs-sm)" }}>
            <p>• Received {outreachCount} outreach messages</p>
            <p>• Applied to {totalApplied} positions</p>
            <p>• {inReview} applications in review</p>
          </div>
        </div>
      </div>
    </div>
  )
}
