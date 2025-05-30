"use client"

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <h1 className="error-code">404</h1>
          <h2 className="error-title">Page Not Found</h2>
          <p className="error-message">Sorry, we couldn't find the page you're looking for.</p>
          <Link href="/" className="home-link">
            Return to Home
          </Link>
        </div>
      </div>

      <style jsx>{`
        .not-found-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .not-found-container {
          text-align: center;
          max-width: 500px;
          width: 100%;
        }

        .not-found-content {
          background: white;
          padding: 3rem 2rem;
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          animation: fadeInUp 0.6s ease-out;
        }

        .error-code {
          font-size: 6rem;
          font-weight: 700;
          color: #2563eb;
          margin-bottom: 1rem;
          line-height: 1;
        }

        .error-title {
          font-size: 2rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 1rem;
        }

        .error-message {
          color: #64748b;
          font-size: 1.125rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .home-link {
          display: inline-block;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: white;
          text-decoration: none;
          padding: 0.875rem 2rem;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .home-link:hover {
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
          .error-code {
            font-size: 4rem;
          }

          .error-title {
            font-size: 1.5rem;
          }

          .not-found-content {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}
