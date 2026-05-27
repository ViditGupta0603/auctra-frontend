"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Pencil,
  Trash2,
  Eye,
  Clock3,
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

export default function MyAuctionsPage() {
  const [auctions, setAuctions] =
    useState<Auction[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions =
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

  const deleteAuction =
    async (id: string) => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        await api.delete(
          `/auctions/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAuctions(
          auctions.filter(
            (
              auction
            ) =>
              auction.id !==
              id
          )
        );
      } catch (error) {
        console.error(error);

        alert(
          "Failed to delete auction"
        );
      }
    };

  const getStatusColor =
    (status: string) => {
      switch (status) {
        case "APPROVED":
          return "bg-green-500/10 text-green-400";

        case "REJECTED":
          return "bg-red-500/10 text-red-400";

        default:
          return "bg-yellow-500/10 text-yellow-400";
      }
    };

  return (
    <div className="min-h-screen bg-[#06111F] text-white flex">
      <Sidebar />

      <main className="flex-1 ml-[250px] p-8 overflow-x-hidden">
        <div className="w-full">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-5xl font-bold tracking-tight">
                My Auctions
              </h1>

              <p className="text-gray-400 mt-2">
                Manage your created
                auctions
              </p>
            </div>
          </div>

          {/* CONTENT */}
          {loading ? (
            <p className="text-gray-400">
              Loading...
            </p>
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
                        className="h-64 w-full object-cover"
                      />

                      <div
                        className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          auction.status
                        )}`}
                      >
                        {
                          auction.status
                        }
                      </div>
                    </div>

                    {/* BODY */}
                    <div className="p-6">
                      <h2 className="text-2xl font-semibold mb-4 line-clamp-1">
                        {
                          auction.title
                        }
                      </h2>

                      {/* PRICE */}
                      <div className="mb-5">
                        <p className="text-sm text-gray-500 mb-1">
                          Current Bid
                        </p>

                        <h3 className="text-4xl font-bold text-cyan-400">
                          $
                          {
                            auction.currentBid
                          }
                        </h3>
                      </div>

                      {/* DATE */}
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                        <Clock3 size={15} />

                        {new Date(
                          auction.createdAt
                        ).toLocaleDateString()}
                      </div>

                      {/* ACTIONS */}
                      <div className="flex gap-3">
                        <Link
                          href={`/auction/${auction.id}`}
                          className="flex-1"
                        >
                          <button className="w-full h-12 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition flex items-center justify-center gap-2">
                            <Eye size={18} />

                            View
                          </button>
                        </Link>

                        <Link
                          href={`/edit-auction/${auction.id}`}
                        >
                          <button className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 transition flex items-center justify-center">
                            <Pencil size={18} />
                          </button>
                        </Link>

                        <button
                          onClick={() =>
                            deleteAuction(
                              auction.id
                            )
                          }
                          className="w-12 h-12 rounded-2xl bg-red-500/10 hover:bg-red-500 transition text-red-400 hover:text-white flex items-center justify-center"
                        >
                          <Trash2 size={18} />
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