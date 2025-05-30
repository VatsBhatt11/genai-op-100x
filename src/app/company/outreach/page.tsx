"use client"

import { useState } from "react"

export default function CompanyOutreachPage() {
  const [activeTab, setActiveTab] = useState("templates")

  const emailTemplates = [
    {
      id: 1,
      name: "Initial Outreach",
      subject: "Exciting Opportunity at {Company}",
      content: "Hi {Name},\n\nI came across your profile and was impressed by your experience in {Skill}...",
      used: 45,
      responseRate: "12%",
    },
    {
      id: 2,
      name: "Follow-up",
      subject: "Following up on our conversation",
      content: "Hi {Name},\n\nI wanted to follow up on our previous conversation about the {Position} role...",
      used: 32,
      responseRate: "8%",
    },
    {
      id: 3,
      name: "Interview Invitation",
      subject: "Interview Invitation - {Position} at {Company}",
      content: "Hi {Name},\n\nWe'd love to schedule an interview to discuss the {Position} role...",
      used: 28,
      responseRate: "85%",
    },
  ]

  const campaigns = [
    {
      id: 1,
      name: "Senior Engineers Q1",
      status: "Active",
      sent: 150,
      opened: 87,
      replied: 23,
      template: "Initial Outreach",
    },
    {
      id: 2,
      name: "Product Managers",
      status: "Draft",
      sent: 0,
      opened: 0,
      replied: 0,
      template: "Initial Outreach",
    },
    {
      id: 3,
      name: "UX Designers",
      status: "Completed",
      sent: 89,
      opened: 65,
      replied: 12,
      template: "Initial Outreach",
    },
  ]

  return (
    <div className="outreach-page">
      <div className="page-container">
        <header className="page-header">
          <h1 className="page-title">Outreach Management</h1>
          <p className="page-subtitle">Manage email templates and campaigns</p>
        </header>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "templates" ? "active" : ""}`}
            onClick={() => setActiveTab("templates")}
          >
            Email Templates
          </button>
          <button
            className={`tab ${activeTab === "campaigns" ? "active" : ""}`}
            onClick={() => setActiveTab("campaigns")}
          >
            Campaigns
          </button>
          <button
            className={`tab ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
        </div>

        {activeTab === "templates" && (
          <div className="templates-section">
            <div className="section-header">
              <h2>Email Templates</h2>
              <button className="btn-primary">Create Template</button>
            </div>

            <div className="templates-grid">
              {emailTemplates.map((template) => (
                <div key={template.id} className="template-card">
                  <div className="template-header">
                    <h3>{template.name}</h3>
                    <div className="template-stats">
                      <span>Used {template.used} times</span>
                      <span>{template.responseRate} response rate</span>
                    </div>
                  </div>
                  <div className="template-preview">
                    <h4>Subject: {template.subject}</h4>
                    <p>{template.content.substring(0, 100)}...</p>
                  </div>
                  <div className="template-actions">
                    <button className="btn-secondary">Edit</button>
                    <button className="btn-outline">Duplicate</button>
                    <button className="btn-danger">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "campaigns" && (
          <div className="campaigns-section">
            <div className="section-header">
              <h2>Email Campaigns</h2>
              <button className="btn-primary">New Campaign</button>
            </div>

            <div className="campaigns-table">
              <div className="table-header">
                <div>Campaign Name</div>
                <div>Status</div>
                <div>Sent</div>
                <div>Opened</div>
                <div>Replied</div>
                <div>Template</div>
                <div>Actions</div>
              </div>
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="table-row">
                  <div className="campaign-name">{campaign.name}</div>
                  <div>
                    <span className={`status-badge ${campaign.status.toLowerCase()}`}>{campaign.status}</span>
                  </div>
                  <div>{campaign.sent}</div>
                  <div>{campaign.opened}</div>
                  <div>{campaign.replied}</div>
                  <div>{campaign.template}</div>
                  <div className="table-actions">
                    <button className="btn-small">View</button>
                    <button className="btn-small">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="analytics-section">
            <h2>Outreach Analytics</h2>

            <div className="metrics-grid">
              <div className="metric-card">
                <h3>Total Emails Sent</h3>
                <div className="metric-value">1,247</div>
                <div className="metric-change">+12% this month</div>
              </div>
              <div className="metric-card">
                <h3>Open Rate</h3>
                <div className="metric-value">58%</div>
                <div className="metric-change">+3% this month</div>
              </div>
              <div className="metric-card">
                <h3>Response Rate</h3>
                <div className="metric-value">14%</div>
                <div className="metric-change">+1% this month</div>
              </div>
              <div className="metric-card">
                <h3>Conversion Rate</h3>
                <div className="metric-value">6%</div>
                <div className="metric-change">+2% this month</div>
              </div>
            </div>

            <div className="chart-placeholder">
              <h3>Email Performance Over Time</h3>
              <div className="chart-area">
                <p>📈 Chart visualization would go here</p>
                <p>Shows email performance metrics over time</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .outreach-page {
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

        .tabs {
          display: flex;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
          overflow: hidden;
        }

        .tab {
          flex: 1;
          padding: 1rem 1.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: 500;
          color: #4a5568;
          transition: all 0.3s ease;
        }

        .tab.active {
          background: #667eea;
          color: white;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a202c;
        }

        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .template-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .template-header {
          margin-bottom: 1rem;
        }

        .template-header h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .template-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
          color: #718096;
        }

        .template-preview {
          margin-bottom: 1rem;
          padding: 1rem;
          background: #f7fafc;
          border-radius: 8px;
        }

        .template-preview h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .template-preview p {
          font-size: 0.875rem;
          color: #4a5568;
        }

        .template-actions {
          display: flex;
          gap: 0.5rem;
        }

        .campaigns-table {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr 1fr;
          gap: 1rem;
          padding: 1rem 1.5rem;
          background: #f7fafc;
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        .table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr 1fr;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          align-items: center;
        }

        .campaign-name {
          font-weight: 500;
          color: #1a202c;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-badge.active {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.draft {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.completed {
          background: #dbeafe;
          color: #1e40af;
        }

        .table-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-small {
          background: transparent;
          color: #667eea;
          border: 1px solid #667eea;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .metric-card h3 {
          font-size: 0.875rem;
          font-weight: 500;
          color: #718096;
          margin-bottom: 0.5rem;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 0.25rem;
        }

        .metric-change {
          font-size: 0.875rem;
          color: #10b981;
        }

        .chart-placeholder {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .chart-placeholder h3 {
          margin-bottom: 1rem;
          color: #1a202c;
        }

        .chart-area {
          height: 300px;
          background: #f7fafc;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #718096;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
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

        .btn-danger {
          background: #e53e3e;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .tabs {
            flex-direction: column;
          }

          .table-header,
          .table-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
