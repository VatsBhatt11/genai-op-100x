"use client"

import { useState } from "react"

export default function CompanyCandidatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    experience: "all",
    location: "all",
    skills: "all",
  })

  const candidates = [
    {
      id: 1,
      name: "Alex Chen",
      title: "Senior Software Engineer",
      location: "San Francisco, CA",
      experience: "8 years",
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      avatar: "👨‍💻",
      availability: "Available",
      salary: "$140k",
    },
    {
      id: 2,
      name: "Sarah Williams",
      title: "Product Manager",
      location: "Remote",
      experience: "6 years",
      skills: ["Product Strategy", "Agile", "Analytics", "Leadership"],
      avatar: "👩‍💼",
      availability: "Open to offers",
      salary: "$120k",
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      title: "UX Designer",
      location: "New York, NY",
      experience: "5 years",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
      avatar: "👨‍🎨",
      availability: "Available",
      salary: "$110k",
    },
    {
      id: 4,
      name: "Emily Taylor",
      title: "Data Scientist",
      location: "Austin, TX",
      experience: "7 years",
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
      avatar: "👩‍🔬",
      availability: "Considering offers",
      salary: "$130k",
    },
  ]

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }))
  }

  return (
    <div className="candidates-page">
      <div className="page-container">
        <header className="page-header">
          <h1 className="page-title">Search Candidates</h1>
          <p className="page-subtitle">Find qualified professionals for your team</p>
        </header>

        <div className="search-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name, title, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="search-btn">🔍</button>
          </div>

          <div className="filters">
            <select value={filters.experience} onChange={(e) => handleFilterChange("experience", e.target.value)}>
              <option value="all">All Experience</option>
              <option value="entry">Entry Level (0-2 years)</option>
              <option value="mid">Mid Level (3-5 years)</option>
              <option value="senior">Senior Level (6+ years)</option>
            </select>

            <select value={filters.location} onChange={(e) => handleFilterChange("location", e.target.value)}>
              <option value="all">All Locations</option>
              <option value="remote">Remote</option>
              <option value="sf">San Francisco</option>
              <option value="ny">New York</option>
              <option value="austin">Austin</option>
            </select>

            <select value={filters.skills} onChange={(e) => handleFilterChange("skills", e.target.value)}>
              <option value="all">All Skills</option>
              <option value="react">React</option>
              <option value="python">Python</option>
              <option value="design">Design</option>
              <option value="management">Management</option>
            </select>
          </div>
        </div>

        <div className="candidates-grid">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="candidate-card">
              <div className="candidate-header">
                <span className="candidate-avatar">{candidate.avatar}</span>
                <div className="candidate-info">
                  <h3 className="candidate-name">{candidate.name}</h3>
                  <p className="candidate-title">{candidate.title}</p>
                  <div className="candidate-meta">
                    <span>📍 {candidate.location}</span>
                    <span>⏱️ {candidate.experience}</span>
                    <span>💰 {candidate.salary}</span>
                  </div>
                </div>
                <div className="availability-badge">{candidate.availability}</div>
              </div>

              <div className="candidate-skills">
                <h4>Skills</h4>
                <div className="skills-list">
                  {candidate.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="candidate-actions">
                <button className="btn-primary">View Profile</button>
                <button className="btn-secondary">Send Message</button>
                <button className="btn-outline">Save</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .candidates-page {
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

        .page-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .page-subtitle {
          color: #718096;
        }

        .search-filters {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .search-bar {
          display: flex;
          margin-bottom: 1rem;
        }

        .search-input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px 0 0 8px;
          font-size: 0.875rem;
        }

        .search-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 0 8px 8px 0;
          cursor: pointer;
        }

        .filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .filters select {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.875rem;
          background: white;
        }

        .candidates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .candidate-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .candidate-card:hover {
          transform: translateY(-4px);
        }

        .candidate-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .candidate-avatar {
          font-size: 2rem;
        }

        .candidate-info {
          flex: 1;
        }

        .candidate-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 0.25rem;
        }

        .candidate-title {
          color: #4a5568;
          margin-bottom: 0.5rem;
        }

        .candidate-meta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.875rem;
          color: #718096;
        }

        .availability-badge {
          background: #dcfce7;
          color: #166534;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          white-space: nowrap;
        }

        .candidate-skills {
          margin-bottom: 1rem;
        }

        .candidate-skills h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .skill-tag {
          background: #f3f4f6;
          color: #374151;
          padding: 0.25rem 0.5rem;
          border-radius: 16px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .candidate-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary {
          background: #667eea;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .btn-outline {
          background: transparent;
          color: #667eea;
          border: 1px solid #667eea;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .candidate-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .candidate-actions {
            justify-content: center;
          }

          .filters {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
