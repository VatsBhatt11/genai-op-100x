"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CompanySearch } from "@/components/CompanySearch"

interface Job {
  id: string
  title: string
  applications: number
  status: string
  location: string
  createdAt: string
}

export default function CompanyDashboardPage() {
  const router = useRouter()
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  const metrics = [
    { label: "Active Job Postings", value: "12", change: "+2 this week", color: "blue" },
    { label: "Total Applications", value: "247", change: "+45 this week", color: "green" },
    { label: "Interviews Scheduled", value: "18", change: "+3 this week", color: "purple" },
    { label: "Hires This Month", value: "5", change: "+2 from last month", color: "orange" },
  ]

  const recentApplications = [
    { candidate: "John Smith", position: "Senior Software Engineer", status: "Interview", date: "Today" },
    { candidate: "Sarah Johnson", position: "Product Manager", status: "Review", date: "Yesterday" },
    { candidate: "Mike Chen", position: "Data Scientist", status: "Applied", date: "2 days ago" },
  ]

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const response = await fetch("/api/jobs")
        const data = await response.json()
        setRecentJobs(data)
      } catch (error) {
        // console.error("Error fetching recent jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentJobs()
  }, [])

  return (
    <div className="company-dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">Company Dashboard</h1>
            <p className="dashboard-subtitle">Manage your hiring pipeline and track recruitment progress</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={() => router.push("/company/jobs")}>
              View Job Postings
            </button>
          </div>
        </header>
        
        <CompanySearch />
        
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
              <button className="btn-link" onClick={() => router.push("/company/jobs")}>
                View All
              </button>
            </div>
            {loading ? (
              <div className="loading">Loading recent jobs...</div>
            ) : (
              <div className="jobs-list">
                {recentJobs?.map((job) => (
                  <div key={job.id} className="job-item">
                    <div className="job-info">
                      <h3 className="job-title">{job.title}</h3>
                      <div className="job-meta">
                        <span className="job-apps">{job.applications} applications</span>
                        <span className="job-posted">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="job-status">
                      <span className={`status-badge ${job.status.toLowerCase()}`}>{job.status}</span>
                    </div>
                  </div>
                ))}
                {recentJobs.length === 0 && (
                  <div className="no-jobs">
                    <p>No job postings yet. Start searching for candidates to create job postings!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Applications</h2>
              <button className="btn-link" >
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

        {/* Talent Pool Insights Section */}
        <div className="dashboard-section insights-section">
          <div className="section-header">
            <h2>Talent Pool Insights</h2>
          </div>
          <div className="insights-grid">
            <div className="insight-card">
              <h3 className="insight-title">Skill Distribution</h3>
              <div className="insight-content">
                <div className="skill-bar">
                  <span className="skill-label">Full Stack</span>
                  <div className="skill-progress">
                    <div className="progress-bar" style={{ width: '35%' }}></div>
                  </div>
                  <span className="skill-percentage">35%</span>
                </div>
                <div className="skill-bar">
                  <span className="skill-label">Frontend</span>
                  <div className="skill-progress">
                    <div className="progress-bar" style={{ width: '25%' }}></div>
                  </div>
                  <span className="skill-percentage">25%</span>
                </div>
                <div className="skill-bar">
                  <span className="skill-label">Backend</span>
                  <div className="skill-progress">
                    <div className="progress-bar" style={{ width: '20%' }}></div>
                  </div>
                  <span className="skill-percentage">20%</span>
                </div>
                <div className="skill-bar">
                  <span className="skill-label">DevOps</span>
                  <div className="skill-progress">
                    <div className="progress-bar" style={{ width: '15%' }}></div>
                  </div>
                  <span className="skill-percentage">15%</span>
                </div>
                <div className="skill-bar">
                  <span className="skill-label">Others</span>
                  <div className="skill-progress">
                    <div className="progress-bar" style={{ width: '5%' }}></div>
                  </div>
                  <span className="skill-percentage">5%</span>
                </div>
              </div>
            </div>

            <div className="insight-card">
              <h3 className="insight-title">Experience Levels</h3>
              <div className="insight-content">
                <div className="experience-chart">
                  <div className="experience-bar">
                    <div className="experience-label">Senior (5+ years)</div>
                    <div className="experience-progress">
                      <div className="progress-bar" style={{ width: '30%' }}></div>
                    </div>
                    <div className="experience-percentage">30%</div>
                  </div>
                  <div className="experience-bar">
                    <div className="experience-label">Mid-level (3-5 years)</div>
                    <div className="experience-progress">
                      <div className="progress-bar" style={{ width: '45%' }}></div>
                    </div>
                    <div className="experience-percentage">45%</div>
                  </div>
                  <div className="experience-bar">
                    <div className="experience-label">Junior (0-3 years)</div>
                    <div className="experience-progress">
                      <div className="progress-bar" style={{ width: '25%' }}></div>
                    </div>
                    <div className="experience-percentage">25%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="insight-card">
              <h3 className="insight-title">PostHog Analytics</h3>
              <div className="insight-content">
                <div className="analytics-metrics">
                  <div className="analytics-metric">
                    <span className="metric-label">Avg. Session Duration</span>
                    <span className="metric-value">4.5 min</span>
                  </div>
                  <div className="analytics-metric">
                    <span className="metric-label">Bounce Rate</span>
                    <span className="metric-value">32%</span>
                  </div>
                  <div className="analytics-metric">
                    <span className="metric-label">Conversion Rate</span>
                    <span className="metric-value">15%</span>
                  </div>
                  <div className="analytics-metric">
                    <span className="metric-label">Active Users</span>
                    <span className="metric-value">2.5k</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .company-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #f6f8fc 0%, #f1f4f9 100%);
          padding: 2rem;
        }

        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 1.5rem;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .dashboard-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .dashboard-subtitle {
          color: #2d3748;
          font-size: 1.125rem;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.9);
          color: #6366f1;
          border: 2px solid #6366f1;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: #6366f1;
          color: white;
          transform: translateY(-2px);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 1.5rem;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
          position: relative;
          overflow: hidden;
          border: 2px solid transparent;
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
          background: #6366f1;
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
          border-color: #6366f1;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .metric-label {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .metric-change {
          font-size: 0.875rem;
          color: #10b981;
        }

        .dashboard-grid {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: 1fr;
        }

        @media (min-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .dashboard-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 1.5rem;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .quick-actions-section {
          grid-column: 1 / -1;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .section-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
        }

        .btn-link {
          background: none;
          border: none;
          color: #6366f1;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.3s ease;
        }

        .btn-link:hover {
          color: #4f46e5;
        }

        .jobs-list,
        .applications-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .job-item,
        .application-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 12px;
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .job-item:hover,
        .application-item:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .job-title {
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }

        .job-meta {
          display: flex;
          gap: 1rem;
        }

        .job-apps,
        .job-posted {
          font-size: 0.875rem;
          color: #2d3748;
        }

        .candidate-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .candidate-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .candidate-name {
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }

        .candidate-position {
          font-size: 0.875rem;
          color: #2d3748;
        }

        .application-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .application-date {
          font-size: 0.75rem;
          color: #2d3748;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-badge.active {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .status-badge.draft {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .status-badge.interview {
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
        }

        .status-badge.review {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .status-badge.applied {
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .action-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .action-card:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border-color: #6366f1;
        }

        .action-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .action-title {
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }

        .action-desc {
          font-size: 0.875rem;
          color: #2d3748;
        }

        .loading {
          text-align: center;
          color: #2d3748;
          padding: 2rem;
        }

        .no-jobs {
          text-align: center;
          padding: 2rem;
          color: #2d3748;
        }

        .no-jobs p {
          margin-bottom: 1rem;
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
          .company-dashboard {
            padding: 1rem;
          }

          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .header-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .job-item,
          .application-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .application-meta {
            align-items: flex-start;
            flex-direction: row;
            gap: 0.5rem;
          }
        }

        /* New styles for insights section */
        .insights-section {
          margin-top: 2rem;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .insight-card {
          background: var(--bg-light);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }

        .insight-title {
          font-size: var(--fs-lg);
          font-weight: var(--fw-bold);
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .insight-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .skill-bar,
        .experience-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .skill-label,
        .experience-label {
          min-width: 100px;
          font-size: var(--fs-sm);
          color: var(--text-secondary);
        }

        .skill-progress,
        .experience-progress {
          flex: 1;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: var(--color-primary);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .skill-percentage,
        .experience-percentage {
          min-width: 40px;
          font-size: var(--fs-sm);
          font-weight: var(--fw-medium);
          color: var(--text-primary);
          text-align: right;
        }

        .analytics-metrics {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .analytics-metric {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .analytics-metric .metric-label {
          font-size: var(--fs-sm);
          color: var(--text-secondary);
        }

        .analytics-metric .metric-value {
          font-size: var(--fs-lg);
          font-weight: var(--fw-bold);
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .insights-grid {
            grid-template-columns: 1fr;
          }

          .analytics-metrics {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
    </div>
  )
}
