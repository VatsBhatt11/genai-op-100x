"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import "../../styles/onboarding.css"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    userType: "",
    experience: "",
    skills: "",
    location: "",
    salary: "",
    jobType: "",
  })
  const router = useRouter()

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Complete onboarding
      if (formData.userType === "company") {
        router.push("/company/dashboard")
      } else {
        router.push("/dashboard")
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleUserTypeSelect = (type: string) => {
    setFormData({ ...formData, userType: type })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="onboarding-container">
      <div className="onboarding-card animate-scale-in">
        <h1 className="onboarding-title">Let's get you set up</h1>

        {step === 1 && (
          <div className="onboarding-section">
            <h2 className="onboarding-section-title">What brings you here?</h2>
            <div className="onboarding-radio-group">
              <div
                className={`onboarding-radio-option ${formData.userType === "candidate" ? "selected" : ""}`}
                onClick={() => handleUserTypeSelect("candidate")}
              >
                <input
                  type="radio"
                  name="userType"
                  value="candidate"
                  checked={formData.userType === "candidate"}
                  onChange={handleInputChange}
                />
                <div className="onboarding-radio-title">I'm looking for a job</div>
                <div className="onboarding-radio-description">Find your next career opportunity</div>
              </div>

              <div
                className={`onboarding-radio-option ${formData.userType === "company" ? "selected" : ""}`}
                onClick={() => handleUserTypeSelect("company")}
              >
                <input
                  type="radio"
                  name="userType"
                  value="company"
                  checked={formData.userType === "company"}
                  onChange={handleInputChange}
                />
                <div className="onboarding-radio-title">I'm hiring</div>
                <div className="onboarding-radio-description">Find the perfect candidates for your team</div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && formData.userType === "candidate" && (
          <div className="onboarding-section">
            <h2 className="onboarding-section-title">Tell us about yourself</h2>
            <div className="onboarding-form">
              <div className="form-group">
                <label htmlFor="experience">Years of Experience</label>
                <select id="experience" name="experience" value={formData.experience} onChange={handleInputChange}>
                  <option value="">Select experience level</option>
                  <option value="0-1">0-1 years</option>
                  <option value="2-5">2-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="skills">Key Skills</label>
                <textarea
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g., JavaScript, React, Node.js, Python..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Preferred Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., San Francisco, Remote, New York"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && formData.userType === "company" && (
          <div className="onboarding-section">
            <h2 className="onboarding-section-title">Company Information</h2>
            <div className="onboarding-form">
              <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  onChange={handleInputChange}
                  placeholder="Your company name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="industry">Industry</label>
                <select id="industry" name="industry" onChange={handleInputChange}>
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="companySize">Company Size</label>
                <select id="companySize" name="companySize" onChange={handleInputChange}>
                  <option value="">Select company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-1000">201-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="onboarding-section">
            <h2 className="onboarding-section-title">Almost done!</h2>
            <div className="onboarding-form">
              <div className="form-group">
                <label htmlFor="jobType">
                  {formData.userType === "candidate" ? "Preferred Job Type" : "Typical Job Types You Hire For"}
                </label>
                <select id="jobType" name="jobType" value={formData.jobType} onChange={handleInputChange}>
                  <option value="">Select job type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>

              {formData.userType === "candidate" && (
                <div className="form-group">
                  <label htmlFor="salary">Expected Salary Range</label>
                  <select id="salary" name="salary" value={formData.salary} onChange={handleInputChange}>
                    <option value="">Select salary range</option>
                    <option value="30-50k">$30,000 - $50,000</option>
                    <option value="50-75k">$50,000 - $75,000</option>
                    <option value="75-100k">$75,000 - $100,000</option>
                    <option value="100-150k">$100,000 - $150,000</option>
                    <option value="150k+">$150,000+</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="onboarding-actions">
          {step > 1 && (
            <button type="button" onClick={handleBack} className="btn btn-secondary">
              Back
            </button>
          )}
          <button type="button" onClick={handleNext} className="btn btn-primary" disabled={!formData.userType}>
            {step === 3 ? "Complete Setup" : "Next"}
          </button>
        </div>
      </div>
    </div>
  )
}
