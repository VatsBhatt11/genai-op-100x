import Link from "next/link"
import "../../styles/dashboard.css"

export default function DashboardPage() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header animate-fade-in">
        <h1 className="dashboard-title">Welcome back, John!</h1>
        <p className="dashboard-subtitle">Here's what's happening with your job search</p>
      </div>

      <div className="dashboard-grid animate-fade-in-up delay-200">
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Applications</h3>
          <div className="dashboard-stats">
            <div>
              <div className="dashboard-stat-number">12</div>
              <div className="dashboard-stat-label">Total Applied</div>
            </div>
            <div>
              <div className="dashboard-stat-number">3</div>
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
              <div className="dashboard-stat-number">85%</div>
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
            <p>• Applied to Software Engineer at TechCorp</p>
            <p>• Updated profile skills</p>
            <p>• Viewed 5 new job postings</p>
          </div>
        </div>
      </div>
    </div>
  )
}
