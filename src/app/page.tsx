"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            HireAI
          </h1>
          <h2 style={{ color: "#6366f1",marginBottom:"1rem" }}>
            AI-Powered Hiring Copilot
          </h2>
          <p className="hero-subtitle">
            Transform your hiring process with our intelligent copilot. Find specialized talent, screen candidates, and launch personalized outreach - all in plain English.
          </p>
          <div className="hero-actions">
            <Link href="/signup" className="btn btn-primary">
              Start Hiring
            </Link>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3 className="feature-title">Easy Search</h3>
          <p className="feature-description">
            Simply describe your ideal candidate in plain English. Our AI understands complex requirements and finds the perfect match.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3 className="feature-title">60-Days to 60-Minutes</h3>
          <p className="feature-description">
            Reduce time-to-hire from months to minutes. Our AI instantly ranks and screens candidates, eliminating manual processes.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3 className="feature-title">Bias-Free Matching</h3>
          <p className="feature-description">
            Our AI focuses on skills and experience, ensuring fair and objective candidate selection while maintaining diversity.
          </p>
        </div>
      </div>

      <style jsx>{`
        .home-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f6f8fc 0%, #f1f4f9 100%);
          padding: 2rem;
        }

        .hero-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          margin-bottom: 4rem;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #2d3748;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .btn {
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.9);
          color: #6366f1;
          border: 2px solid #6366f1;
        }

        .btn-secondary:hover {
          background: #6366f1;
          color: white;
          transform: translateY(-2px);
        }

        .features-section {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          padding: 2rem;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 2px solid transparent;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          border-color: #6366f1;
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .feature-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .feature-description {
          color: #2d3748;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .home-container {
            padding: 1rem;
          }

          .hero-section {
            padding: 2rem 1rem;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.125rem;
          }

          .hero-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
            text-align: center;
          }

          .features-section {
            grid-template-columns: 1fr;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
