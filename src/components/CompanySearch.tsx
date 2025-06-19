import { useState } from 'react';
import { Search, Send, MessageSquare, Plus, Check, Phone, X } from 'lucide-react';

import { CandidateProfileCard } from './CandidateProfileCard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

import { useToast } from './ui/use-toast';

import styles from "@/app/company/dashboard/CompanySearch.module.css";

interface SearchResult {
  profile: {
    id: string;
    fullName: string;
    skills: string[];
    experience: string;
    location: string;
    education: any[];
    certifications: any[];
    contact: any;
    user: {
      email: string;
    };
    phoneNumber?: string;
  };
  matchScore: number;
  matchDetails: any;
}

export function CompanySearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProfiles, setSelectedProfiles] = useState<Set<string>>(new Set());
  const [showOutreach, setShowOutreach] = useState(false);
  const [showPreScreening, setShowPreScreening] = useState(false);
  const [preScreeningQuestions, setPreScreeningQuestions] = useState<string[]>([]);
  const [outreachMessage, setOutreachMessage] = useState('');
  const [outreachSubject, setOutreachSubject] = useState('');
  const [sendingOutreach, setSendingOutreach] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      
      const data = await response.json();
      setResults(data);
      setShowOutreach(data.length > 0);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform search",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleProfileSelection = (profileId: string) => {
    const newSelection = new Set(selectedProfiles);
    if (newSelection.has(profileId)) {
      newSelection.delete(profileId);
    } else {
      newSelection.add(profileId);
    }
    setSelectedProfiles(newSelection);
  };



  const addPreScreeningQuestion = () => {
    setPreScreeningQuestions([...preScreeningQuestions, '']);
  };

  const updatePreScreeningQuestion = (index: number, value: string) => {
    const newQuestions = [...preScreeningQuestions];
    newQuestions[index] = value;
    setPreScreeningQuestions(newQuestions);
  };

  const getSelectedProfilesWithPhone = () => {
    return results.filter(r => selectedProfiles.has(r.profile.id))
      .map(r => ({
        id: r.profile.id,
        fullName: r.profile.fullName,
        email: r.profile.user.email,
        phoneNumber: r.profile.phoneNumber,
      }));
  };

  const handleSendOutreach = async () => {
    setSendingOutreach(true);
    try {
      if (outreachMessage.trim() === '' || outreachSubject.trim() === '') {
        toast({
          title: "Missing Information",
          description: "Please provide both a subject and a message for the outreach.",
          variant: "destructive",
        });
        setSendingOutreach(false);
        return;
      }

      const selectedCandidates = results.filter(r => selectedProfiles.has(r.profile.id));

      if (selectedCandidates.length === 0) {
        toast({
          title: "No candidates selected",
          description: "Please select at least one candidate to send outreach.",
          variant: "destructive",
        });
        setSendingOutreach(false);
        return;
      }

      let successfulSends = 0;
      for (const candidate of selectedCandidates) {
        try {
          const response = await fetch('/api/outreach/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              candidateId: candidate.profile.id,
              subject: outreachSubject,
              message: outreachMessage,
              query: query,
            }),
          });

          if (response.ok) {
            successfulSends++;
          } else {
            const errorData = await response.json();
            console.error(`Failed to send outreach to ${candidate.profile.fullName}:`, errorData);
            toast({
              title: `Error sending to ${candidate.profile.fullName}`,
              description: errorData.error || "An unknown error occurred.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error(`Failed to send outreach to ${candidate.profile.fullName}:`, error);
          toast({
            title: `Error sending to ${candidate.profile.fullName}`,
            description: "An unexpected error occurred.",
            variant: "destructive",
          });
        }
      }

      if (successfulSends > 0) {
        toast({
          title: "Outreach Sent",
          description: `Outreach sent to ${successfulSends} of ${selectedCandidates.length} candidates.`, 
        });
        setOutreachMessage('');
        setOutreachSubject('');
        setSelectedProfiles(new Set());
      } else {
        toast({
          title: "Outreach Failed",
          description: "No outreach messages were sent successfully.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to send outreach:", error);
      toast({
        title: "Error",
        description: "Failed to send outreach.",
        variant: "destructive",
      });
    } finally {
      setSendingOutreach(false);
    }
  };

  const savePreScreeningQuestions = async () => {
    try {
      const response = await fetch('/api/pre-screening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: preScreeningQuestions }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Pre-screening questions saved successfully",
        });
        setShowPreScreening(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save pre-screening questions",
        variant: "destructive",
      });
    }
  };



  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.searchInputWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            id="search-query"
            name="searchQuery"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search candidates by skills, location, or title..."
            className={styles.searchInput}
          />
          {query && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setQuery('');
              }}
              className={styles.clearButton}
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button
          type="submit"
          className={styles.searchButton}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {showOutreach && (
          <div className={styles.outreachContainer}>
            <div className={styles.outreachCard}>
              <div className={styles.outreachHeader}>
                <h3>Outreach Message</h3>
              </div>
              <input
                type="text"
                id="outreach-subject"
                name="outreachSubject"
                value={outreachSubject}
                onChange={(e) => setOutreachSubject(e.target.value)}
                placeholder="Subject of the outreach message"
                className={styles.outreachInput}
              />
              <textarea
                id="outreach-message"
                name="outreachMessage"
                value={outreachMessage}
                onChange={(e) => setOutreachMessage(e.target.value)}
                placeholder="Write your outreach message here..."
                className={styles.outreachTextarea}
              />
              <button 
                disabled={selectedProfiles.size === 0 || sendingOutreach || outreachMessage.trim() === '' || outreachSubject.trim() === ''}
                onClick={handleSendOutreach}
                className={styles.outreachButton}
              >
                {sendingOutreach ? 'Sending...' : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Outreach to {selectedProfiles.size} Candidates
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      <div className={styles.resultsGrid}>
          {results.map((result, index) => (
            <div
              key={`${result.profile.id}-${index}`}
              className={styles.profileCardWrapper}
            >
              <CandidateProfileCard 
                profile={result.profile} 
                matchScore={result.matchScore}
                onSelect={toggleProfileSelection}
                isSelected={selectedProfiles.has(result.profile.id)}
              />
            </div>
          ))}
      </div>
    </div>
  );
}