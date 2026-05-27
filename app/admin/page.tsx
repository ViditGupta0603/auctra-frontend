"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  Check,
  X,
  ShieldCheck,
} from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";

import api from "@/lib/api";

type Auction = {
  id: string;

  title: string;

  description: string;

  imageUrl?: string;

  startingPrice: number;

  category?: string;

  seller?: {
    name: string;

    email: string;
  };
};

export default function AdminPage() {
  const router =
    useRouter();

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

    const user =
      localStorage.getItem(
        "user"
      );

    /**
     * NOT LOGGED IN
     */
    if (!token || !user) {
      router.push("/login");

      return;
    }

    const parsedUser =
      JSON.parse(user);

    /**
     * NOT ADMIN
     */
    if (
      parsedUser.role !==
      "admin"
    ) {
      router.push("/");

      return;
    }

    setAuthLoading(false);

    fetchPendingAuctions();
  }, [router]);

  /**
   * FETCH PENDING
   */
  const fetchPendingAuctions =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await api.get(
            "/auctions/admin/pending",
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
   * APPROVE
   */
  const approveAuction =
    async (id: string) => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        await api.patch(
          `/auctions/${id}/approve`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await fetchPendingAuctions();

        alert(
          "Auction approved successfully"
        );
      } catch (error) {
        console.error(error);

        alert(
          "Failed to approve auction"
        );
      }
    };

  /**
   * REJECT
   */
  const rejectAuction =
    async (id: string) => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        await api.patch(
          `/auctions/${id}/reject`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await fetchPendingAuctions();

        alert(
          "Auction rejected successfully"
        );
      } catch (error) {
        console.error(error);

        alert(
          "Failed to reject auction"
        );
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

      <main className="flex-1 ml-[250px] px-8 py-8 overflow-y-auto h-screen">
        <div className="w-full">
          {/* HEADER */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center">
              <ShieldCheck className="text-purple-400" />
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                Admin Approval Panel
              </h1>

              <p className="text-gray-400 mt-1">
                Review and approve
                submitted auctions
              </p>
            </div>
          </div>

          {/* CONTENT */}
          {loading ? (
            <div className="text-gray-400">
              Loading pending
              auctions...
            </div>
          ) : auctions.length ===
            0 ? (
            <div className="bg-[#0B1727] border border-white/5 rounded-3xl p-10 text-center text-gray-400">
              No pending auctions
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
              {auctions.map(
                (auction) => (
                  <div
                    key={
                      auction.id
                    }
                    className="bg-[#0B1727] border border-white/5 rounded-3xl overflow-hidden hover:border-purple-500/30 transition"
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

                      <div className="absolute top-4 left-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        PENDING
                      </div>
                    </div>

                    {/* BODY */}
                    <div className="p-6">
                      {/* CATEGORY */}
                      <p className="text-cyan-400 text-sm mb-3">
                        {
                          auction.category
                        }
                      </p>

                      {/* TITLE */}
                      <h2 className="text-2xl font-semibold mb-3 line-clamp-1">
                        {
                          auction.title
                        }
                      </h2>

                      {/* DESCRIPTION */}
                      <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-3">
                        {
                          auction.description
                        }
                      </p>

                      {/* PRICE */}
                      <div className="mb-6">
                        <p className="text-sm text-gray-500 mb-1">
                          Starting Bid
                        </p>

                        <p className="text-3xl font-bold text-cyan-400">
                          $
                          {
                            auction.startingPrice
                          }
                        </p>
                      </div>

                      {/* SELLER */}
                      {auction.seller && (
                        <div className="mb-6 bg-white/[0.03] rounded-2xl p-4 border border-white/5">
                          <p className="text-xs text-gray-500 mb-1">
                            Submitted By
                          </p>

                          <p className="font-medium">
                            {
                              auction
                                .seller
                                .name
                            }
                          </p>

                          <p className="text-sm text-gray-400">
                            {
                              auction
                                .seller
                                .email
                            }
                          </p>
                        </div>
                      )}

                      {/* ACTION BUTTONS */}
                      <div className="flex gap-4">
                        <button
                          onClick={() =>
                            approveAuction(
                              auction.id
                            )
                          }
                          className="flex-1 h-12 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-2xl transition flex items-center justify-center gap-2"
                        >
                          <Check size={18} />

                          Approve
                        </button>

                        <button
                          onClick={() =>
                            rejectAuction(
                              auction.id
                            )
                          }
                          className="flex-1 h-12 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white font-semibold rounded-2xl transition flex items-center justify-center gap-2"
                        >
                          <X size={18} />

                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}