"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CompanyJobNewPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    type: "full-time",
    experience: "mid",
    salary_min: "",
    salary_max: "",
    requirements: "",
    benefits: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Job posting data:", formData)
    router.push("/company/jobs")
  }

  return (
    <div className="job-new-page">
      <div className="page-container">
        <header className="page-header">
          <button className="back-btn" onClick={() => router.push("/company/jobs")}>
            ← Back to Jobs
          </button>
          <h1 className="page-title">Post New Job</h1>
          <p className="page-subtitle">Create a new job posting to attract candidates</p>
        </header>

        <form onSubmit={handleSubmit} className="job-form">
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Senior Software Engineer"
                  required
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. San Francisco, CA or Remote"
                  required
                />
              </div>

              <div className="form-group">
                <label>Job Type</label>
                <select name="type" value={formData.type} onChange={handleInputChange}>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div className="form-group">
                <label>Experience Level</label>
                <select name="experience" value={formData.experience} onChange={handleInputChange}>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Salary Range</h2>
            <div className="salary-grid">
              <div className="form-group">
                <label>Minimum Salary ($)</label>
                <input
                  type="number"
                  name="salary_min"
                  value={formData.salary_min}
                  onChange={handleInputChange}
                  placeholder="80000"
                />
              </div>
              <div className="form-group">
                <label>Maximum Salary ($)</label>
                <input
                  type="number"
                  name="salary_max"
                  value={formData.salary_max}
                  onChange={handleInputChange}
                  placeholder="120000"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Job Description</h2>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                rows={6}
                required
              />
            </div>

            <div className="form-group">
              <label>Requirements</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                placeholder="List the required skills, experience, and qualifications..."
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>Benefits</label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleInputChange}
                placeholder="Health insurance, 401k, flexible hours, etc..."
                rows={4}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => router.push("/company/jobs")}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Post Job
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .job-new-page {
          min-height: 100vh;
          background: #f8fafc;
          padding: 2rem 1rem;
        }

        .page-container {
          max-width: 800px;
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

        .page-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .page-subtitle {
          color: #718096;
        }

        .job-form {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .form-section h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .salary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
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

        .btn-secondary {
          background: #f7fafc;
          color: #4a5568;
          border: 1px solid #e2e8f0;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .salary-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
