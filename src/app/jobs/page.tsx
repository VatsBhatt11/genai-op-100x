"use client"

import type React from "react"

import { useState } from "react"
import "../../styles/jobs.css"

export default function JobsPage() {
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    experience: "",
    salary: "",
  })

  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$120,000 - $150,000",
      type: "Full-time",
      description: "We're looking for a senior frontend developer to join our growing team...",
      tags: ["React", "TypeScript", "Next.js", "CSS"],
    },
    {
      id: 2,
      title: "Product Manager",
      company: "StartupXYZ",
      location: "Remote",
      salary: "$100,000 - $130,000",
      type: "Full-time",
      description: "Join our product team to help shape the future of our platform...",
      tags: ["Product Strategy", "Analytics", "Agile", "Leadership"],
    },
    {
      id: 3,
      title: "UX Designer",
      company: "Design Studio",
      location: "New York, NY",
      salary: "$80,000 - $100,000",
      type: "Full-time",
      description: "Create beautiful and intuitive user experiences for our clients...",
      tags: ["Figma", "User Research", "Prototyping", "Design Systems"],
    },
  ]

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="jobs-container">
      <div className="jobs-header animate-fade-in">
        <h1 className="jobs-title">Find Your Next Opportunity</h1>

        <div className="jobs-filters">
          <div className="jobs-filter">
            <select name="location" value={filters.location} onChange={handleFilterChange}>
              <option value="">All Locations</option>
              <option value="remote">Remote</option>
              <option value="san-francisco">San Francisco</option>
              <option value="new-york">New York</option>
              <option value="austin">Austin</option>
            </select>
          </div>

          <div className="jobs-filter">
            <select name="jobType" value={filters.jobType} onChange={handleFilterChange}>
              <option value="">All Job Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>

          <div className="jobs-filter">
            <select name="experience" value={filters.experience} onChange={handleFilterChange}>
              <option value="">All Experience Levels</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
              <option value="lead">Lead/Principal</option>
            </select>
          </div>

          <div className="jobs-filter">
            <select name="salary" value={filters.salary} onChange={handleFilterChange}>
              <option value="">All Salaries</option>
              <option value="50-75k">$50k - $75k</option>
              <option value="75-100k">$75k - $100k</option>
              <option value="100-150k">$100k - $150k</option>
              <option value="150k+">$150k+</option>
            </select>
          </div>
        </div>
      </div>

      <div className="jobs-grid animate-fade-in-up delay-200">
        {jobs.map((job, index) => (
          <div key={job.id} className={`job-card animate-fade-in-up delay-${(index + 1) * 100}`}>
            <div className="job-card-header">
              <div className="job-info">
                <h3 className="job-title">{job.title}</h3>
                <p className="job-company">{job.company}</p>
                <p className="job-location">{job.location}</p>
              </div>
              <div className="job-salary">{job.salary}</div>
            </div>

            <p className="job-description">{job.description}</p>

            <div className="job-tags">
              {job.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="job-tag">
                  {tag}
                </span>
              ))}
            </div>

            <div className="job-actions">
              <button className="btn btn-primary">Apply Now</button>
              <button className="btn btn-secondary">Save Job</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
