"use client";

import { Bell } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  userType: 'candidate' | 'employer';
}

export function Navbar({ userType }: NavbarProps) {


  const getDashboardPath = () => userType === 'candidate' ? '/dashboard' : '/company/dashboard';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link href={getDashboardPath()}>
          <h1 className="logo">
            HireAI
            </h1>
          </Link>
        </div>

        <div className="navbar-right">
          <div className="notifications-wrapper">
            <Link href="/notifications">  
              <button className="notifications-button">
                <Bell size={20} />
              </button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }

        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
        }

        .navbar-left {
          display: flex;
          align-items: center;
        }

        .logo {
          font-size: 2.25rem;
          font-weight: 800;
          color: #1a1a1a;
          text-decoration: none;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }

        .navbar-center {
          display: flex;
          gap: 2.5rem;
        }

        .nav-link {
          font-size: 1.125rem;
          font-weight: 600;
          color: #2d3748;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          color: #6366f1;
          background: rgba(99, 102, 241, 0.1);
        }

        .nav-link.active {
          color: #6366f1;
          background: rgba(99, 102, 241, 0.1);
        }

        .navbar-right {
          display: flex;
          align-items: center;
        }

        .notifications-wrapper {
          position: relative;
        }

        .notifications-button {
          background: none;
          border: none;
          padding: 0.5rem;
          cursor: pointer;
          color: #2d3748;
          position: relative;
          transition: all 0.3s ease;
        }

        .notifications-button:hover {
          color: #6366f1;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .navbar-container {
            padding: 0 1rem;
          }

          .navbar-center {
            gap: 1rem;
          }

          .nav-link {
            padding: 0.5rem;
            font-size: 1rem;
          }

          .logo {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </nav>
  );
} 