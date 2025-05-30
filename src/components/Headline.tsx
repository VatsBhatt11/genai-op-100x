"use client"

const Headline = () => {
  return (
    <div className="headline-container">
      <h1 className="headline animate-fade-in-up delay-300">
        Find Your Perfect
        <span className="highlight"> Career Match</span>
        <br />
        with AI-Powered Precision
      </h1>

      <style jsx>{`
        .headline-container {
          text-align: center;
          margin: var(--spacing-lg) 0;
        }
        
        .headline {
          font-size: var(--fs-2xl);
          font-weight: var(--fw-bold);
          line-height: var(--lh-heading);
          color: var(--text-primary);
          margin: 0;
          opacity: 0;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .highlight {
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
        }
        
        .highlight::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          border-radius: 2px;
          opacity: 0.3;
        }
        
        @media (max-width: 768px) {
          .headline {
            font-size: var(--fs-xl);
            line-height: 1.3;
          }
        }
        
        @media (max-width: 480px) {
          .headline {
            font-size: var(--fs-lg);
          }
        }
      `}</style>
    </div>
  )
}

export default Headline
