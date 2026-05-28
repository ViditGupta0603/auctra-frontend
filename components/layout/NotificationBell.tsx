"use client";

import {
  useEffect,
  useState,
} from "react";

import { Bell } from "lucide-react";

import api from "@/lib/api";

type Notification = {
  id: string;

  title: string;

  message: string;

  read: boolean;

  createdAt: string;
};

export default function NotificationBell() {
  const [
    notifications,
    setNotifications,
  ] = useState<
    Notification[]
  >([]);

  const [open, setOpen] =
    useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await api.get(
            "/notifications",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        setNotifications(
          response.data
        );
      } catch (error) {
        console.error(error);
      }
    };

  const unreadCount =
    notifications.filter(
      (n) => !n.read
    ).length;

  const markAsRead =
    async (
      id: string
    ) => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        await api.patch(
          `/notifications/${id}/read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotifications(
          (prev) =>
            prev.map((n) =>
              n.id === id
                ? {
                    ...n,
                    read: true,
                  }
                : n
            )
        );
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className="relative">
      {/* BELL */}
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="relative w-12 h-12 rounded-2xl bg-[#0B1727] border border-white/5 flex items-center justify-center hover:border-cyan-500/30 transition"
      >
        <Bell size={20} />

        {unreadCount >
          0 && (
          <div className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
            {
              unreadCount
            }
          </div>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-4 w-[380px] bg-[#0B1727] border border-white/5 rounded-3xl shadow-2xl overflow-hidden z-50">
          {/* HEADER */}
          <div className="p-5 border-b border-white/5">
            <h3 className="text-xl font-bold text-white">
              Notifications
            </h3>
          </div>

          {/* BODY */}
          <div className="max-h-[450px] overflow-y-auto">
            {notifications.length ===
            0 ? (
              <div className="p-8 text-center text-gray-500">
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
                    onClick={() =>
                      markAsRead(
                        notification.id
                      )
                    }
                    className={`p-5 border-b border-white/5 cursor-pointer transition hover:bg-white/[0.03] ${
                      notification.read
                        ? ""
                        : "bg-cyan-500/5"
                    }`}
                  >
                    <h4 className="font-semibold text-white mb-2">
                      {
                        notification.title
                      }
                    </h4>

                    <p className="text-sm text-gray-400 leading-relaxed">
                      {
                        notification.message
                      }
                    </p>

                    <p className="text-xs text-gray-500 mt-3">
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