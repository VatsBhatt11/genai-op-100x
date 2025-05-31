"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { Notification as NotificationType } from "@/types/notification";
import styles from "./notifications.module.css"

interface NotificationsClientProps {
  notifications: NotificationType[];
}

export default function NotificationsClient({ notifications }: NotificationsClientProps) {
  const router = useRouter();

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleNotificationClick = (notification: NotificationType) => {
    if (notification.type === "MESSAGE" && notification.outreachId) {
      router.push(`/candidate/job-updates/${notification.outreachId}`);
    } 
    // else {
    //   router.push("/candidate/job-updates");
    // }
  };

  return (
    <div className={styles.container}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.title}
      >
        Notifications
      </motion.h1>

      {notifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.emptyState}
        >
          <Bell className={styles.emptyIcon} />
          <h3>No notifications yet</h3>
          <p>You'll see notifications here when you receive messages or updates</p>
        </motion.div>
      ) : (
        <div className={styles.notificationsList}>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: notification.id.charCodeAt(0) * 0.1 }}
              className={`${styles.notificationCard} ${!notification.isRead ? styles.unread : ""}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className={styles.notificationHeader}>
                <div className={styles.notificationIcon}>
                  {/* NotificationIcon component */}
                </div>
                <div className={styles.notificationInfo}>
                  <h3>{notification.title}</h3>
                  <div className={styles.notificationMeta}>
                    <span className={styles.notificationType}>
                      {notification.type.replace("_", " ")}
                    </span>
                    {notification.sender && (
                      <span className={styles.companyName}>
                        From: {notification.sender.companyProfile?.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className={styles.notificationTime}>
                  <span>{formatTimeAgo(notification.createdAt)}</span>
                  {!notification.isRead && <div className={styles.unreadDot} />}
                </div>
              </div>
              <div className={styles.notificationContent}>
                <p>{notification.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 