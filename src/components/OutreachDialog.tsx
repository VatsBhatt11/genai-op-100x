import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import '@/styles/design-system.css';

interface PreScreeningQuestion {
  id: string;
  question: string;
}

interface OutreachDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string, jobId?: string) => Promise<void>;
  selectedCount?: number;
  searchQuery?: string;
  isLoading?: boolean;
  jobId?: string;
}

export function OutreachDialog({
  isOpen,
  onClose,
  onSend,
  selectedCount = 1,
  searchQuery = '',
  isLoading = false,
  jobId,
}: OutreachDialogProps) {
  const [message, setMessage] = useState('');
  const [questions, setQuestions] = useState<PreScreeningQuestion[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAIMessage = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-outreach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: `Search query: ${searchQuery}\nNumber of candidates: ${selectedCount}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
      }
    } catch (error) {
      // console.error('Failed to generate message:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAIQuestions = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: message }),
      });
      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      // console.error('Failed to generate questions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, { id: Date.now().toString(), question: newQuestion.trim() }]);
      setNewQuestion('');
    }
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    await onSend(message, jobId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="outreach-dialog">
        <DialogHeader>
          <DialogTitle className="dialog-title">
            {selectedCount > 1
              ? `Send Outreach to ${selectedCount} Candidates`
              : 'Send Outreach Message'}
          </DialogTitle>
        </DialogHeader>

        <div className="dialog-content">
          <div className="message-section">
            <div className="section-header">
              <Label htmlFor="message">Message</Label>
              <Button
                className="ai-button"
                onClick={generateAIMessage}
                disabled={isGenerating}
              >
                <Sparkles />
                <span>Generate with AI</span>
              </Button>
            </div>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your outreach message..."
              className="message-textarea"
            />
          </div>

          <div className="questions-section">
            <div className="section-header">
              <Label>Pre-screening Questions</Label>
              <Button
                className="ai-button"
                onClick={generateAIQuestions}
                disabled={isGenerating || !message}
              >
                <Sparkles />
                <span>Generate Questions</span>
              </Button>
            </div>

            <div className="questions-container">
              <div className="question-input-group">
                <Input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Add a pre-screening question..."
                  onKeyPress={(e) => e.key === 'Enter' && addQuestion()}
                  className="question-input"
                />
                <Button onClick={addQuestion} className="add-question-button">
                  Add
                </Button>
              </div>

              <ScrollArea className="questions-list">
                <div className="questions-scroll">
                  {questions.map((q) => (
                    <div key={q.id} className="question-item">
                      <span className="question-text">{q.question}</span>
                      <Button
                        className="remove-question-button"
                        onClick={() => removeQuestion(q.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        <DialogFooter className="dialog-footer">
          <Button className="cancel-button" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="send-button"
            onClick={handleSend} 
            disabled={isLoading || !message.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              'Send Message'
            )}
          </Button>
        </DialogFooter>

        <style jsx>{`
          .outreach-dialog {
            max-width: 42rem;
            animation: slideUp var(--transition-normal);
          }

          .dialog-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--foreground);
            margin-bottom: var(--spacing-md);
          }

          .dialog-content {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-lg);
            padding: var(--spacing-md) 0;
          }

          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--spacing-sm);
          }

          .ai-button {
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
            background-color: transparent;
            color: var(--foreground);
            padding: var(--spacing-xs) var(--spacing-sm);
            border-radius: var(--radius-md);
            transition: all var(--transition-normal);
          }

          .ai-button:hover:not(:disabled) {
            background-color: var(--muted-background);
            transform: translateY(-1px);
          }

          .message-textarea {
            min-height: 150px;
            resize: vertical;
            transition: border-color var(--transition-normal);
          }

          .message-textarea:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
          }

          .questions-container {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-sm);
          }

          .question-input-group {
            display: flex;
            gap: var(--spacing-sm);
          }

          .question-input {
            flex: 1;
          }

          .add-question-button {
            white-space: nowrap;
          }

          .questions-list {
            height: 200px;
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            padding: var(--spacing-sm);
          }

          .questions-scroll {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-sm);
          }

          .question-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-sm);
            background-color: var(--muted-background);
            border-radius: var(--radius-md);
            transition: background-color var(--transition-normal);
          }

          .question-item:hover {
            background-color: var(--border);
          }

          .question-text {
            font-size: 0.875rem;
            color: var(--foreground);
          }

          .remove-question-button {
            background-color: transparent;
            color: var(--muted);
            padding: var(--spacing-xs);
            border-radius: var(--radius-full);
            transition: all var(--transition-normal);
          }

          .remove-question-button:hover {
            color: var(--error);
            background-color: rgba(239, 68, 68, 0.1);
          }

          .dialog-footer {
            display: flex;
            justify-content: flex-end;
            gap: var(--spacing-sm);
            margin-top: var(--spacing-md);
          }

          .cancel-button {
            background-color: var(--muted-background);
            color: var(--foreground);
          }

          .cancel-button:hover {
            background-color: var(--border);
          }

          .send-button {
            background-color: var(--primary);
            color: white;
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
          }

          .send-button:hover:not(:disabled) {
            background-color: var(--primary-hover);
            transform: translateY(-1px);
          }

          .send-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}