"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Session } from "next-auth"

interface EducationEntry {
  gpa: string;
  field: string;
  degree: string;
  endDate: string;
  startDate: string;
  institution: string;
}

interface ProfileData {
  fullName: string;
  phoneNumber: string;
  location: string;
  experience: string;
  skills: string[];
  education: EducationEntry[];
  languages: string[];
  certifications: string[];
  employmentType: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
}

export default function ProfileEdit() {
  const router = useRouter()
  const { data: session, status } = useSession() as {
    data: (Session & { user: { id: string; role: string } }) | null
    status: "loading" | "authenticated" | "unauthenticated"
  }
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    phoneNumber: "",
    location: "",
    experience: "",
    skills: [],
    education: [],
    languages: [],
    certifications: [],
    employmentType: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
  })

  useEffect(() => {
    const fetchProfileData = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const response = await fetch(`/api/candidate/profile`)
          if (response.ok) {
            const data = await response.json()
            setProfileData({
              fullName: data.fullName || "",
              phoneNumber: data.phoneNumber || "",
              location: data.location || "",
              experience: data.experience || "",
              skills: data.skills || [],
              education: data.education || [],
              languages: data.languages || [],
              certifications: data.certifications || [],
              employmentType: data.employmentType || "",
              linkedinUrl: data.linkedinUrl || "",
              githubUrl: data.githubUrl || "",
              portfolioUrl: data.portfolioUrl || "",
            })
          }
        } catch (error) {
          // console.error("Error fetching profile data:", error)
          toast.error("Failed to load profile data")
        }
      }
    }

    fetchProfileData()
  }, [status, session])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim())
    setProfileData((prev) => ({
      ...prev,
      skills,
    }))
  }

  const handleLanguagesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const languages = e.target.value.split(",").map((lang) => lang.trim())
    setProfileData((prev) => ({
      ...prev,
      languages,
    }))
  }

  const handleCertificationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const certifications = e.target.value.split(",").map((cert) => cert.trim())
    setProfileData((prev) => ({
      ...prev,
      certifications,
    }))
  }

  const handleEducationChange = (index: number, field: keyof EducationEntry, value: string) => {
    setProfileData((prev) => {
      const newEducation = [...prev.education];
      if (!newEducation[index]) {
        newEducation[index] = {
          gpa: "",
          field: "",
          degree: "",
          endDate: "",
          startDate: "",
          institution: "",
        };
      }
      newEducation[index] = {
        ...newEducation[index],
        [field]: value,
      };
      return {
        ...prev,
        education: newEducation,
      };
    });
  };

  const addEducationEntry = () => {
    setProfileData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          gpa: "",
          field: "",
          degree: "",
          endDate: "",
          startDate: "",
          institution: "",
        },
      ],
    }));
  };

  const removeEducationEntry = (index: number) => {
    setProfileData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/candidate/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })

      if (response.ok) {
        toast.success("Profile updated successfully")
        router.push("/profile")
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to update profile")
      }
    } catch (error) {
      // console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="loading-container">
        <Loader2 className="loading-spinner" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  return (
    <div className="profile-edit-container">
      <h1 className="profile-title">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="tabs-container">
          <div className="tabs-header">
            <button
              type="button"
              className={`tab-button ${activeTab === "personal" ? "active" : ""}`}
              onClick={() => setActiveTab("personal")}
            >
              Personal Information
            </button>
            <button
              type="button"
              className={`tab-button ${activeTab === "professional" ? "active" : ""}`}
              onClick={() => setActiveTab("professional")}
            >
              Professional Details
            </button>
            <button
              type="button"
              className={`tab-button ${activeTab === "social" ? "active" : ""}`}
              onClick={() => setActiveTab("social")}
            >
              Social Links
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "personal" && (
              <div className="form-section">
                <h2 className="section-title">Personal Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      id="fullName"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      id="location"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="employmentType">Employment Type</label>
                    <input
                      id="employmentType"
                      name="employmentType"
                      value={profileData.employmentType}
                      onChange={handleInputChange}
                      placeholder="e.g., Full-time, Part-time, Contract"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "professional" && (
              <div className="form-section">
                <h2 className="section-title">Professional Details</h2>
                <div className="form-group">
                  <label htmlFor="experience">Experience</label>
                  <input
                    id="experience"
                    name="experience"
                    value={profileData.experience}
                    onChange={handleInputChange}
                    placeholder="e.g., 5 years of experience in software development"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="skills">Skills (comma-separated)</label>
                  <textarea
                    id="skills"
                    name="skills"
                    value={profileData.skills.join(", ")}
                    onChange={handleSkillsChange}
                    placeholder="e.g., JavaScript, React, Node.js"
                    className="form-textarea"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="languages">Languages (comma-separated)</label>
                  <textarea
                    id="languages"
                    name="languages"
                    value={profileData.languages.join(", ")}
                    onChange={handleLanguagesChange}
                    placeholder="e.g., English, Spanish, French"
                    className="form-textarea"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="certifications">Certifications (comma-separated)</label>
                  <textarea
                    id="certifications"
                    name="certifications"
                    value={profileData.certifications.join(", ")}
                    onChange={handleCertificationsChange}
                    placeholder="e.g., AWS Certified Developer, Google Cloud Professional"
                    className="form-textarea"
                  />
                </div>
                <div className="education-section">
                  <div className="section-header">
                    <h3 className="subsection-title">Education</h3>
                    <button
                      type="button"
                      onClick={addEducationEntry}
                      className="add-button"
                    >
                      + Add Education
                    </button>
                  </div>
                  {profileData.education.map((entry, index) => (
                    <div key={index} className="education-entry">
                      <div className="entry-header">
                        <h4 className="entry-title">Education Entry {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeEducationEntry(index)}
                          className="remove-button"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="form-grid">
                        <div className="form-group">
                          <label htmlFor={`institution-${index}`}>Institution</label>
                          <input
                            id={`institution-${index}`}
                            type="text"
                            value={entry.institution}
                            onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                            className="form-input"
                            placeholder="e.g., University of Technology"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor={`degree-${index}`}>Degree</label>
                          <input
                            id={`degree-${index}`}
                            type="text"
                            value={entry.degree}
                            onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                            className="form-input"
                            placeholder="e.g., Bachelor of Technology"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor={`field-${index}`}>Field of Study</label>
                          <input
                            id={`field-${index}`}
                            type="text"
                            value={entry.field}
                            onChange={(e) => handleEducationChange(index, "field", e.target.value)}
                            className="form-input"
                            placeholder="e.g., Computer Science"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor={`gpa-${index}`}>GPA</label>
                          <input
                            id={`gpa-${index}`}
                            type="text"
                            value={entry.gpa}
                            onChange={(e) => handleEducationChange(index, "gpa", e.target.value)}
                            className="form-input"
                            placeholder="e.g., 3.8"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor={`startDate-${index}`}>Start Date</label>
                          <input
                            id={`startDate-${index}`}
                            type="text"
                            value={entry.startDate}
                            onChange={(e) => handleEducationChange(index, "startDate", e.target.value)}
                            className="form-input"
                            placeholder="e.g., September 2021"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor={`endDate-${index}`}>End Date</label>
                          <input
                            id={`endDate-${index}`}
                            type="text"
                            value={entry.endDate}
                            onChange={(e) => handleEducationChange(index, "endDate", e.target.value)}
                            className="form-input"
                            placeholder="e.g., May 2025"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "social" && (
              <div className="form-section">
                <h2 className="section-title">Social Links</h2>
                <div className="form-group">
                  <label htmlFor="linkedinUrl">LinkedIn URL</label>
                  <input
                    id="linkedinUrl"
                    name="linkedinUrl"
                    type="url"
                    value={profileData.linkedinUrl}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/your-profile"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="githubUrl">GitHub URL</label>
                  <input
                    id="githubUrl"
                    name="githubUrl"
                    type="url"
                    value={profileData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/your-username"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="portfolioUrl">Portfolio URL</label>
                  <input
                    id="portfolioUrl"
                    name="portfolioUrl"
                    type="url"
                    value={profileData.portfolioUrl}
                    onChange={handleInputChange}
                    placeholder="https://your-portfolio.com"
                    className="form-input"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="loading-icon" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        .profile-edit-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .profile-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 2rem;
          text-align: center;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .tabs-container {
          background: #f8f9fa;
          border-radius: 15px;
          overflow: hidden;
        }

        .tabs-header {
          display: flex;
          background: #ffffff;
          padding: 1rem;
          border-bottom: 1px solid #e9ecef;
        }

        .tab-button {
          padding: 1rem 2rem;
          border: none;
          background: none;
          font-size: 1rem;
          font-weight: 600;
          color: #6c757d;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .tab-button:hover {
          color: #667eea;
        }

        .tab-button.active {
          color: #667eea;
        }

        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: -1rem;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 3px;
        }

        .tab-content {
          padding: 2rem;
        }

        .form-section {
          animation: fadeIn 0.3s ease;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          color: #4a5568;
          margin-bottom: 0.5rem;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          color: #1a1a1a;
          transition: all 0.3s ease;
          background: #ffffff;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        .submit-button {
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          background: linear-gradient(135deg, #667eea, #764ba2);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .loading-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f8f9fa;
        }

        .loading-spinner {
          width: 3rem;
          height: 3rem;
          color: #667eea;
          animation: spin 1s linear infinite;
        }

        .loading-icon {
          width: 1.25rem;
          height: 1.25rem;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .education-section {
          margin-top: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .subsection-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
        }

        .add-button {
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }

        .education-entry {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid #e2e8f0;
        }

        .entry-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .entry-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #4a5568;
        }

        .remove-button {
          padding: 0.5rem 1rem;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .remove-button:hover {
          background: #fecaca;
        }

        @media (max-width: 768px) {
          .profile-edit-container {
            padding: 1rem;
          }

          .tabs-header {
            flex-direction: column;
            gap: 0.5rem;
          }

          .tab-button {
            width: 100%;
            text-align: center;
          }

          .tab-button.active::after {
            bottom: 0;
            height: 100%;
            opacity: 0.1;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .education-entry {
            padding: 1rem;
          }

          .entry-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .remove-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
