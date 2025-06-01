"use client"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2, Trash2, Edit, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Job {
  id: string
  title: string
  description: string
  location: string
  experience: string
  employmentType: string
  isRemote: boolean
  skills: string[]
  status: string
  createdAt: string
  preScreeningQuestions?: {
    id: string
    question: string
    answer: string
  }[]
}

interface Candidate {
  id: string
  fullName: string
  skills: string[]
  experience: string
  location: string
  hasApplied: boolean
}

export default function CompanyJobDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.jobId as string
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [candidates, setCandidates] = useState<Candidate[]>([])

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/company/jobs/${jobId}`)
        if (!response.ok) throw new Error('Failed to fetch job')
        const data = await response.json()
        setJob(data)
      } catch (error) {
        // console.error('Error fetching job:', error)
        toast({
          title: "Error",
          description: "Failed to fetch job details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    const fetchCandidates = async () => {
      try {
        const response = await fetch(`/api/company/jobs/${jobId}/candidates`)
        if (!response.ok) throw new Error('Failed to fetch candidates')
        const data = await response.json()
        setCandidates(data)
      } catch (error) {
        // console.error('Error fetching candidates:', error)
      }
    }

    fetchJob()
    fetchCandidates()
  }, [jobId])

  const handleGenerateQuestions = async () => {
    if (!job) return

    setIsGeneratingQuestions(true)
    try {
      const response = await fetch('/api/pre-screening/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          jobTitle: job.title,
          jobDescription: job.description,
          skills: job.skills,
        }),
      })

      if (!response.ok) throw new Error('Failed to generate questions')
      
      const data = await response.json()
      setJob(prev => prev ? { ...prev, preScreeningQuestions: data.questions } : null)
      
      toast({
        title: "Success",
        description: "Pre-screening questions generated successfully",
      })
    } catch (error) {
      // console.error('Error generating questions:', error)
      toast({
        title: "Error",
        description: "Failed to generate pre-screening questions",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingQuestions(false)
    }
  }

  const handleDelete = async () => {
    if (!job) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/company/jobs/${job.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete job')
      
      toast({
        title: "Success",
        description: "Job deleted successfully",
      })
      
      router.push('/company/jobs')
    } catch (error) {
      // console.error('Error deleting job:', error)
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Job not found</p>
      </div>
    )
  }

  return (
    <div className="job-details-page">
      <div className="page-container">
        <header className="page-header">
          <Button
            variant="ghost"
            className="back-btn"
            onClick={() => router.push("/company/jobs")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
          <div className="job-info">
            <h1 className="job-title">{job.title}</h1>
            <div className="job-meta">
              <span>📍 {job.location}</span>
              <span>👨‍💻 {job.experience}</span>
              <span>💼 {job.employmentType}</span>
              <span>{job.isRemote ? "🌐 Remote" : "🏢 On-site"}</span>
              <span className={`status-badge ${job.status.toLowerCase()}`}>{job.status}</span>
            </div>
          </div>
          <div className="job-actions">
          <button className="btn-danger" onClick={() => handleDelete()}>Delete</button>
          </div>
        </header>

        <div className="content-grid">
          <div className="job-content">
            <section className="content-section">
              <h2>Job Description</h2>
              <p style={{color:"black"}}>{job.description}</p>
            </section>

            <section className="content-section">
              <h2>Required Skills</h2>
              <div className="skills-list">
                {job.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section className="content-section">
              <div className="section-header">
                <h2>Pre-screening Questions</h2>
                <button className="btn-primary" onClick={handleGenerateQuestions} disabled={isGeneratingQuestions}>
                {isGeneratingQuestions ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Questions"
                  )}
                </button>
                
              </div>
              
              {job.preScreeningQuestions ? (
                <div className="questions-list">
                  {job.preScreeningQuestions.map((qa, index) => (
                    <div key={qa.id} className="question-card">
                      <h3>Question {index + 1}</h3>
                      <p className="question">{qa.question}</p>
                      <p className="answer">{qa.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No pre-screening questions generated yet. Click the button above to generate questions.
                </p>
              )}
            </section>

            <section className="content-section">
              <h2>Selected Candidates</h2>
              {candidates.length > 0 ? (
                <div className="candidates-list">
                  {candidates.map((candidate) => (
                    <div key={candidate.id} className="candidate-card">
                      <div className="candidate-info">
                        <h3>{candidate.fullName}</h3>
                        <div className="candidate-meta">
                          <span>📍 {candidate.location}</span>
                          <span>👨‍💻 {candidate.experience}</span>
                        </div>
                        <div className="skills-list">
                          {candidate.skills.map((skill, index) => (
                            <span key={index} className="skill-tag">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="candidate-status">
                        <span className={`status-badge ${candidate.hasApplied ? 'applied' : 'pending'}`}>
                          {candidate.hasApplied ? 'Applied' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No candidates have been selected for this job yet.
                </p>
              )}
            </section>
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
          margin-bottom: 1rem;
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

        .status-badge.applied {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .job-actions {
          display: flex;
          gap: 1rem;
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

        .content-grid {
          display: grid;
          grid-template-columns: 1fr;
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

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .skill-tag {
          background: #e2e8f0;
          color: #4a5568;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
        }

        .questions-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .question-card {
          background: #f7fafc;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .question-card h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .question {
          color: #4a5568;
          margin-bottom: 0.5rem;
        }

        .answer {
          color: #718096;
          font-size: 0.875rem;
        }

        .candidates-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .candidate-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f7fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .candidate-info {
          flex: 1;
        }

        .candidate-info h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .candidate-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
          color: #4a5568;
          margin-bottom: 0.5rem;
        }

        .candidate-status {
          margin-left: 1rem;
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

        .btn-destructive {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-destructive:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }

        .btn-destructive:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
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
