import { NotificationItem, NotificationResponse } from "../types/notifType";
import api from "./api";

// Fetch all notifications for authenticated user
export const fetchNotifications = async (): Promise<NotificationResponse> => {
  try {
    const response = await api.get("/api/v1/order/notifications");
    return response.data;
  } catch (error: any) {
    console.error("Gagal mengambil notifikasi:", error);

    // Tangani error dari server (validasi, dll)
    if (error.response) {
      const { data } = error.response;

      if (data.errors && typeof data.errors === "object") {
        throw {
          type: "validation",
          message: data.message || "Validasi gagal!",
          errors: data.errors,
        };
      }

      throw {
        type: "general",
        message: data.message || "Terjadi kesalahan!",
      };
    }

    // Error jaringan / tidak diketahui
    throw {
      type: "network",
      message: "Tidak dapat terhubung ke server.",
    };
  }
};

// Utility function to format notification time
export const formatNotificationTime = (dateString: string): string => {
  const now = new Date();
  const notificationDate = new Date(dateString);
  const diffInMinutes = Math.floor(
    (now.getTime() - notificationDate.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "Baru saja";
  if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam yang lalu`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} hari yang lalu`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} minggu yang lalu`;

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} bulan yang lalu`;
};

// Error handler for notification API calls
export const handleNotificationError = (error: any): string => {
  if (error.message) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Terjadi kesalahan saat memproses notifikasi";
};

// Get unread notification count from fetched data
export const getUnreadCount = (notifications: NotificationItem[]): number => {
  return notifications.filter((notification) => !notification.viewed).length;
};

