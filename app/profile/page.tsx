"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Mail,
  Shield,
  Calendar,
  Gavel,
  Trophy,
  Pencil,
} from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";

import api from "@/lib/api";

type Auction = {
  id: string;

  title: string;

  imageUrl?: string;

  currentBid: number;

  status: string;

  createdAt: string;
};

type UserType = {
  id: string;

  name: string;

  email: string;

  role: string;

  createdAt?: string;
};

export default function ProfilePage() {
  const router =
    useRouter();

  const [user, setUser] =
    useState<UserType | null>(
      null
    );

  const [auctions, setAuctions] =
    useState<Auction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    authLoading,
    setAuthLoading,
  ] = useState(true);

  /**
   * AUTH CHECK
   */
  useEffect(() => {
    const token =
      localStorage.getItem(
        "token"
      );

    const storedUser =
      localStorage.getItem(
        "user"
      );

    if (
      !token ||
      !storedUser
    ) {
      router.push("/login");

      return;
    }

    setUser(
      JSON.parse(
        storedUser
      )
    );

    setAuthLoading(false);

    fetchMyAuctions();
  }, [router]);

  /**
   * FETCH USER AUCTIONS
   */
  const fetchMyAuctions =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await api.get(
            "/auctions/my/auctions",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        setAuctions(
          response.data
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  /**
   * AUTH LOADING
   */
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#06111F] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06111F] text-white flex overflow-hidden">
      <Sidebar />

      <main className="flex-1 ml-[250px] overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* TOP */}
          <div className="mb-10">
            <Link href="/">
              <button className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-5">
                <ArrowLeft size={18} />

                Back to Dashboard
              </button>
            </Link>

            <h1 className="text-5xl font-bold tracking-tight">
              My Profile
            </h1>

            <p className="text-gray-400 mt-2">
              Manage your account
              and auctions
            </p>
          </div>

          {/* PROFILE CARD */}
          <div className="bg-[#0B1727] border border-white/5 rounded-3xl p-8 mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              {/* LEFT */}
              <div className="flex items-center gap-6">
                <div className="w-28 h-28 rounded-full bg-cyan-500 flex items-center justify-center text-black text-4xl font-bold shadow-[0_0_30px_rgba(6,182,212,0.35)]">
                  {user?.name?.charAt(
                    0
                  ) || "U"}
                </div>

                <div>
                  <h2 className="text-4xl font-bold mb-3">
                    {
                      user?.name
                    }
                  </h2>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Mail
                        size={16}
                      />

                      {
                        user?.email
                      }
                    </div>

                    <div className="flex items-center gap-2 text-gray-400">
                      <Shield
                        size={16}
                      />

                      Role:
                      <span className="text-cyan-400 capitalize">
                        {" "}
                        {
                          user?.role
                        }
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar
                        size={16}
                      />

                      Auctra Member
                    </div>
                  </div>
                </div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-[#06111F] border border-white/5 rounded-2xl p-6 min-w-[170px]">
                  <div className="flex items-center gap-3 mb-4">
                    <Gavel className="text-cyan-400" />

                    <p className="text-gray-400">
                      Auctions
                    </p>
                  </div>

                  <h3 className="text-4xl font-bold">
                    {
                      auctions.length
                    }
                  </h3>
                </div>

                <div className="bg-[#06111F] border border-white/5 rounded-2xl p-6 min-w-[170px]">
                  <div className="flex items-center gap-3 mb-4">
                    <Trophy className="text-yellow-400" />

                    <p className="text-gray-400">
                      Approved
                    </p>
                  </div>

                  <h3 className="text-4xl font-bold">
                    {
                      auctions.filter(
                        (
                          auction
                        ) =>
                          auction.status ===
                          "APPROVED"
                      ).length
                    }
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* MY AUCTIONS */}
          <div>
            <div className="flex items-center justify-between mb-7">
              <div>
                <h2 className="text-3xl font-bold">
                  My Auctions
                </h2>

                <p className="text-gray-400 mt-1">
                  Manage your created
                  auctions
                </p>
              </div>
            </div>

            {loading ? (
              <div className="text-gray-400">
                Loading...
              </div>
            ) : auctions.length ===
              0 ? (
              <div className="bg-[#0B1727] border border-white/5 rounded-3xl p-10 text-center text-gray-400">
                No auctions created
                yet
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
                {auctions.map(
                  (auction) => (
                    <div
                      key={
                        auction.id
                      }
                      className="bg-[#0B1727] border border-white/5 rounded-3xl overflow-hidden hover:border-cyan-500/20 transition"
                    >
                      {/* IMAGE */}
                      <div className="relative">
                        <img
                          src={
                            auction.imageUrl &&
                            auction.imageUrl.trim() !==
                              ""
                              ? auction.imageUrl
                              : "https://img.magnific.com/free-vector/box-mockup_1017-7633.jpg?semt=ais_hybrid&w=740&q=80"
                          }
                          alt={
                            auction.title
                          }
                          className="h-60 w-full object-cover"
                        />

                        <div
                          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${
                            auction.status ===
                            "APPROVED"
                              ? "bg-green-500 text-black"
                              : auction.status ===
                                  "PENDING"
                                ? "bg-yellow-500 text-black"
                                : "bg-red-500 text-white"
                          }`}
                        >
                          {
                            auction.status
                          }
                        </div>
                      </div>

                      {/* BODY */}
                      <div className="p-6">
                        <h3 className="text-2xl font-semibold mb-3 line-clamp-1">
                          {
                            auction.title
                          }
                        </h3>

                        <div className="mb-5">
                          <p className="text-sm text-gray-500 mb-1">
                            Current Bid
                          </p>

                          <p className="text-3xl font-bold text-cyan-400">
                            $
                            {
                              auction.currentBid
                            }
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <Link
                            href={`/auction/${auction.id}`}
                            className="flex-1"
                          >
                            <button className="w-full h-12 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-2xl transition">
                              View
                            </button>
                          </Link>

                          <Link
                            href={`/auction/edit/${auction.id}`}
                            className="flex-1"
                          >
                            <button className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-2xl transition flex items-center justify-center gap-2">
                              <Pencil
                                size={
                                  16
                                }
                              />

                              Edit
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}