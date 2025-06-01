"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import styles from "./preScreening.module.css";

interface PreScreeningFormProps {
  preScreeningId: string;
  questions: string[];
}

export default function PreScreeningForm({
  preScreeningId,
  questions,
}: PreScreeningFormProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/pre-screening/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preScreeningId,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit answers");
      }

      router.push("/candidate/job-updates");
    } catch (error) {
      // console.error("Error submitting pre-screening:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {questions.map((question, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={styles.questionContainer}
        >
          <label className={styles.questionLabel}>
            Question {index + 1}
          </label>
          <p className={styles.questionText}>{question}</p>
          <textarea
            value={answers[index]}
            onChange={(e) => {
              const newAnswers = [...answers];
              newAnswers[index] = e.target.value;
              setAnswers(newAnswers);
            }}
            className={styles.answerInput}
            rows={4}
            required
            placeholder="Type your answer here..."
          />
        </motion.div>
      ))}

      <motion.button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSubmitting ? "Submitting..." : "Submit Answers"}
      </motion.button>
    </form>
  );
} 