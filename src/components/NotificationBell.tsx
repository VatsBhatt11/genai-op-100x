"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell } from "lucide-react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Badge } from "./ui/badge"
import { NotificationIcon } from "@/components/NotificationIcon"
import { Notification as NotificationType } from "@/types/notification"
import styles from "@/styles/Navbar.module.css"

export function NotificationBell() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications")
        const data = await response.json()
        setNotifications(data)
        setUnreadCount(Array.isArray(data) ? data.filter((n: NotificationType) => !n.isRead).length : 0)
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      }
    }

    fetchNotifications()
  }, [])

  const handleBellClick = () => {
    router.push("/notifications")
  }

  return (
    <Button variant="ghost" size="sm" className={styles.notificationButton} onClick={handleBellClick}>
      <Bell className={styles.bellIcon} />
      {unreadCount > 0 && (
        <Badge variant="destructive" className={styles.badge}>
          {unreadCount > 9 ? "9+" : unreadCount}
        </Badge>
      )}
    </Button>
  )
}
