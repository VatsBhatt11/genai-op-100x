"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadButton } from "@uploadthing/react";
import { toast } from "sonner";
import type { OurFileRouter } from "@/lib/uploadthing";
import type { User } from "@prisma/client";

interface UploadResumeClientProps {
  user: User & {
    candidateProfile: {
      id: string;
    } | null;
  } | null;
}

export default function UploadResumeClient({ user }: UploadResumeClientProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [parsingStage, setParsingStage] = useState<"idle" | "uploading" | "parsing" | "complete">("idle");
  const [isDragging, setIsDragging] = useState(false);

  const handleUploadComplete = async (res: { url: string }[]) => {
    if (!res?.[0]?.url) {
      toast.error("Failed to upload resume");
      return;
    }

    setIsUploading(true);
    setParsingStage("parsing");

    try {
      const response = await fetch("/api/resume/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeUrl: res[0].url,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to parse resume");
      }

      setParsingStage("complete");
      toast.success("Resume uploaded and parsed successfully!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
      setParsingStage("idle");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-card">
          <div className="upload-header">
            <h1>Upload Your Resume</h1>
            <p>Let's get your profile ready for amazing opportunities</p>
          </div>

          <div className="upload-content">
            <div 
              className={`upload-zone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="upload-icon">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div className="upload-text">
                <h3>Drop your resume here</h3>
                <p>or click to browse files</p>
              </div>
              <div className="upload-button-container">
                <UploadButton<OurFileRouter, "resumeUploader">
                  endpoint="resumeUploader"
                  onClientUploadComplete={handleUploadComplete}
                  onUploadError={(error: Error) => {
                    toast.error(`ERROR! ${error.message}`);
                  }}
                  className="upload-button"
                />
              </div>
              <p className="upload-info">Supported formats: PDF, DOC, DOCX</p>
            </div>

            {isUploading && (
              <div className="parsing-animation">
                <div className="parsing-stages">
                  <div className={`stage ${parsingStage === "uploading" ? "active" : ""}`}>
                    <div className="stage-icon">📤</div>
                    <div className="stage-text">Uploading</div>
                  </div>
                  <div className="stage-connector"></div>
                  <div className={`stage ${parsingStage === "parsing" ? "active" : ""}`}>
                    <div className="stage-icon">🔍</div>
                    <div className="stage-text">Analyzing</div>
                  </div>
                  <div className="stage-connector"></div>
                  <div className={`stage ${parsingStage === "complete" ? "active" : ""}`}>
                    <div className="stage-icon">✨</div>
                    <div className="stage-text">Complete</div>
                  </div>
                </div>
                <div className="parsing-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{
                        width: parsingStage === "uploading" ? "33%" : 
                               parsingStage === "parsing" ? "66%" : 
                               parsingStage === "complete" ? "100%" : "0%"
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .upload-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f6f8fc 0%, #f1f4f9 100%);
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        .upload-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          padding: 3rem;
        }

        .upload-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .upload-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 1rem 0;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .upload-header p {
          font-size: 1.125rem;
          color: #666;
          margin: 0;
        }

        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          position: relative;
        }

        .upload-zone {
          width: 100%;
          max-width: 500px;
          padding: 3rem;
          border: 2px dashed #e2e8f0;
          border-radius: 16px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          background: white;
        }

        .upload-zone:hover, .upload-zone.dragging {
          border-color: #6366f1;
          background: #f8fafc;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.1);
        }

        .upload-icon {
          color: #6366f1;
          margin-bottom: 1.5rem;
          transition: transform 0.3s ease;
        }

        .upload-zone:hover .upload-icon {
          transform: translateY(-5px);
        }

        .upload-text {
          margin-bottom: 1.5rem;
        }

        .upload-text h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 0.5rem 0;
        }

        .upload-text p {
          font-size: 1rem;
          color: #666;
          margin: 0;
        }

        .upload-button-container {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        :global(.upload-button) {
          width: 100%;
          height: 100%;
          opacity: 1;
          cursor: pointer;
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 1000;
          transform: translate(-50%, -50%);
        }

        .upload-info {
          margin-top: 1rem;
          font-size: 0.875rem;
          color: #666;
          padding: 0.5rem 1rem;
          background: #f8fafc;
          border-radius: 20px;
          display: inline-block;
        }

        .parsing-animation {
          width: 100%;
          max-width: 600px;
          margin-top: 2rem;
          position: relative;
          z-index: 1;
        }

        .parsing-stages {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .stage {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        .stage.active {
          opacity: 1;
        }

        .stage-icon {
          width: 48px;
          height: 48px;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .stage.active .stage-icon {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          transform: scale(1.1);
        }

        .stage-text {
          font-size: 0.875rem;
          font-weight: 500;
          color: #4a5568;
        }

        .stage-connector {
          flex: 1;
          height: 2px;
          background: #e2e8f0;
          margin: 0 1rem;
          position: relative;
          top: -12px;
        }

        .parsing-progress {
          padding: 0 1rem;
        }

        .progress-bar {
          height: 8px;
          background: #f1f5f9;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        @media (max-width: 640px) {
          .upload-page {
            padding: 1rem;
          }

          .upload-card {
            padding: 1.5rem;
          }

          .upload-header h1 {
            font-size: 2rem;
          }

          .upload-zone {
            padding: 2rem;
          }

          .stage-icon {
            width: 40px;
            height: 40px;
            font-size: 1.25rem;
          }

          .upload-text h3 {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </div>
  );
} 