"use client"

import { useRouter } from "next/navigation"

export default function CompanyDashboardPage() {
  const router = useRouter()

  const metrics = [
    { label: "Active Job Postings", value: "12", change: "+2 this week", color: "blue" },
    { label: "Total Applications", value: "247", change: "+45 this week", color: "green" },
    { label: "Interviews Scheduled", value: "18", change: "+3 this week", color: "purple" },
    { label: "Hires This Month", value: "5", change: "+2 from last month", color: "orange" },
  ]

  const recentJobs = [
    { id: "1", title: "Senior Software Engineer", applications: 45, status: "Active", posted: "3 days ago" },
    { id: "2", title: "Product Manager", applications: 32, status: "Active", posted: "1 week ago" },
    { id: "3", title: "UX Designer", applications: 28, status: "Draft", posted: "Draft" },
    { id: "4", title: "Data Scientist", applications: 21, status: "Active", posted: "2 weeks ago" },
  ]

  const recentApplications = [
    { candidate: "John Smith", position: "Senior Software Engineer", status: "Interview", date: "Today" },
    { candidate: "Sarah Johnson", position: "Product Manager", status: "Review", date: "Yesterday" },
    { candidate: "Mike Chen", position: "Data Scientist", status: "Applied", date: "2 days ago" },
  ]

  return (
    <div className="company-dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">Company Dashboard</h1>
            <p className="dashboard-subtitle">Manage your hiring pipeline and track recruitment progress</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={() => router.push("/")}>
              Back to Home
            </button>
            <button className="btn-primary" onClick={() => console.log("Post new job")}>
              Post New Job
            </button>
          </div>
        </header>

        <div className="metrics-grid">
          {metrics.map((metric, index) => (
            <div key={index} className={`metric-card ${metric.color}`}>
              <div className="metric-value">{metric.value}</div>
              <div className="metric-label">{metric.label}</div>
              <div className="metric-change">{metric.change}</div>
            </div>
          ))}
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Job Postings</h2>
              <button className="btn-link" onClick={() => console.log("View all jobs")}>
                View All
              </button>
            </div>
            <div className="jobs-list">
              {recentJobs.map((job) => (
                <div key={job.id} className="job-item">
                  <div className="job-info">
                    <h3 className="job-title">{job.title}</h3>
                    <div className="job-meta">
                      <span className="job-apps">{job.applications} applications</span>
                      <span className="job-posted">Posted {job.posted}</span>
                    </div>
                  </div>
                  <div className="job-status">
                    <span className={`status-badge ${job.status.toLowerCase()}`}>{job.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Applications</h2>
              <button className="btn-link" onClick={() => console.log("View all applications")}>
                View All
              </button>
            </div>
            <div className="applications-list">
              {recentApplications.map((app, index) => (
                <div key={index} className="application-item">
                  <div className="candidate-info">
                    <div className="candidate-avatar">
                      {app.candidate
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="candidate-details">
                      <h4 className="candidate-name">{app.candidate}</h4>
                      <p className="candidate-position">{app.position}</p>
                    </div>
                  </div>
                  <div className="application-meta">
                    <span className={`status-badge ${app.status.toLowerCase()}`}>{app.status}</span>
                    <span className="application-date">{app.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-section quick-actions-section">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions">
              <button className="action-card" onClick={() => console.log("Search candidates")}>
                <div className="action-icon">👥</div>
                <div className="action-content">
                  <div className="action-title">Search Candidates</div>
                  <div className="action-desc">Find qualified professionals</div>
                </div>
              </button>
              <button className="action-card" onClick={() => console.log("Manage outreach")}>
                <div className="action-icon">📧</div>
                <div className="action-content">
                  <div className="action-title">Manage Outreach</div>
                  <div className="action-desc">Email templates & campaigns</div>
                </div>
              </button>
              <button className="action-card" onClick={() => console.log("View analytics")}>
                <div className="action-icon">📊</div>
                <div className="action-content">
                  <div className="action-title">View Analytics</div>
                  <div className="action-desc">Recruitment insights & reports</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .company-dashboard {
          min-height: 100vh;
          background: var(--bg-light);
          padding: var(--spacing-lg);
        }

        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-xl);
          background: var(--bg-card);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
        }

        .dashboard-title {
          font-size: var(--fs-2xl);
          font-weight: var(--fw-bold);
          color: var(--text-primary);
          margin-bottom: var(--spacing-sm);
        }

        .dashboard-subtitle {
          color: var(--text-secondary);
          font-size: var(--fs-lg);
        }

        .header-actions {
          display: flex;
          gap: var(--spacing-md);
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-md);
          font-weight: var(--fw-medium);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .btn-secondary {
          background: var(--bg-card);
          color: var(--color-primary);
          border: 1px solid var(--color-primary);
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-md);
          font-weight: var(--fw-medium);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: var(--color-primary);
          color: white;
        }

        .btn-link {
          background: none;
          border: none;
          color: var(--color-primary);
          font-weight: var(--fw-medium);
          cursor: pointer;
          text-decoration: none;
          font-size: var(--fs-sm);
        }

        .btn-link:hover {
          text-decoration: underline;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .metric-card {
          background: var(--bg-card);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          transition: transform 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .metric-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
        }

        .metric-card.blue::before {
          background: var(--color-primary);
        }

        .metric-card.green::before {
          background: #10b981;
        }

        .metric-card.purple::before {
          background: #8b5cf6;
        }

        .metric-card.orange::before {
          background: #f59e0b;
        }

        .metric-card:hover {
          transform: translateY(-4px);
        }

        .metric-value {
          font-size: var(--fs-2xl);
          font-weight: var(--fw-bold);
          color: var(--text-primary);
          margin-bottom: var(--spacing-sm);
        }

        .metric-label {
          font-weight: var(--fw-medium);
          color: var(--text-primary);
          margin-bottom: var(--spacing-sm);
        }

        .metric-change {
          font-size: var(--fs-sm);
          color: #10b981;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-lg);
        }

        .dashboard-section {
          background: var(--bg-card);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
        }

        .quick-actions-section {
          grid-column: 1 / -1;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid #e2e8f0;
        }

        .section-header h2 {
          font-size: var(--fs-lg);
          font-weight: var(--fw-bold);
          color: var(--text-primary);
        }

        .jobs-list,
        .applications-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .job-item,
        .application-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-md);
          background: var(--bg-light);
          border-radius: var(--radius-md);
          transition: background 0.3s ease;
        }

        .job-item:hover,
        .application-item:hover {
          background: #f1f5f9;
        }

        .job-title {
          font-weight: var(--fw-bold);
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .job-meta {
          display: flex;
          gap: var(--spacing-md);
        }

        .job-apps,
        .job-posted {
          font-size: var(--fs-sm);
          color: var(--text-secondary);
        }

        .candidate-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .candidate-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: var(--fw-bold);
          font-size: var(--fs-sm);
        }

        .candidate-name {
          font-weight: var(--fw-bold);
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .candidate-position {
          font-size: var(--fs-sm);
          color: var(--text-secondary);
        }

        .application-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .application-date {
          font-size: var(--fs-xs);
          color: var(--text-secondary);
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: var(--fs-xs);
          font-weight: var(--fw-medium);
          text-transform: uppercase;
        }

        .status-badge.active {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.draft {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.interview {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-badge.review {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.applied {
          background: #f1f5f9;
          color: #475569;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-md);
        }

        .action-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-lg);
          background: var(--bg-light);
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .action-card:hover {
          background: var(--bg-card);
          border-color: var(--color-primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .action-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .action-title {
          font-weight: var(--fw-bold);
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .action-desc {
          font-size: var(--fs-sm);
          color: var(--text-secondary);
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-md);
          }

          .header-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .company-dashboard {
            padding: var(--spacing-md);
          }

          .job-item,
          .application-item {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-sm);
          }

          .application-meta {
            align-items: flex-start;
            flex-direction: row;
            gap: var(--spacing-sm);
          }
        }
      `}</style>
    </div>
  )
}
