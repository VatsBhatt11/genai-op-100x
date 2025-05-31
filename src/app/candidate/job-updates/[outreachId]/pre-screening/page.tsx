'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import styles from "./page.module.css";

interface PreScreeningData {
  id: string;
  questions: string[];
}

export default function PreScreeningPage({
  params,
}: {
  params: { outreachId: string };
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preScreening, setPreScreening] = useState<PreScreeningData | null>(null);

  // Fetch pre-screening questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/outreach/${params.outreachId}/pre-screening`);
        const data = await response.json();
        setPreScreening(data);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
        router.push('/dashboard');
      }
    };

    fetchQuestions();
  }, [params.outreachId, router]);

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/outreach/${params.outreachId}/pre-screening/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      if (response.ok) {
        router.push(`/candidate/job-updates/${params.outreachId}`);
      }
    } catch (error) {
      console.error('Failed to submit answers:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!preScreening) {
    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={styles.loading}
          >
            Loading questions...
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.formContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Pre-screening Questions
        </motion.h1>
        <motion.p
          className={styles.description}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Please answer the following questions to help us understand your qualifications better.
        </motion.p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {preScreening.questions.map((question, index) => (
            <motion.div
              key={index}
              className={styles.questionContainer}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <label className={styles.questionLabel}>
                Question {index + 1}
              </label>
              <p className={styles.questionText}>{question}</p>
              <textarea
                value={answers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className={styles.answerInput}
                placeholder="Type your answer here..."
                required
              />
            </motion.div>
          ))}

          <motion.button
            type="submit"
            className={styles.submitButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answers'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
} 