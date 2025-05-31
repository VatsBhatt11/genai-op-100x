import { useState } from 'react';
import { Search, Send, MessageSquare, Plus, Check, Phone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CandidateProfileCard } from './CandidateProfileCard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { useToast } from './ui/use-toast';
import { Badge } from './ui/badge';
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
  const [outreachMessage, setOutreachMessage] = useState('');
  const [showPreScreening, setShowPreScreening] = useState(false);
  const [preScreeningQuestions, setPreScreeningQuestions] = useState<string[]>([]);
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

  const handleSendOutreach = async () => {
    if (selectedProfiles.size === 0) return;

    setSendingOutreach(true);
    try {
      const response = await fetch('/api/outreach/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateIds: Array.from(selectedProfiles),
          subject: "New Job Opportunity",
          message: outreachMessage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: `Outreach messages sent successfully to ${data.sentCount} candidates`,
        });
        setSelectedProfiles(new Set());
        setOutreachMessage('');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send outreach messages",
        variant: "destructive",
      });
    } finally {
      setSendingOutreach(false);
    }
  };

  const addPreScreeningQuestion = () => {
    setPreScreeningQuestions([...preScreeningQuestions, '']);
  };

  const updatePreScreeningQuestion = (index: number, value: string) => {
    const newQuestions = [...preScreeningQuestions];
    newQuestions[index] = value;
    setPreScreeningQuestions(newQuestions);
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

  const getSelectedProfilesWithPhone = () => {
    return results.filter(result => 
      selectedProfiles.has(result.profile.id) && result.profile.phoneNumber
    );
  };

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <motion.div 
          className={styles.searchInputWrapper}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Search className={styles.searchIcon} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search candidates by skills, location, or title..."
            className={styles.searchInput}
          />
          {query && (
            <motion.button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setQuery('');
              }}
              className={styles.clearButton}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={16} />
            </motion.button>
          )}
        </motion.div>
        <motion.button
          type="submit"
          className={styles.searchButton}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </motion.button>
      </form>

      <AnimatePresence>
        {showOutreach && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={styles.outreachContainer}
          >
            <Card className={styles.outreachCard}>
              <div className={styles.outreachHeader}>
                <h3>Outreach Message</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreScreening(!showPreScreening)}
                  className={styles.prescreeningToggle}
                >
                  {showPreScreening ? 'Hide Pre-screening' : 'Show Pre-screening'}
                </Button>
              </div>
              <Textarea
                placeholder="Write your outreach message..."
                value={outreachMessage}
                onChange={(e) => setOutreachMessage(e.target.value)}
                className={styles.outreachTextarea}
              />
              <div className={styles.outreachFooter}>
                <div className={styles.whatsappStatus}>
                  <Phone className={styles.whatsappIcon} />
                  <span>
                    {getSelectedProfilesWithPhone().length} of {selectedProfiles.size} selected candidates have WhatsApp enabled
                  </span>
                </div>
                <Button
                  onClick={handleSendOutreach}
                  disabled={selectedProfiles.size === 0 || !outreachMessage.trim() || sendingOutreach}
                  className={styles.sendButton}
                >
                  <Send className={styles.sendIcon} />
                  {sendingOutreach ? 'Sending...' : `Send to ${selectedProfiles.size} candidates`}
                </Button>
              </div>
            </Card>

            {showPreScreening && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.prescreeningContainer}
              >
                <Card className={styles.prescreeningCard}>
                  <h3>Pre-screening Questions</h3>
                  {preScreeningQuestions.map((question, index) => (
                    <div key={index} className={styles.questionInputWrapper}>
                      <Input
                        value={question}
                        onChange={(e) => updatePreScreeningQuestion(index, e.target.value)}
                        placeholder={`Question ${index + 1}`}
                        className={styles.questionInput}
                      />
                    </div>
                  ))}
                  <div className={styles.prescreeningActions}>
                    <Button 
                      variant="outline" 
                      onClick={addPreScreeningQuestion}
                      className={styles.addQuestionButton}
                    >
                      <Plus className={styles.addIcon} />
                      Add Question
                    </Button>
                    <Button 
                      onClick={savePreScreeningQuestions}
                      className={styles.saveQuestionsButton}
                    >
                      Save Questions
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.resultsGrid}>
        <AnimatePresence>
          {results.map((result) => (
            <motion.div
              key={result.profile.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={styles.profileCardWrapper}
            >
              <CandidateProfileCard 
                profile={result.profile} 
                matchScore={result.matchScore}
                onSelect={toggleProfileSelection}
                isSelected={selectedProfiles.has(result.profile.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 