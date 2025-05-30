"use client"

import Logo from "../components/Logo"
import AnimatedIllustration from "../components/AnimatedIllustration"
import Headline from "../components/Headline"
import Subhead from "../components/Subhead"
import GetStartedButton from "../components/GetStartedButton"

export default function HomePage() {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <Logo />
            <AnimatedIllustration />
            <Headline />
            <Subhead />
            <GetStartedButton />
          </div>
        </div>

        {/* Background Elements */}
        <div className="bg-elements">
          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
          <div className="bg-circle bg-circle-3"></div>
        </div>
      </div>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }
        
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%);
        }
        
        .hero-content {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--spacing-xl) 0;
          position: relative;
          z-index: 2;
        }
        
        .bg-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        
        .bg-circle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          opacity: 0.03;
          animation: float 6s ease-in-out infinite;
        }
        
        .bg-circle-1 {
          width: 300px;
          height: 300px;
          top: 10%;
          right: -150px;
          animation-delay: 0s;
        }
        
        .bg-circle-2 {
          width: 200px;
          height: 200px;
          bottom: 20%;
          left: -100px;
          animation-delay: 2s;
        }
        
        .bg-circle-3 {
          width: 150px;
          height: 150px;
          top: 60%;
          right: 10%;
          animation-delay: 4s;
        }
        
        @media (max-width: 768px) {
          .hero-content {
            padding: var(--spacing-lg) 0;
          }
          
          .bg-circle-1 {
            width: 200px;
            height: 200px;
            right: -100px;
          }
          
          .bg-circle-2 {
            width: 150px;
            height: 150px;
            left: -75px;
          }
          
          .bg-circle-3 {
            width: 100px;
            height: 100px;
          }
        }
      `}</style>
    </div>
  )
}
