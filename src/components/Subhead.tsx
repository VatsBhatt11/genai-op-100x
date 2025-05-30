"use client"

const Subhead = () => {
  return (
    <div className="subhead-container">
      <p className="subhead animate-fade-in-up delay-400">
        Connect talented professionals with their dream jobs using advanced AI matching algorithms. Get personalized
        recommendations, skill assessments, and career insights that matter.
      </p>

      <style jsx>{`
        .subhead-container {
          text-align: center;
          margin: var(--spacing-md) auto var(--spacing-xl);
          max-width: 600px;
        }
        
        .subhead {
          font-size: var(--fs-lg);
          line-height: var(--lh-body);
          color: var(--text-secondary);
          margin: 0;
          opacity: 0;
        }
        
        @media (max-width: 768px) {
          .subhead-container {
            margin: var(--spacing-md) auto var(--spacing-lg);
            max-width: 500px;
          }
          
          .subhead {
            font-size: var(--fs-base);
          }
        }
        
        @media (max-width: 480px) {
          .subhead {
            font-size: var(--fs-sm);
          }
        }
      `}</style>
    </div>
  )
}

export default Subhead
