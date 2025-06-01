"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function NaturalLanguageJobCreator() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/jobs/create-from-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create job")
      }

      const job = await response.json()
      router.push(`/company/jobs/${job.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="natural-language-creator">
      <form onSubmit={handleSubmit} className="creator-form">
        <div className="form-group">
          <label htmlFor="query">Describe the job you're looking to fill</label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Looking for a senior frontend developer with React experience to join our team in San Francisco. Must have 5+ years of experience and strong TypeScript skills. We offer competitive salary, health benefits, and remote work options."
            rows={4}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating Job..." : "Create Job Posting"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .natural-language-creator {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .creator-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 500;
          color: #1e293b;
        }

        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 1rem;
          line-height: 1.5;
          resize: vertical;
          transition: border-color 0.2s;
        }

        .form-group textarea:focus {
          outline: none;
          border-color: #4caf50;
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
        }

        .btn-primary {
          background: #4caf50;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover:not(:disabled) {
          background: #43a047;
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .error-message {
          color: #dc2626;
          font-size: 0.875rem;
          padding: 0.5rem;
          background: #fee2e2;
          border-radius: 0.375rem;
        }
      `}</style>
    </div>
  )
} 