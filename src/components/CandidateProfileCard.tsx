import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Linkedin, Github, Check, Star } from 'lucide-react';

interface CandidateProfileCardProps {
  profile: {
    id: string;
    fullName: string;
    skills: string[];
    experience: string;
    location: string;
    education: any[];
    contact: any;
    user: {
      email: string;
    };
    phoneNumber?: string;
  };
  matchScore?: number;
  matchDetails?: {
    matchingSkills: string[];
    locationMatch: boolean;
    experienceMatch: boolean;
    employmentTypeMatch: boolean;
  };
  onSelect?: (id: string) => void;
  isSelected?: boolean;
  onOutreach?: (profile: any) => void;
}

export function CandidateProfileCard({ profile, matchScore, matchDetails, onSelect, isSelected }: CandidateProfileCardProps) {
  return (
    <div
      // initial={{ opacity: 0, y: 20 }}
      // animate={{ opacity: 1, y: 0 }}
      // exit={{ opacity: 0, y: -20 }}
      // whileHover={{ y: -5 }}
      className="candidate-card"
      onClick={() => onSelect?.(profile.id)}
    >
      <div className="card-header">
        <div className="profile-info">
          <div className="avatar">
            {profile.fullName
              .split(' ')
              .map(n => n[0])
              .join('')}
          </div>
          <div className="name-section">
            <h3>{profile.fullName}</h3>
            <p className="email">{profile.user.email}</p>
          </div>
        </div>
        {matchScore !== undefined && (
          <div className="match-score">
            <Star className="star-icon" />
            <span>{Math.round(matchScore)}%</span>
          </div>
        )}
      </div>

      <div className="card-content">
        <div className="skills-section">
          <h4>Skills</h4>
          <div className="skills-list">
            {profile.skills && profile.skills.length > 0 ? (
              <>
                {profile.skills.slice(0, 5).map((skill, index) => (
                  // <motion.span
                  <div
                    key={index}
                    // initial={{ opacity: 0, scale: 0.8 }}
                    // animate={{ opacity: 1, scale: 1 }}
                    // transition={{ delay: index * 0.05 }}
                    className="skill-tag"
                  >
                    {skill}
                  {/* </motion.span> */}
                  </div>
                ))}
                {profile.skills.length > 5 && (
                  <span className="more-skills">+{profile.skills.length - 5} more</span>
                )}
              </>
            ) : (
              <span className="no-skills">No skills listed</span>
            )}
          </div>
        </div>

        <div className="experience-section">
          <h4>Experience</h4>
          <p className="experience">{profile.experience}</p>
        </div>

        {profile.location || profile.phoneNumber && (
        <div className="contact-section">
        {profile.location && (
          <div className="contact-item">
            <MapPin className="contact-icon" />
            <span>{profile.location}</span>
          </div>
          )}
          {profile.phoneNumber && (
            <div className="contact-item">
              <Phone className="contact-icon" />
              <span>{profile.phoneNumber}</span>
            </div>
          )}
        </div>
        )}
      </div>

      <div className={`selection-indicator ${isSelected ? 'selected' : ''}`}>
        <Check />
      </div>

      <style jsx>{`
        .candidate-card {
          background: linear-gradient(145deg, #ffffff, #f8fafc);
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .candidate-card:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-color: #6366f1;
          transform: translateY(-4px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          padding-bottom: 1.25rem;
          border-bottom: 2px solid #f1f5f9;
          position: relative;
        }

        .profile-info {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          flex: 1;
          margin-right: 1rem;
        }

        .avatar {
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 1rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 600;
          flex-shrink: 0;
          box-shadow: 0 4px 6px -1px rgba(76, 175, 80, 0.2);
        }

        .name-section {
          flex: 1;
        }

        .name-section h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .email {
          color: #64748b;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .match-score {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 0.375rem 0.75rem;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.875rem;
          box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
          position: absolute;
          top: 0;
          right: 0;
        }

        .star-icon {
          width: 1rem;
          height: 1rem;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .skills-section h4,
        .experience-section h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }

        .skills-section {
          margin-bottom: 1rem;
        }

        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          min-height: 2rem;
        }

        .skill-tag {
          background: #f1f5f9;
          color: #6366f1;
          padding: 0.375rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
          border: 1px solid #e2e8f0;
          display: inline-block;
          white-space: nowrap;
        }

        .skill-tag:hover {
          background: #6366f1;
          color: white;
          transform: translateY(-2px);
          border-color: #6366f1;
        }

        .more-skills {
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.375rem 0.75rem;
          background: #f8fafc;
          border-radius: 9999px;
          border: 1px solid #e2e8f0;
          display: inline-block;
        }

        .no-skills {
          color: #94a3b8;
          font-size: 0.875rem;
          font-style: italic;
        }

        .experience {
          color: #475569;
          font-size: 0.875rem;
          line-height: 1.5;
          padding: 0.5rem;
          background: #f8fafc;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
        }

        .contact-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0.5rem;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #64748b;
          font-size: 0.875rem;
        }

        .contact-icon {
          width: 1rem;
          height: 1rem;
          color: #6366f1;
        }

        .selection-indicator {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          border: 2px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e2e8f0;
          transition: all 0.3s ease;
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          z-index: 10;
        }

        .selection-indicator.selected {
          background: #6366f1;
          border-color: #6366f1;
          color: white;
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .candidate-card {
            padding: 1.25rem;
          }

          .avatar {
            width: 3rem;
            height: 3rem;
            font-size: 1rem;
          }

          .name-section h3 {
            font-size: 1.125rem;
          }

          .skills-list {
            gap: 0.375rem;
          }

          .skill-tag {
            padding: 0.25rem 0.625rem;
            font-size: 0.75rem;
            color:black;
          }
        }
      `}</style>
    {/* </motion.div> */}
    </div>
  );
} 