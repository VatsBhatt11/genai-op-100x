"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function UploadResumePage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleContinue = () => {
    router.push("/profile-edit")
  }

  return (
    <div className="upload-resume-page">
      <div className="upload-container">
        <div className="progress-section">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "33%" }}></div>
          </div>
          <span className="progress-text">Step 2 of 3</span>
        </div>

        <div className="upload-content">
          <h1 className="upload-title">Upload Your Resume</h1>
          <p className="upload-subtitle">Help us understand your background better</p>

          <div
            className={`file-upload-area ${dragActive ? "drag-active" : ""} ${file ? "has-file" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="file-preview">
                <div className="file-icon">📄</div>
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <button className="remove-file" onClick={() => setFile(null)}>
                  ✕
                </button>
              </div>
            ) : (
              <>
                <div className="upload-icon">📤</div>
                <h3>Drag & drop your resume here</h3>
                <p>or click to browse files</p>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="file-input" />
              </>
            )}
          </div>

          <div className="upload-actions">
            <button className="skip-button" onClick={handleContinue}>
              Skip for now
            </button>
            <button
              className={`continue-button ${file ? "enabled" : "disabled"}`}
              onClick={handleContinue}
              disabled={!file}
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .upload-resume-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .upload-container {
          width: 100%;
          max-width: 600px;
        }

        .progress-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #2563eb, #06b6d4);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .progress-text {
          font-size: 0.875rem;
          color: #64748b;
        }

        .upload-content {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          animation: fadeInUp 0.6s ease-out;
        }

        .upload-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: #0f172a;
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .upload-subtitle {
          color: #64748b;
          font-size: 1.5rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .file-upload-area {
          border: 2px dashed #e2e8f0;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          margin-bottom: 2rem;
        }

        .file-upload-area:hover {
          border-color: #2563eb;
          background: rgba(37, 99, 235, 0.05);
        }

        .file-upload-area.drag-active {
          border-color: #2563eb;
          background: rgba(37, 99, 235, 0.1);
        }

        .file-upload-area.has-file {
          border-color: #2563eb;
          background: rgba(37, 99, 235, 0.05);
        }

        .upload-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
        }

        .file-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .file-preview {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 8px;
        }

        .file-icon {
          font-size: 2rem;
          margin-right: 1.5rem;
        }

        .file-info {
          flex: 1;
          text-align: left;
        }

        .file-name {
          display: block;
          font-weight: 500;
          color: #0f172a;
        }

        .file-size {
          font-size: 0.875rem;
          color: #64748b;
        }

        .remove-file {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #64748b;
          cursor: pointer;
          padding: 0.5rem;
        }

        .upload-actions {
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

        .continue-button {
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

        .continue-button.enabled:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .continue-button.disabled {
          background: #94a3b8;
          cursor: not-allowed;
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
          .upload-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
