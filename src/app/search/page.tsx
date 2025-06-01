'use client';

import { useState } from 'react';
import { NaturalLanguageSearch } from '@/components/NaturalLanguageSearch';
import { CandidateProfileCard } from '@/components/CandidateProfileCard';
import { OutreachDialog } from '@/components/OutreachDialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface SearchResult {
  profile: any;
  matchScore: number;
  matchDetails: {
    matchingSkills: string[];
    locationMatch: boolean;
    experienceMatch: boolean;
    employmentTypeMatch: boolean;
  };
}

export default function SearchPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [isOutreachOpen, setIsOutreachOpen] = useState(false);
  const [outreachTarget, setOutreachTarget] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setResults(data);
      setSearchQuery(query);
    } catch (error) {
      // console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSelect = (id: string) => {
    setSelectedProfiles(prev => 
      prev.includes(id) 
        ? prev.filter(profileId => profileId !== id)
        : [...prev, id]
    );
  };

  const handleOutreach = (profileId: string) => {
    setOutreachTarget(profileId);
    setIsOutreachOpen(true);
  };

  const handleBulkOutreach = () => {
    setOutreachTarget(null);
    setIsOutreachOpen(true);
  };

  const handleSendOutreach = async (message: string) => {
    // Determine the target(s)
    const candidateIds = outreachTarget
      ? [outreachTarget]
      : selectedProfiles;

    if (candidateIds.length === 0) return;

    try {
      const response = await fetch('/api/outreach/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateIds,
          message,
          query: searchQuery || "Looking for candidates",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: `Outreach messages sent successfully to ${data.sentCount} candidates`,
        });
        setSelectedProfiles([]);
        setIsOutreachOpen(false);
        setOutreachTarget(null);
      } else {
        throw new Error('Failed to send outreach');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send outreach messages",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="search-page">
      <NaturalLanguageSearch
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      {results.length > 0 && (
        <div className="results-section animate-fade-in">
          <div className="results-header">
            <h2 className="results-title">
              {results.length} Matching Candidates
            </h2>
            {selectedProfiles.length > 0 && (
              <Button 
                className="bulk-outreach-button"
                onClick={handleBulkOutreach}
              >
                Contact {selectedProfiles.length} Selected
              </Button>
            )}
          </div>

          <div className="results-grid">
            {results.map((result) => (
              <CandidateProfileCard
                key={result.profile.id}
                profile={result.profile}
                matchScore={result.matchScore}
                matchDetails={result.matchDetails}
                onOutreach={handleOutreach}
                isSelected={selectedProfiles.includes(result.profile.id)}
                onSelect={handleProfileSelect}
              />
            ))}
          </div>
        </div>
      )}

      <OutreachDialog
        isOpen={isOutreachOpen}
        onClose={() => {
          setIsOutreachOpen(false);
          setOutreachTarget(null);
        }}
        onSend={handleSendOutreach}
        selectedCount={outreachTarget ? 1 : selectedProfiles.length}
        searchQuery={searchQuery}
      />

      <style jsx>{`
        .search-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--spacing-xl) var(--spacing-md);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
        }

        .results-section {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          animation: slideUp var(--transition-normal);
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .results-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--foreground);
          margin: 0;
        }

        .bulk-outreach-button {
          background-color: var(--primary);
          color: white;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          transition: all var(--transition-normal);
        }

        .bulk-outreach-button:hover {
          background-color: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .results-grid {
          display: grid;
          gap: var(--spacing-md);
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }

        @media (max-width: 768px) {
          .results-grid {
            grid-template-columns: 1fr;
          }

          .results-header {
            flex-direction: column;
            gap: var(--spacing-sm);
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
} 