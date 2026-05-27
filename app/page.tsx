"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import socket from "@/lib/socket";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

import StatCard from "@/components/dashboard/StatCard";
import AuctionCard from "@/components/dashboard/AuctionCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

import CreateAuctionModal from "@/components/auction/CreateAuctionModal";

import { getAuctions } from "@/services/auctionService";

import { getDashboardAnalytics } from "@/services/analyticsService";

import { Auction } from "@/types/auction";
import api from "@/lib/api";

type BidPlacedData = {
  auctionId: string;
  currentBid: number;
};

type AnalyticsType = {
  totalAuctions: number;
  totalBids: number;
  revenue: number;

  monthlyAuctions: {
    month: string;
    auctions: number;
  }[];
};
export default function Home() {
  const router =
    useRouter();

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [sortBy, setSortBy] =
    useState("");

  const [auctions, setAuctions] =
    useState<Auction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [analytics, setAnalytics] =
    useState<AnalyticsType>({
      totalAuctions: 0,
      totalBids: 0,
      revenue: 0,
      monthlyAuctions: [],
    });

  useEffect(() => {
    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      router.push("/login");
      return;
    }

    fetchAuctions();

    fetchAnalytics();
  }, []);

  useEffect(() => {
    socket.on(
      "bidPlaced",
      (data: BidPlacedData) => {
        setAuctions((prev) =>
          prev.map((auction) =>
            auction.id ===
            data.auctionId
              ? {
                  ...auction,
                  currentBid:
                    data.currentBid,
                }
              : auction
          )
        );
      }
    );

    return () => {
      socket.off(
        "bidPlaced"
      );
    };
  }, []);

  const fetchAuctions =
  async () => {
    try {
      setLoading(true);

      const response =
        await api.get(
          "/auctions",
          {
            headers: {
              "Cache-Control":
                "no-cache",
            },
          }
        );

      const data =
        response.data;

      setAuctions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics =
    async () => {
      try {
        const data =
          await getDashboardAnalytics();

        setAnalytics(data);
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className="min-h-screen bg-[#06111F] text-white flex overflow-hidden">
      <Sidebar />

      <main className="flex-1 ml-[250px] px-8 py-6 overflow-y-auto h-screen">
        <div className="w-full">
          <Topbar
            search={search}
            setSearch={
              setSearch
            }
            category={
              category
            }
            setCategory={
              setCategory
            }
            sortBy={sortBy}
            setSortBy={
              setSortBy
            }
          />

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard
              title="Active Auctions"
              value={String(
                analytics.totalAuctions
              )}
            />

            <StatCard
              title="Total Bids"
              value={String(
                analytics.totalBids
              )}
            />

            <StatCard
              title="Revenue"
              value={`$${analytics.revenue}`}
            />
          </div>

          {/* AUCTIONS */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold">
                  Live Auctions
                </h2>

                <p className="text-gray-400 mt-1">
                  Discover and bid
                  on premium
                  auctions
                </p>
              </div>

              <CreateAuctionModal
                onCreated={() => {
                  fetchAuctions();

                  fetchAnalytics();
                }}
              />
            </div>

            {loading ? (
              <div className="text-gray-400">
                Loading auctions...
              </div>
            ) : auctions.length ===
              0 ? (
              <div className="bg-[#0B1727] border border-white/5 rounded-3xl p-10 text-center text-gray-400">
                No approved
                auctions yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
                {[...auctions]
                  .filter(
                    (
                      auction
                    ) => {
                      const matchesSearch =
                        auction.title
                          .toLowerCase()
                          .includes(
                            search.toLowerCase()
                          );

                      const matchesCategory =
                        category ===
                          "" ||
                        auction.category ===
                          category;

                      return (
                        matchesSearch &&
                        matchesCategory
                      );
                    }
                  )

                  .sort(
                    (a, b) => {
                      if (
                        sortBy ===
                        "highest"
                      ) {
                        return (
                          b.currentBid -
                          a.currentBid
                        );
                      }

                      if (
                        sortBy ===
                        "lowest"
                      ) {
                        return (
                          a.currentBid -
                          b.currentBid
                        );
                      }

                      if (
                        sortBy ===
                        "newest"
                      ) {
                        return (
                          new Date(
                            b.createdAt
                          ).getTime() -
                          new Date(
                            a.createdAt
                          ).getTime()
                        );
                      }

                      if (
                        sortBy ===
                        "oldest"
                      ) {
                        return (
                          new Date(
                            a.createdAt
                          ).getTime() -
                          new Date(
                            b.createdAt
                          ).getTime()
                        );
                      }

                      return 0;
                    }
                  )

                  .map(
                    (
                      auction
                    ) => (
                      <AuctionCard
                        key={
                          auction.id
                        }
                        id={
                          auction.id
                        }
                        title={
                          auction.title
                        }
                        price={
                          auction.currentBid
                        }
                        image={
                          auction.imageUrl ||
                          "https://img.magnific.com/free-vector/box-mockup_1017-7633.jpg?semt=ais_hybrid&w=740&q=80"
                        }
                      />
                    )
                  )}
              </div>
            )}
          </div>

          {/* ANALYTICS */}
          <AnalyticsChart
            data={
              analytics.monthlyAuctions
            }
          />
        </div>
      </main>
    </div>
  );
}