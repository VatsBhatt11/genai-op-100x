"use client"

const AnimatedIllustration = () => {
  return (
    <div className="illustration-container">
      <div className="illustration animate-fade-in delay-200">
        <div className="floating-elements">
          <div className="element element-1 animate-float delay-100">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="25" fill="url(#grad1)" opacity="0.1" />
              <circle cx="30" cy="30" r="15" fill="url(#grad1)" opacity="0.2" />
              <path
                d="M25 30L28 33L35 26"
                stroke="var(--color-primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-primary)" />
                  <stop offset="100%" stopColor="var(--color-accent)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="element element-2 animate-float delay-300">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect x="10" y="10" width="60" height="60" rx="12" fill="url(#grad2)" opacity="0.1" />
              <rect x="20" y="20" width="40" height="40" rx="8" fill="url(#grad2)" opacity="0.2" />
              <path
                d="M35 40H45M35 45H50M35 35H40"
                stroke="var(--color-accent)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="30" cy="42" r="5" fill="var(--color-accent)" opacity="0.3" />
              <defs>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-accent)" />
                  <stop offset="100%" stopColor="var(--color-primary)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="element element-3 animate-float delay-500">
            <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
              <polygon points="35,5 50,25 35,45 20,25" fill="url(#grad3)" opacity="0.15" />
              <polygon points="35,15 42,28 35,35 28,28" fill="url(#grad3)" opacity="0.3" />
              <path
                d="M30 30L35 35L40 30"
                stroke="var(--color-primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-primary)" />
                  <stop offset="100%" stopColor="var(--color-accent)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="main-graphic">
          <div className="graphic-card animate-scale-in delay-400">
            <div className="card-header">
              <div className="avatar"></div>
              <div className="info">
                <div className="name-bar"></div>
                <div className="role-bar"></div>
              </div>
              <div className="match-score animate-pulse delay-600">
                <span>98%</span>
              </div>
            </div>
            <div className="card-content">
              <div className="skill-tags">
                <div className="tag tag-1"></div>
                <div className="tag tag-2"></div>
                <div className="tag tag-3"></div>
              </div>
              <div className="progress-bars">
                <div className="progress-item">
                  <div className="progress-bar">
                    <div className="progress-fill progress-1"></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="progress-bar">
                    <div className="progress-fill progress-2"></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="progress-bar">
                    <div className="progress-fill progress-3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .illustration-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: var(--spacing-xl) 0;
          min-height: 400px;
        }
        
        .illustration {
          position: relative;
          width: 100%;
          max-width: 500px;
          height: 350px;
          opacity: 0;
        }
        
        .floating-elements {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        
        .element {
          position: absolute;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }
        
        .element-1 {
          top: 20px;
          right: 80px;
        }
        
        .element-2 {
          top: 120px;
          left: 40px;
        }
        
        .element-3 {
          bottom: 50px;
          right: 60px;
        }
        
        .main-graphic {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        
        .graphic-card {
          width: 280px;
          height: 200px;
          background: var(--bg-card);
          border-radius: var(--radius-xl);
          padding: var(--spacing-lg);
          box-shadow: var(--shadow-xl);
          opacity: 0;
        }
        
        .card-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
        }
        
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
        }
        
        .info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .name-bar {
          height: 12px;
          width: 120px;
          background: #e2e8f0;
          border-radius: 6px;
        }
        
        .role-bar {
          height: 10px;
          width: 80px;
          background: #f1f5f9;
          border-radius: 5px;
        }
        
        .match-score {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: var(--fw-bold);
          font-size: var(--fs-sm);
        }
        
        .card-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .skill-tags {
          display: flex;
          gap: var(--spacing-sm);
        }
        
        .tag {
          height: 20px;
          border-radius: 10px;
          background: var(--bg-light);
        }
        
        .tag-1 { width: 60px; }
        .tag-2 { width: 45px; }
        .tag-3 { width: 55px; }
        
        .progress-bars {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .progress-bar {
          height: 6px;
          background: #f1f5f9;
          border-radius: 3px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
          animation: progressFill 2s ease-out forwards;
          animation-delay: 1s;
          width: 0;
        }
        
        .progress-1 { animation-delay: 1.2s; }
        .progress-2 { animation-delay: 1.4s; }
        .progress-3 { animation-delay: 1.6s; }
        
        @keyframes progressFill {
          0% { width: 0; }
          100% { 
            width: var(--target-width, 85%);
          }
        }
        
        .progress-1 { --target-width: 90%; }
        .progress-2 { --target-width: 75%; }
        .progress-3 { --target-width: 95%; }
        
        @media (max-width: 768px) {
          .illustration-container {
            min-height: 300px;
            padding: var(--spacing-lg) 0;
          }
          
          .illustration {
            height: 280px;
            max-width: 400px;
          }
          
          .graphic-card {
            width: 240px;
            height: 180px;
            padding: var(--spacing-md);
          }
          
          .element-1 { top: 10px; right: 20px; }
          .element-2 { top: 100px; left: 10px; }
          .element-3 { bottom: 30px; right: 20px; }
        }
      `}</style>
    </div>
  )
}

export default AnimatedIllustration
