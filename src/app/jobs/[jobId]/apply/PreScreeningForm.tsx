"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PreScreeningFormProps {
  jobId: string;
  outreachId: string;
}

export default function PreScreeningForm({ jobId, outreachId }: PreScreeningFormProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = [
    {
      id: "experience",
      question: "Tell us about your relevant experience for this role.",
      placeholder: "Share your experience that makes you a good fit for this position...",
    },
    {
      id: "motivation",
      question: "Why are you interested in this position?",
      placeholder: "Explain what attracts you to this role and company...",
    },
    {
      id: "skills",
      question: "What skills do you bring to the table?",
      placeholder: "List your key skills and how they apply to this role...",
    },
    {
      id: "challenges",
      question: "Describe a challenging project you worked on and how you handled it.",
      placeholder: "Share a specific example of a challenge you faced and how you overcame it...",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/candidate/pre-screening", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId,
          outreachId,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      router.push("/jobs");
      router.refresh();
    } catch (error) {
      // console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pre-screening-form">
      {questions.map((q) => (
        <div key={q.id} className="question-group">
          <label htmlFor={q.id} className="question-label">
            {q.question}
          </label>
          <textarea
            id={q.id}
            value={answers[q.id] || ""}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
            }
            placeholder={q.placeholder}
            required
            className="answer-textarea"
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={isSubmitting}
        className="submit-button"
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </button>

      <style jsx>{`
        .pre-screening-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .question-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .question-label {
          font-size: 1.125rem;
          font-weight: 500;
          color: #2d3748;
        }

        .answer-textarea {
          width: 100%;
          min-height: 120px;
          padding: 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          color: #4a5568;
          resize: vertical;
          transition: border-color 0.2s ease;
        }

        .answer-textarea:focus {
          outline: none;
          border-color: #4299e1;
        }

        .answer-textarea::placeholder {
          color: #a0aec0;
        }

        .submit-button {
          margin-top: 1rem;
          padding: 1rem;
          background: linear-gradient(135deg, #4299e1 0%, #2b6cb0 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .submit-button:hover:not(:disabled) {
          opacity: 0.9;
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
} 