"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { formatTimeAgo } from '@/lib/utils';
import { markAsRead } from '@/lib/api';
import { Notification } from '@/types/notification';
import { NotificationIcon } from '@/components/NotificationIcon';
import styles from '@/styles/Navbar.module.css';

const Navbar: React.FC = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    if (notification.type === "MESSAGE" && notification.outreachId) {
      router.push(`/candidate/job-updates/${notification.outreachId}`);
    } else {
      router.push("/candidate/job-updates");
    }
  };

  return (
    <div className={styles.navbar}>
      <DropdownMenu>
        <div className={styles.notificationsDropdown}>
          <div className={styles.notificationsList}>
            {notifications.length === 0 && (
              <div className={styles.emptyState}>No notifications</div>
            )}
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ""}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <NotificationIcon type={notification.type} className={styles.icon} />
                <div>
                  <div className={styles.notificationTitle}>{notification.title}</div>
                  <div className={styles.notificationTime}>{formatTimeAgo(notification.createdAt)}</div>
                </div>
                {!notification.isRead && <span className={styles.unreadDot} />}
              </DropdownMenuItem>
            ))}
          </div>
          <button
            className={styles.viewAllButton}
            onClick={() => router.push("/notifications")}
            type="button"
          >
            View all notifications
          </button>
        </div>
      </DropdownMenu>
    </div>
  );
};

export default Navbar; 