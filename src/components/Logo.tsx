"use client"

const Logo = () => {
  return (
    <div className="logo-container">
      <div className="logo animate-scale-in">
        <div className="logo-icon">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="url(#gradient)" />
            <path d="M12 15L20 23L28 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M12 25L20 17L28 25"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.7"
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--color-primary)" />
                <stop offset="1" stopColor="var(--color-accent)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="logo-text">
          <span className="logo-name">JobMatch</span>
          <span className="logo-tagline">AI</span>
        </div>
      </div>

      <style jsx>{`
        .logo-container {
          padding: var(--spacing-md) 0;
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          opacity: 0;
        }
        
        .logo-icon {
          transition: transform 0.3s ease;
        }
        
        .logo:hover .logo-icon {
          transform: rotate(5deg) scale(1.05);
        }
        
        .logo-text {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }
        
        .logo-name {
          font-size: var(--fs-lg);
          font-weight: var(--fw-bold);
          color: var(--text-primary);
          letter-spacing: -0.025em;
        }
        
        .logo-tagline {
          font-size: var(--fs-sm);
          font-weight: var(--fw-medium);
          color: var(--color-primary);
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        @media (max-width: 768px) {
          .logo-name {
            font-size: var(--fs-md);
          }
        }
      `}</style>
    </div>
  )
}

export default Logo
