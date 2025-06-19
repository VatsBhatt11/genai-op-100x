import React from 'react';
import './interview.css';

interface InterviewReportProps {
  report: {
    score: number;
    summary: string;
    strengths: string[];
    areasForImprovement: string[];
  };
}

export default function InterviewReport({ report }: InterviewReportProps) {
  return (
    <div className="interview-report-container">
      <h2>Interview Report</h2>
      <div className="report-section">
        <h3>Overall Score: {report.score}/100</h3>
        <p>{report.summary}</p>
      </div>
      <div className="report-section">
        <h3>Strengths</h3>
        <ul>
          {(report.strengths ?? []).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="report-section">
        <h3>Areas for Improvement</h3>
        <ul>
          {(report.areasForImprovement ?? []).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <button onClick={() => window.location.href = '/dashboard'} className="back-to-dashboard-button">
        Back to Dashboard
      </button>
    </div>
  );
}