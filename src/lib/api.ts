export const markAsRead = async (notificationId: string) => {
  try {
    const response = await fetch(`/api/notifications/${notificationId}/read`, {
      method: "PATCH",
    });
    if (!response.ok) {
      throw new Error("Failed to mark notification as read");
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};
