"use client"
import { useRouter, useParams } from "next/navigation"

export default function CompanyJobDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.jobId

  // Mock job data - in real app, fetch based on jobId
  const job = {
    id: jobId,
    title: "Senior Software Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$120k - $160k",
    type: "Full-time",
    experience: "Senior Level",
    posted: "2024-01-15",
    applications: 45,
    status: "Active",
    description: "We are looking for a Senior Software Engineer to join our growing team...",
    requirements: "Bachelor's degree in Computer Science, 5+ years of experience...",
    benefits: "Health insurance, 401k matching, flexible hours, remote work options...",
  }

  const applications = [
    { id: 1, name: "John Doe", title: "Software Engineer", experience: "6 years", status: "New", avatar: "👨‍💻" },
    {
      id: 2,
      name: "Jane Smith",
      title: "Full Stack Developer",
      experience: "8 years",
      status: "Reviewed",
      avatar: "👩‍💻",
    },
    {
      id: 3,
      name: "Mike Johnson",
      title: "Senior Developer",
      experience: "10 years",
      status: "Interview",
      avatar: "👨‍💼",
    },
    { id: 4, name: "Sarah Wilson", title: "Software Engineer", experience: "5 years", status: "New", avatar: "👩‍💼" },
  ]

  return (
    <div className="job-details-page">
      <div className="page-container">
        <header className="page-header">
          <button className="back-btn" onClick={() => router.push("/company/jobs")}>
            ← Back to Jobs
          </button>
          <div className="job-info">
            <h1 className="job-title">{job.title}</h1>
            <div className="job-meta">
              <span>📍 {job.location}</span>
              <span>💰 {job.salary}</span>
              <span>📅 Posted {job.posted}</span>
              <span className={`status-badge ${job.status.toLowerCase()}`}>{job.status}</span>
            </div>
          </div>
          <div className="job-actions">
            <button className="btn-secondary">Edit Job</button>
            <button className="btn-danger">Delete Job</button>
          </div>
        </header>

        <div className="content-grid">
          <div className="job-content">
            <section className="content-section">
              <h2>Job Description</h2>
              <p>{job.description}</p>
            </section>

            <section className="content-section">
              <h2>Requirements</h2>
              <p>{job.requirements}</p>
            </section>

            <section className="content-section">
              <h2>Benefits</h2>
              <p>{job.benefits}</p>
            </section>
          </div>

          <div className="applications-sidebar">
            <div className="applications-header">
              <h2>Applications ({job.applications})</h2>
              <button className="btn-primary">View All</button>
            </div>

            <div className="applications-list">
              {applications.map((application) => (
                <div key={application.id} className="application-card">
                  <div className="application-header">
                    <span className="avatar">{application.avatar}</span>
                    <div className="applicant-info">
                      <h4>{application.name}</h4>
                      <p>{application.title}</p>
                      <small>{application.experience} experience</small>
                    </div>
                  </div>
                  <div className="application-footer">
                    <span className={`app-status ${application.status.toLowerCase()}`}>{application.status}</span>
                    <button className="view-btn">View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .job-details-page {
          min-height: 100vh;
          background: #f8fafc;
          padding: 2rem 1rem;
        }

        .page-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .back-btn {
          background: transparent;
          border: none;
          color: #667eea;
          cursor: pointer;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .job-info {
          margin-bottom: 1rem;
        }

        .job-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .job-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
          font-size: 0.875rem;
          color: #4a5568;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-badge.active {
          background: #dcfce7;
          color: #166534;
        }

        .job-actions {
          display: flex;
          gap: 1rem;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .job-content {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .content-section {
          margin-bottom: 2rem;
        }

        .content-section h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 1rem;
        }

        .content-section p {
          color: #4a5568;
          line-height: 1.6;
        }

        .applications-sidebar {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          height: fit-content;
        }

        .applications-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .applications-header h2 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a202c;
        }

        .applications-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .application-card {
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .application-card:hover {
          border-color: #667eea;
          background: #f7fafc;
        }

        .application-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .avatar {
          font-size: 1.5rem;
        }

        .applicant-info h4 {
          margin: 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: #1a202c;
        }

        .applicant-info p {
          margin: 0;
          font-size: 0.75rem;
          color: #4a5568;
        }

        .applicant-info small {
          font-size: 0.75rem;
          color: #718096;
        }

        .application-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .app-status {
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .app-status.new {
          background: #ddd6fe;
          color: #5b21b6;
        }

        .app-status.reviewed {
          background: #fef3c7;
          color: #92400e;
        }

        .app-status.interview {
          background: #dcfce7;
          color: #166534;
        }

        .view-btn {
          background: transparent;
          color: #667eea;
          border: none;
          font-size: 0.75rem;
          cursor: pointer;
          text-decoration: underline;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-secondary {
          background: #f7fafc;
          color: #4a5568;
          border: 1px solid #e2e8f0;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .btn-danger {
          background: #e53e3e;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
          }

          .job-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
