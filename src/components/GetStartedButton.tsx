"use client"
import { useRouter } from "next/navigation"

const GetStartedButton = () => {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/signup")
  }

  const handleWatchDemo = () => {
    console.log("Demo functionality to be implemented")
  }

  return (
    <div className="button-container">
      <button className="btn btn-primary get-started-btn animate-scale-in delay-500" onClick={handleGetStarted}>
        <span>Get Started Free</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7.5 15L12.5 10L7.5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="secondary-actions animate-fade-in delay-600">
        <button className="btn btn-secondary demo-btn" onClick={handleWatchDemo}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="5,3 13,8 5,13" fill="currentColor" />
          </svg>
          <span>Watch Demo</span>
        </button>

        <a href="#features" className="learn-more-link">
          Learn More
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 12L8 4M4 8L8 4L12 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      <style jsx>{`
        .button-container {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-lg);
        }
        
        .get-started-btn {
          font-size: var(--fs-lg);
          padding: 1rem 2rem;
          border-radius: var(--radius-lg);
          font-weight: var(--fw-medium);
          opacity: 0;
          transform: scale(0.9);
        }
        
        .get-started-btn:hover {
          transform: translateY(-3px) scale(1.02);
        }
        
        .get-started-btn:active {
          transform: translateY(-1px) scale(1);
        }
        
        .secondary-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-xl);
          opacity: 0;
        }
        
        .demo-btn {
          font-size: var(--fs-base);
          padding: 0.75rem 1.5rem;
        }
        
        .learn-more-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: var(--fw-medium);
          transition: all 0.3s ease;
          position: relative;
        }
        
        .learn-more-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--color-primary);
          transition: width 0.3s ease;
        }
        
        .learn-more-link:hover {
          color: var(--color-primary);
          transform: translateY(-1px);
        }
        
        .learn-more-link:hover::after {
          width: 100%;
        }
        
        .learn-more-link svg {
          transition: transform 0.3s ease;
        }
        
        .learn-more-link:hover svg {
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .secondary-actions {
            flex-direction: column;
            gap: var(--spacing-md);
          }
          
          .get-started-btn {
            font-size: var(--fs-base);
            padding: 0.875rem 1.75rem;
          }
        }
        
        @media (max-width: 480px) {
          .secondary-actions {
            gap: var(--spacing-sm);
          }
        }
      `}</style>
    </div>
  )
}

export default GetStartedButton
