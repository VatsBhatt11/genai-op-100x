'use client'
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2, ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import "./company-interview.css"

interface Job {
  id: string
  title: string
  description: string
}

interface InterviewReport {
  score: number;
  summary: string;
  strengths: string[];
  areasForImprovement: string[];
}

interface Candidate {
  id: string; // This is the candidateProfileId
  fullName: string;
  applicationId: string; // This is the application ID
  status: string; // ApplicationStatus
  interviewReport?: InterviewReport; // Optional interview report
}

export default function GenerateInterviewReportPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.jobId as string
  const candidateId = params.candidateId as string

  const [job, setJob] = useState<Job | null>(null)
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [interviewReport, setInterviewReport] = useState<InterviewReport | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch job details
        const jobResponse = await fetch(`/api/company/jobs/${jobId}`);
        if (!jobResponse.ok) throw new Error('Failed to fetch job');
        const jobData = await jobResponse.json();
        setJob(jobData);

        // Fetch candidate details and application status/report
        const candidateResponse = await fetch(`/api/company/jobs/${jobId}/candidates`);
        if (!candidateResponse.ok) throw new Error('Failed to fetch candidates');
        const candidatesData = await candidateResponse.json();
        const currentCandidate = candidatesData.find((c: Candidate) => c.id === candidateId);
        if (!currentCandidate) throw new Error('Candidate not found');

        // If application ID exists, fetch the full application details including report
        if (currentCandidate.applicationId) {
          const applicationResponse = await fetch(`/api/company/jobs/${jobId}/applications/${currentCandidate.applicationId}`);
          if (applicationResponse.ok) {
            const applicationData = await applicationResponse.json();
            if (applicationData.status === "INTERVIEW_COMPLETED" && applicationData.interviewReport) {
              setInterviewReport(applicationData.interviewReport);
            }
            setCandidate({ ...currentCandidate, status: applicationData.status });
          } else {
            // If application details can't be fetched, proceed with basic candidate data
            setCandidate(currentCandidate);
          }
        } else {
          setCandidate(currentCandidate);
        }

      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: "Error",
          description: "Failed to load job or candidate details.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [jobId, candidateId])

  const handleGenerateReport = async () => {
    if (!job || !candidate || !transcript.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide job details, candidate details, and the interview transcript.",
        variant: "destructive",
      })
      return
    }

    let currentApplicationId = candidate.applicationId;

    // If applicationId is missing, create a new application
    if (!currentApplicationId) {
      try {
        const createApplicationResponse = await fetch(`/api/company/jobs/${jobId}/candidates/${candidate.id}/create-application`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!createApplicationResponse.ok) {
          const errorData = await createApplicationResponse.json();
          throw new Error(errorData.error || 'Failed to create application');
        }

        const appData = await createApplicationResponse.json();
        currentApplicationId = appData.applicationId;
        // Update candidate state with the new applicationId
        setCandidate(prev => prev ? { ...prev, applicationId: currentApplicationId } : null);
        toast({
          title: "Application Created",
          description: "A new application record was created for this candidate.",
        });
      } catch (error: any) {
        console.error('Error creating application:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to create application.",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-interview-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: job.description,
          candidateId: candidate.id,
          interviewTranscript: transcript,
          applicationId: currentApplicationId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate report')
      }
      
      toast({
        title: "Success",
        description: "Interview report generated successfully!",
      })
      router.push(`/company/jobs/${jobId}`)
    } catch (error: any) {
      console.error('Error generating report:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to generate interview report.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!job || !candidate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Job or Candidate not found.</p>
      </div>
    )
  }

  return (
    <div className="generate-report-page">
      <div className="page-container">
        <header className="page-header">
          <Button
            variant="ghost"
            className="back-btn"
            onClick={() => router.push(`/company/jobs/${jobId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Candidates
          </Button>
          <div className="header-content">
            <h1 className="page-title">Interview Report</h1>
            <p className="page-subtitle">
              for {candidate.fullName} (Job: {job.title})
            </p>
          </div>
        </header>

        {interviewReport ? (
          <div className="report-grid">
            <div className="report-grid-row-full">
              <div className="report-section">
            <h2 className="section-title">Generated Report</h2>
            <div className="report-content">
              <p><strong>Score:</strong> {interviewReport.score}/100</p>
              <p><strong>Summary:</strong> {interviewReport.summary}</p>
              <h3>Strengths:</h3>
              <ul>
                {interviewReport.strengths.map((s, i) => (
                  <li key={i}>- {s}</li>
                ))}
              </ul>
              <h3>Areas for Improvement:</h3>
              <ul>
                {interviewReport.areasForImprovement.map((a, i) => (
                  <li key={i}>- {a}</li>
                ))}
              </ul>
              </div>
            </div>
          </div>
          </div>
        ) : (
          <div className="report-grid">
            <div className="report-grid-row-full">
              <div className="report-section">
            <h2 className="section-title">Interview Transcript</h2>
            <Textarea
              placeholder="Paste the interview transcript here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={15}
              className="transcript-textarea"
              disabled={isGenerating}
            />
            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating || !transcript.trim()}
              className="generate-button primary-button"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Generate Report
            </Button>
          </div>
        </div>
        </div>
        )}
      </div>
    </div>
  );
}