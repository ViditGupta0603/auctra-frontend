"use client";

import {
  Bell,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import api from "@/lib/api";

interface Notification {
  id: string;

  message: string;

  createdAt: string;

  read: boolean;
}

export default function NotificationBell() {
  const [
    notifications,
    setNotifications,
  ] = useState<
    Notification[]
  >([]);

  const [
    open,
    setOpen,
  ] = useState(false);

  /**
   * FETCH NOTIFICATIONS
   */
  const fetchNotifications =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        /**
         * NOT LOGGED IN
         */
        if (!token) {
          return;
        }

        const response =
          await api.get(
            "/notifications",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setNotifications(
          response.data
        );
      } catch (error) {
        console.error(
          "Notification error:",
          error
        );
      }
    };

  /**
   * INITIAL LOAD
   */
  useEffect(() => {
    const token =
      localStorage.getItem(
        "token"
      );

    /**
     * NO TOKEN
     */
    if (!token) {
      return;
    }

    fetchNotifications();
  }, []);

  /**
   * UNREAD COUNT
   */
  const unreadCount =
    notifications.filter(
      (n) => !n.read
    ).length;

  /**
   * NO TOKEN
   * HIDE COMPONENT
   */
  const token =
    typeof window !==
      "undefined" &&
    localStorage.getItem(
      "token"
    );

  if (!token) {
    return null;
  }

  return (
    <div className="relative">
      {/* BELL */}
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="relative h-12 w-12 rounded-2xl bg-[#0B1727] border border-white/5 flex items-center justify-center hover:border-cyan-500 transition"
      >
        <Bell size={22} />

        {unreadCount >
          0 && (
          <div className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
            {
              unreadCount
            }
          </div>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-4 w-[350px] bg-[#0B1727] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50">
          {/* HEADER */}
          <div className="p-5 border-b border-white/5">
            <h2 className="text-lg font-semibold">
              Notifications
            </h2>
          </div>

          {/* LIST */}
          <div className="max-h-[450px] overflow-y-auto">
            {notifications.length ===
            0 ? (
              <div className="p-6 text-center text-gray-400">
                No notifications
              </div>
            ) : (
              notifications.map(
                (
                  notification
                ) => (
                  <div
                    key={
                      notification.id
                    }
                    className={`p-5 border-b border-white/5 hover:bg-white/5 transition ${
                      !notification.read
                        ? "bg-cyan-500/5"
                        : ""
                    }`}
                  >
                    <p className="text-sm leading-relaxed">
                      {
                        notification.message
                      }
                    </p>

                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                )
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}