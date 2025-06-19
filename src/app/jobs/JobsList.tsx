"use client";

import Link from "next/link";

interface InterviewReport {
  score: number;
  summary: string;
  strengths: string[];
  areasForImprovement: string[];
}

interface Application {
  id: string;
  status: string;
  interviewReport: InterviewReport | null;
  candidateId: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  location: string | null;
  employmentType: string | null;
  company: {
    name: string;
    logo: string;
  };
  preScreening: {
    id: string;
  } | null;
  hasApplied: boolean;
  hasOutreach: boolean;
  application: Application | null;
  hasInterviewReport: boolean;
}

interface JobsListProps {
  jobs: Job[];
}

export default function JobsList({ jobs }: JobsListProps) {
  console.log(jobs)
  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <h1 className="jobs-title">Available Jobs</h1>
        <p className="jobs-subtitle">Find your next career opportunity</p>
      </div>

      <div className="jobs-grid">
        {jobs.map((job) => {
          let status = "Not Applied";
          if (job.hasApplied) {
            status = "Applied";
          } else if (job.hasOutreach) {
            status = "Outreached";
          }
          if (job.preScreening) {
            status = "In Review";
          }
          
          return (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <div>
                  <h2 className="job-title">{job.title}</h2>
                  <p className="job-company">{job.company.name}</p>
                </div>
                <span className={`job-tag ${status.toLowerCase().replace(" ", "-")}`}>
                  {status}
                </span>
              </div>

              <p className="job-description">{job.description}</p>

              <div className="job-details">
                <span className="job-tag">
                  <i className="fas fa-map-marker-alt"></i>
                  {job.location}
                </span>
                <span className="job-tag">
                  <i className="fas fa-briefcase"></i>
                  {job.employmentType}
                </span>
              </div>

              {job.hasApplied && job.application?.status === "INTERVIEW_COMPLETED" ? (
                <Link 
                  href={`/jobs/${job.id}/interview`}
                  className="btn btn-secondary"
                >
                  View Interview Report
                </Link>
              ) 
               : (
                <Link 
                  href={`/jobs/${job.id}/interview`}
                  className="btn btn-primary"
                >
                  Apply now
                </Link>
              )}
            </div>
          )
        })}
      </div>

      {jobs.length === 0 && (
        <div className="no-jobs">
          <h3>No jobs available</h3>
          <p>Check back later for new opportunities</p>
        </div>
      )}

      <style jsx>{`
        .jobs-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f6f8fc 0%, #f1f4f9 100%);
          padding: 2rem;
        }

        .jobs-header {
          text-align: center;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .jobs-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .jobs-subtitle {
          color: #2d3748;
          font-size: 1.125rem;
          margin-top: 0.5rem;
        }

        .jobs-filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .filter-group {
          flex: 1;
          min-width: 200px;
        }

        .filter-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.875rem;
          color: #2d3748;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-select:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .job-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border: 2px solid transparent;
        }

        .job-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          border-color: #6366f1;
        }

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .job-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .job-company {
          font-size: 0.875rem;
          color: #6366f1;
          font-weight: 600;
          margin-top: 0.25rem;
        }

        .job-tag {
          padding: 0.25rem 0.75rem;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 20px;
          font-size: 0.75rem;
          color: #6366f1;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .job-tag.not-applied {
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
        }

        .job-tag.in-review {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .job-description {
          color: #2d3748;
          font-size: 0.875rem;
          line-height: 1.5;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .job-details {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          text-decoration: none;
        }

        .btn-primary {
          linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3);
        }

        .no-jobs {
          text-align: center;
          padding: 3rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .no-jobs h3 {
          font-size: 1.5rem;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .no-jobs p {
          color: #2d3748;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .jobs-container {
            padding: 1rem;
          }

          .jobs-header {
            padding: 1rem;
          }

          .jobs-title {
            font-size: 2rem;
          }

          .jobs-filters {
            flex-direction: column;
          }

          .filter-group {
            width: 100%;
          }

          .jobs-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}