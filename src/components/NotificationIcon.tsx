"use client";

import { Bell, Mail, Briefcase, Users } from "lucide-react";

interface NotificationIconProps {
  type: string;
  className?: string;
}

export function NotificationIcon({ type, className }: NotificationIconProps) {
  switch (type) {
    case "MESSAGE":
      return <Mail className={className} />;
    case "APPLICATION_UPDATE":
      return <Briefcase className={className} />;
    case "JOB_MATCH":
      return <Users className={className} />;
    default:
      return <Bell className={className} />;
  }
} 