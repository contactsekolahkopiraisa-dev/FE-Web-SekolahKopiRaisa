"use client";

import { useState, useEffect } from "react";
import { Bell, X, RefreshCw } from "lucide-react";
import {
  fetchNotifications,
  formatNotificationTime,
  getUnreadCount,
  handleNotificationError,
} from "../app/utils/notif";
import { NotificationItem } from "../app/types/notifType";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchNotifications();
      setNotifications(response.data);
      const unread = getUnreadCount(response.data);
      setUnreadCount(unread);
    } catch (error) {
      const errorMessage = handleNotificationError(error);
      setError(errorMessage);
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isOpen]);

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="relative">
      {/* Bell Icon with Badge */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="relative text-primary hover:text-primary/80 transition-colors p-2 hover:bg-gray-100 rounded-full"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-[32rem] flex flex-col overflow-hidden"
          onClick={handleDropdownClick}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900">Notifikasi</h3>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto max-h-80">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-gray-500">
                  Memuat notifikasi...
                </span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center p-8 text-red-500">
                <Bell size={40} className="mb-3 opacity-50" />
                <p className="text-sm text-center font-medium mb-2">
                  Gagal memuat notifikasi
                </p>
                <p className="text-xs text-center text-gray-500 mb-4">
                  {error}
                </p>
                <button
                  onClick={loadNotifications}
                  className="px-4 py-2 text-sm bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Coba lagi
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                <Bell size={48} className="mb-4 opacity-30" />
                <p className="text-sm font-medium mb-1">Tidak ada notifikasi</p>
                <p className="text-xs text-center">
                  Notifikasi pesanan akan muncul di sini
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`transition-all duration-200 ${
                      !notification.viewed
                        ? "bg-blue-50/50 border-l-4 border-l-primary"
                        : "bg-white"
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Status Indicator */}
                        <div className="flex-shrink-0 mt-1.5">
                          {!notification.viewed ? (
                            <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                          ) : (
                            <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`text-sm font-medium leading-tight mb-1 ${
                              !notification.viewed
                                ? "text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {notification.name}
                          </h4>

                          <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                            {notification.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              {formatNotificationTime(notification.created_at)}
                            </span>
                            {notification.order_id && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                                Order #{notification.order_id}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {notifications.length > 5 && (
                  <div className="p-3 text-center border-t border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-500">
                      +{notifications.length - 5} notifikasi lainnya
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && !loading && (
            <div className="border-t border-gray-200 bg-gray-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {notifications.length} notifikasi total
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
