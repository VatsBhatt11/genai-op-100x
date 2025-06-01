"use client";

import { Notification } from "@prisma/client";

interface NotificationsClientProps {
  notifications: (Notification & {
    sender: {
      companyProfile: {
        name: string;
      } | null;
    };
  })[];
}

export default function NotificationsClient({ notifications }: NotificationsClientProps) {
  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="notifications-header">
          <h1>Notifications</h1>
          <div className="notifications-count">{notifications.length} new</div>
        </div>

        {notifications.length > 0 ? (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="notification-card"
              >
                <div className="notification-content">
                  <div className="notification-header">
                    <div className="company-info">
                      <div className="company-avatar">
                        {notification.sender.companyProfile?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "?"}
                      </div>
                      <div className="company-details">
                        <h3 className="company-name">
                          {notification.sender.companyProfile?.name || "Unknown Company"}
                        </h3>
                        <span className="notification-time">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="notification-status"></div>
                  </div>
                  <p className="notification-message">{notification.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h2>No notifications yet</h2>
            <p>We'll notify you when something important happens</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .notifications-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f6f8fc 0%, #f1f4f9 100%);
          padding: 2rem;
        }

        .notifications-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .notifications-header {
          padding: 2rem;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notifications-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }

        .notifications-count {
          background: #e6f4ff;
          color: #0066cc;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .notifications-list {
          padding: 1rem;
        }

        .notification-card {
          background: white;
          border-radius: 16px;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
          overflow: hidden;
        }

        .notification-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
          border-color: #e6e6e6;
        }

        .notification-content {
          padding: 1.5rem;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .company-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .company-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 1.25rem;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }

        .company-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .company-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .notification-time {
          font-size: 0.875rem;
          color: #666;
        }

        .notification-status {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          margin-top: 0.5rem;
        }

        .notification-message {
          color: #4a5568;
          line-height: 1.6;
          margin: 0;
          font-size: 0.95rem;
        }

        .empty-state {
          padding: 4rem 2rem;
          text-align: center;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .empty-state h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 0.5rem 0;
        }

        .empty-state p {
          color: #666;
          margin: 0;
        }

        @media (max-width: 640px) {
          .notifications-page {
            padding: 1rem;
          }

          .notifications-header {
            padding: 1.5rem;
          }

          .notification-content {
            padding: 1rem;
          }

          .company-avatar {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }

          .company-name {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
} 