"use client"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2, Trash2, Edit, ArrowLeft, Send } from "lucide-react"
import { OutreachModal } from "@/components/OutreachModal"
import { toast } from "@/components/ui/use-toast"

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
  interviewScore?: number | null
  applicationId: string
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
          <button
            className="back-btn"
            onClick={() => router.push("/company/jobs")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </button>
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
                        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                          <div>
                        <h3>{candidate.fullName}</h3>
                        </div>
                         <div className="candidate-status">
                        <span className={`status-badge ${candidate.hasApplied ? 'applied' : 'pending'}`}>
                          {candidate.hasApplied ? 'Applied' : 'Pending'}
                        </span>
                      </div>
                      </div>
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
                      <div className="candidate-actions">
                    {candidate.interviewScore !== null && candidate.interviewScore !== undefined ? (
                      <span className="interview-score">Score: {candidate.interviewScore}/100</span>
                    ) : (
                      <button className="candidate-action-button" onClick={() => router.push(`/company/jobs/${jobId}/interview/${candidate.id}`)}>
                         Generate Interview Report
                       </button>
                    )}
                    <OutreachModal
                      candidates={[
                        {
                          id: candidate.id,
                          fullName: candidate.fullName,
                          email: "", // Email is not available in this context, will be fetched by API
                          skills: candidate.skills,
                        },
                      ]}
                      jobId={jobId}
                      trigger={
                        <button className="send-outreach-button">
                          <Send className="w-4 h-4 mr-2" />
                          Send Outreach
                        </button>
                      }
                    />
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
          background: linear-gradient(to bottom right, #e0eafc, #cfdef3);
          padding: 2.5rem 1.5rem;
          font-family: 'Inter', sans-serif;
        }

        .page-container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .page-header {
          background: linear-gradient(145deg, #ffffff, #f0f2f5);
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          margin-bottom: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .back-btn {
          margin-bottom: 1rem;
          align-self: flex-start;
          color: #555;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          color: #007bff;
          transform: translateX(-5px);
        }

        .job-info {
          margin-bottom: 1rem;
          flex-grow: 1;
        }

        .job-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #2c3e50;
          margin-bottom: 0.75rem;
          line-height: 1.2;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
        }

        .job-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          align-items: center;
          font-size: 0.95rem;
          color: #555;
          font-weight: 500;
        }

        .status-badge {
          padding: 0.3rem 0.8rem;
          border-radius: 25px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
        }

        .status-badge.active {
          background: linear-gradient(45deg, #a5d6a7, #66bb6a);
          color: #1b5e20;
          border: 1px solid #4caf50;
        }

        .status-badge.applied {
          background: linear-gradient(45deg, #a5d6a7, #66bb6a);
          color: #1b5e20;
          border: 1px solid #4caf50;
        }

        .status-badge.pending {
          background: linear-gradient(45deg, #ffcc80, #ffa726);
          color: #8d4000;
          border: 1px solid #ff9800;
        }

        .job-actions {
          display: flex;
          gap: 1.2rem;
          align-items: center;
          margin-top: 1rem;
        }

        .btn-primary {
          background: linear-gradient(45deg, #007bff, #0056b3);
          color: white;
          border: none;
          padding: 0.8rem 1.8rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
        }

        .job-content {
          background: linear-gradient(145deg, #ffffff, #f0f2f5);
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .content-section {
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .content-section:last-child {
          margin-bottom: 0;
          border-bottom: none;
          padding-bottom: 0;
        }

        .content-section h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 1.2rem;
          position: relative;
          padding-left: 15px;
        }

        .content-section h2::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 80%;
          background: linear-gradient(180deg, #007bff, #0056b3);
          border-radius: 3px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .skill-tag {
          background: #e9ecef;
          color: #495057;
          padding: 0.3rem 0.8rem;
          border-radius: 25px;
          font-size: 0.85rem;
          font-weight: 500;
          border: 1px solid #dee2e6;
        }

        .questions-list {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .question-card {
          background: #ffffff;
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #e9ecef;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .question-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
        }

        .question-card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #34495e;
          margin-bottom: 0.75rem;
        }

        .question {
          color: #555;
          margin-bottom: 0.75rem;
          line-height: 1.6;
        }

        .answer {
          color: #777;
          font-size: 0.9rem;
          font-style: italic;
          border-left: 3px solid #007bff;
          padding-left: 10px;
          margin-top: 1rem;
        }

        .candidates-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .candidate-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 1.5rem;
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e9ecef;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .candidate-actions {
          display: flex;
          gap: 0.8rem;
          width: 100%;
          margin-top: 1rem;
        }

        .candidate-actions .interview-score {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .candidate-actions button {
          width: 100%;
        }

        .candidate-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
        }

        .candidate-info {
          width: 100%;
          margin-bottom: 1rem;
        }

        .candidate-info h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #34495e;
          margin-bottom: 0.6rem;
        }

        .candidate-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1.2rem;
          font-size: 0.9rem;
          color: #555;
          margin-bottom: 0.75rem;
        }

        .candidate-status {
          // align-self: flex-end;
          margin-top: -0.5rem;
          margin-right: -0.5rem;
        }

        .candidate-action-button {
          background: linear-gradient(45deg, #6c757d, #5a6268);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          box-shadow: 0 4px 15px rgba(108, 117, 125, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .candidate-action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(108, 117, 125, 0.3);
        }

        .candidate-action-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .send-outreach-button {
          background: linear-gradient(45deg, #28a745, #218838);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .send-outreach-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);
        }

        .send-outreach-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

         .btn-danger {
          background: linear-gradient(45deg, #dc3545, #c82333);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          box-shadow: 0 4px 15px rgba(220, 53, 69, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(220, 53, 69, 0.3);
        }

        .btn-danger:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .btn-danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(220, 53, 69, 0.3);
        }

        .btn-danger:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
      `}</style>
    </div>
  )
}
