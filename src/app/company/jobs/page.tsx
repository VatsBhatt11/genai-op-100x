"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Job {
  id: string
  title: string
  applications: number
  status: string
  location: string
  experience: string
  employmentType: string
  isRemote: boolean
  createdAt: string
}

export default function CompanyJobsPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/company/jobs')
        if (!response.ok) throw new Error('Failed to fetch jobs')
        const data = await response.json()
        setJobs(data)
      } catch (error) {
        // console.error('Error fetching jobs:', error)
        toast({
          title: "Error",
          description: "Failed to fetch jobs",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const handleDelete = async (jobId: string) => {
    setDeletingJobId(jobId)
    try {
      const response = await fetch(`/api/company/jobs/${jobId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete job')
      
      setJobs(jobs.filter(job => job.id !== jobId))
      toast({
        title: "Success",
        description: "Job deleted successfully",
      })
    } catch (error) {
      // console.error('Error deleting job:', error)
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      })
    } finally {
      setDeletingJobId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="company-jobs-page">
      <div className="page-container">
        <header className="page-header">
          <div className="header-content">
            <h1 className="page-title">Job Postings</h1>
            <p className="page-subtitle">Manage your active job listings</p>
          </div>
        </header>

        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <h3 className="job-title">{job.title}</h3>
                <span className={`status-badge ${job.status.toLowerCase()}`}>{job.status}</span>
              </div>
              <div className="job-details">
                <p className="job-location">📍 {job.location}</p>
                <p className="job-experience">👨‍💻 {job.experience}</p>
                <p className="job-type">💼 {job.employmentType}</p>
                <p className="job-remote">{job.isRemote ? "🌐 Remote" : "🏢 On-site"}</p>
                <p className="job-posted">📅 Posted {new Date(job.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="job-actions">
                {/* <Button
                  variant="outline"
                  onClick={() => router.push(`/company/jobs/${job.id}`)}
                >
                  <Eye className="w-4 h-4 mr-2" /> */}
                                  <button className="btn-secondary" onClick={() => router.push(`/company/jobs/${job.id}`)}>

                  View Details
                </button>
                <button className="btn-danger" onClick={() => handleDelete(job.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .company-jobs-page {
          min-height: 100vh;
          background: #f8fafc;
          padding: 2rem 1rem;
        }

        .page-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .page-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .page-subtitle {
          color: #718096;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .job-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .job-card:hover {
          transform: translateY(-4px);
        }

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .job-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a202c;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .status-badge.active {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.draft {
          background: #fef3c7;
          color: #92400e;
        }

        .job-details {
          margin-bottom: 1rem;
        }

        .job-details p {
          margin: 0.5rem 0;
          color: #4a5568;
          font-size: 0.875rem;
        }

        .job-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .jobs-grid {
            grid-template-columns: 1fr;
          }
        }

        .btn-secondary {
          background: #667eea;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-outline {
          background: transparent;
          color: #667eea;
          border: 1px solid #667eea;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-danger {
          background: #e53e3e;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

      `}</style>
    </div>
  )
}
