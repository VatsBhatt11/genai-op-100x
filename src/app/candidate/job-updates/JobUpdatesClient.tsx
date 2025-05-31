"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import styles from "./jobUpdates.module.css";

interface OutreachMessage {
  id: string;
  message: string;
  createdAt: Date;
  sender: {
    companyProfile?: {
      name: string;
      logo: string;
      location: string;
    };
  };
  preScreening?: {
    id: string;
  };
}

interface JobUpdatesClientProps {
  outreachMessages: OutreachMessage[];
}

export default function JobUpdatesClient({ outreachMessages }: JobUpdatesClientProps) {
  return (
    <div className={styles.container}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.title}
      >
        Job Updates
      </motion.h1>

      <div className={styles.messagesContainer}>
        {outreachMessages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={styles.messageCard}
          >
            <div className={styles.messageHeader}>
              <img
                src={message.sender.companyProfile?.logo || "/default-company.png"}
                alt={message.sender.companyProfile?.name || "Company"}
                className={styles.companyLogo}
              />
              <div className={styles.companyInfo}>
                <h3>{message.sender.companyProfile?.name}</h3>
                <p>{message.sender.companyProfile?.location}</p>
              </div>
            </div>

            <div className={styles.messageContent}>
              <p>{message.message}</p>
            </div>

            {message.preScreening && (
              <Link
                href={`/candidate/pre-screening/${message.preScreening.id}`}
                className={styles.preScreeningButton}
              >
                Give Pre-screening Round
              </Link>
            )}

            <div className={styles.messageFooter}>
              <span>{new Date(message.createdAt).toLocaleDateString()}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 