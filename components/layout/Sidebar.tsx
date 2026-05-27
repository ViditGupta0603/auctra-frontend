"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  User,
  ShieldCheck,
  LogOut,
  Gavel,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },

  {
    label: "My Auctions",
    href: "/my-auctions",
    icon: Gavel,
  },

  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
];

type UserType = {
  name: string;
  email: string;
  role: string;
};

export default function Sidebar() {
  const pathname =
    usePathname();

  const [mounted, setMounted] =
    useState(false);

  const [user, setUser] =
    useState<UserType | null>(
      null
    );

  useEffect(() => {
    setMounted(true);

    const storedUser =
      localStorage.getItem(
        "user"
      );

    if (storedUser) {
      setUser(
        JSON.parse(
          storedUser
        )
      );
    }
  }, []);

  if (!mounted) {
    return null;
  }

  const isAdmin =
    user?.role === "admin";

  return (
    <aside className="w-[250px] h-screen fixed left-0 top-0 bg-[#07101B] border-r border-white/5 flex flex-col justify-between z-50">
      {/* TOP SECTION */}
      <div>
        {/* LOGO */}
        <div className="px-6 py-7 border-b border-white/5 flex flex-col items-center">
          <img
            src="https://i.postimg.cc/xjPJL9LD/image-removebg-preview.png"
            alt="Auctra"
            className="h-16 w-auto object-contain drop-shadow-[0_0_25px_rgba(6,182,212,0.35)]"
          />

          <p className="text-sm text-gray-500 mt-1 tracking-wide text-center">
            Premium Auction
            Platform
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="px-4 py-6 space-y-3 mt-2">
          {navItems.map(
            (item) => {
              const Icon =
                item.icon;

              const active =
                pathname ===
                item.href;

              return (
                <Link
                  key={
                    item.label
                  }
                  href={
                    item.href
                  }
                >
                  <div
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                      active
                        ? "bg-cyan-500 text-black shadow-[0_0_30px_rgba(6,182,212,0.25)]"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon
                      size={19}
                    />

                    <span className="font-medium text-[15px]">
                      {
                        item.label
                      }
                    </span>
                  </div>
                </Link>
              );
            }
          )}

          {/* ADMIN PANEL */}
          {isAdmin && (
            <Link href="/admin">
              <div
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                  pathname ===
                  "/admin"
                    ? "bg-purple-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.25)]"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <ShieldCheck
                  size={19}
                />

                <span className="font-medium text-[15px]">
                  Admin Panel
                </span>
              </div>
            </Link>
          )}
        </nav>
      </div>

      {/* USER SECTION */}
      <div className="p-4 border-t border-white/5">
        <div className="bg-white/[0.03] rounded-3xl p-4 border border-white/5">
          {/* USER INFO */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-black text-lg font-bold shadow-[0_0_25px_rgba(6,182,212,0.3)]">
              {user?.name?.charAt(
                0
              ) || "U"}
            </div>

            <div className="overflow-hidden">
              <p className="font-medium text-sm truncate">
                {user?.name ||
                  "User"}
              </p>

              <p className="text-xs text-gray-500 truncate">
                {
                  user?.email
                }
              </p>
            </div>
          </div>

          {/* ROLE */}
          <div className="mb-5">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium capitalize">
              {user?.role}
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={() => {
              localStorage.removeItem(
                "token"
              );

              localStorage.removeItem(
                "user"
              );

              window.location.href =
                "/login";
            }}
            className="w-full bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 transition-all duration-200 py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium"
          >
            <LogOut
              size={16}
            />

            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}