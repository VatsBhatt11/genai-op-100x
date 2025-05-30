"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ProfileEditPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    experience: "",
    skills: "",
    bio: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Profile saved:", formData)
    router.push("/dashboard")
  }

  return (
    <div className="profile-edit-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">Complete Your Profile</h1>
          <p className="profile-subtitle">Help employers find you with detailed information</p>
        </div>

        <form className="profile-form" onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>

            <div className="form-group full-width">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, State"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="title">Professional Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Software Engineer, Marketing Manager"
              />
            </div>

            <div className="form-group">
              <label htmlFor="experience">Years of Experience</label>
              <select id="experience" name="experience" value={formData.experience} onChange={handleInputChange}>
                <option value="">Select experience</option>
                <option value="0-1">0-1 years</option>
                <option value="2-3">2-3 years</option>
                <option value="4-6">4-6 years</option>
                <option value="7-10">7-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="skills">Key Skills</label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="Comma separated skills"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="bio">Professional Summary</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                placeholder="Brief summary of your professional background and goals"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="skip-button" onClick={() => router.push("/dashboard")}>
              Skip for now
            </button>
            <button type="submit" className="save-button">
              Save & Continue
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .profile-edit-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
          padding: 2rem 1rem;
        }

        .profile-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          animation: fadeInUp 0.6s ease-out;
        }

        .profile-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .profile-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .profile-subtitle {
          color: #64748b;
          font-size: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-weight: 500;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }

        .skip-button {
          background: none;
          border: 1px solid #e2e8f0;
          color: #64748b;
          padding: 0.875rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .skip-button:hover {
          background: #f8fafc;
          border-color: #2563eb;
        }

        .save-button {
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: white;
          border: none;
          padding: 0.875rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 150px;
        }

        .save-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .form-grid {
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
