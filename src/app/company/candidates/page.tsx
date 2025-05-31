"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Checkbox } from "@/src/components/ui/checkbox"
import { OutreachModal } from "@/src/components/OutreachModal"
import { Search, MapPin, Briefcase, Send } from "lucide-react"
import "@/src/styles/company-candidates.css"

interface Candidate {
  id: string
  fullName: string
  skills: string[]
  experience: string
  location: string
  employmentType: string
  completionScore: number
  resumeUrl: string
  user: {
    id: string
    email: string
  }
}

export default function CompanyCandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCandidates()
  }, [searchTerm])

  const fetchCandidates = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)

      const response = await fetch(`/api/candidates?${params}`)
      if (response.ok) {
        const data = await response.json()
        setCandidates(data.candidates)
      }
    } catch (error) {
      console.error("Failed to fetch candidates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectCandidate = (candidateId: string, checked: boolean) => {
    if (checked) {
      setSelectedCandidates((prev) => [...prev, candidateId])
    } else {
      setSelectedCandidates((prev) => prev.filter((id) => id !== candidateId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCandidates(candidates.map((c) => c.id))
    } else {
      setSelectedCandidates([])
    }
  }

  const selectedCandidateData = candidates
    .filter((c) => selectedCandidates.includes(c.id))
    .map((c) => ({
      id: c.id,
      fullName: c.fullName || "Unknown",
      email: c.user.email,
      skills: c.skills || [],
    }))

  return (
    <div className="candidates-page">
      <div className="page-container">
        <header className="page-header">
          <div className="header-content">
            <h1 className="page-title">Candidate Database</h1>
            <p className="page-subtitle">Find and connect with talented candidates</p>
          </div>
          <div className="header-actions">
            {selectedCandidates.length > 0 && (
              <OutreachModal
                candidates={selectedCandidateData}
                trigger={
                  <Button>
                    <Send className="w-4 h-4 mr-2" />
                    Message Selected ({selectedCandidates.length})
                  </Button>
                }
              />
            )}
          </div>
        </header>

        <div className="search-section">
          <div className="search-bar">
            <Search className="search-icon" />
            <Input
              placeholder="Search candidates by name, skills, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="candidates-section">
          <div className="section-header">
            <div className="flex items-center space-x-4">
              <Checkbox
                checked={selectedCandidates.length === candidates.length && candidates.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">
                {candidates.length} candidates found
                {selectedCandidates.length > 0 && ` • ${selectedCandidates.length} selected`}
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading candidates...</p>
              </div>
            </div>
          ) : (
            <div className="candidates-grid">
              {candidates.map((candidate) => (
                <Card key={candidate.id} className="candidate-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedCandidates.includes(candidate.id)}
                          onCheckedChange={(checked) => handleSelectCandidate(candidate.id, checked as boolean)}
                        />
                        <div>
                          <CardTitle className="text-lg">{candidate.fullName || "Anonymous Candidate"}</CardTitle>
                          <p className="text-sm text-gray-600">{candidate.user.email}</p>
                        </div>
                      </div>
                      <div className="completion-score">
                        <span className="text-xs text-gray-500">Profile</span>
                        <div className="text-sm font-semibold text-green-600">
                          {Math.round((candidate.completionScore || 0) * 100)}%
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="candidate-details">
                      {candidate.location && (
                        <div className="detail-item">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{candidate.location}</span>
                        </div>
                      )}
                      {candidate.experience && (
                        <div className="detail-item">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span>{candidate.experience}</span>
                        </div>
                      )}
                    </div>

                    {candidate.skills && candidate.skills.length > 0 && (
                      <div className="skills-section">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                        <div className="skills-list">
                          {candidate.skills.slice(0, 6).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="skill-badge">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 6 && (
                            <Badge variant="outline" className="skill-badge">
                              +{candidate.skills.length - 6} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="card-actions">
                      <OutreachModal
                        candidates={[
                          {
                            id: candidate.id,
                            fullName: candidate.fullName || "Unknown",
                            email: candidate.user.email,
                            skills: candidate.skills || [],
                          },
                        ]}
                        trigger={
                          <Button variant="outline" size="sm">
                            <Send className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        }
                      />
                      {candidate.resumeUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
                            View Resume
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && candidates.length === 0 && (
            <div className="empty-state">
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
                <p className="text-gray-600">
                  {searchTerm ? "Try adjusting your search terms or filters" : "No candidates have registered yet"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
