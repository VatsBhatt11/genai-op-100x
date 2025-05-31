"use client";

import { motion } from "framer-motion";
import PreScreeningForm from "./PreScreeningForm";
import styles from "./preScreening.module.css";

interface PreScreeningClientProps {
  preScreening: {
    id: string;
    questions: string[];
    company: {
      companyProfile?: {
        name: string;
        logo: string;
      };
    };
  };
}

export default function PreScreeningClient({ preScreening }: PreScreeningClientProps) {
  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.content}
      >
        <div className={styles.header}>
          <img
            src={preScreening.company.companyProfile?.logo || "/default-company.png"}
            alt={preScreening.company.companyProfile?.name || "Company"}
            className={styles.companyLogo}
          />
          <div className={styles.companyInfo}>
            <h1>Pre-screening Round</h1>
            <p>{preScreening.company.companyProfile?.name}</p>
          </div>
        </div>

        <PreScreeningForm
          preScreeningId={preScreening.id}
          questions={preScreening.questions}
        />
      </motion.div>
    </div>
  );
} 