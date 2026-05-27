"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  Clock3,
  Gavel,
} from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";

import AuctionTimer from "@/components/auction/AuctionTimer";

import socket from "@/lib/socket";

import {
  getAuctionById,
  placeBid,
} from "@/services/auctionService";

type BidPlacedData = {
  auctionId: string;
  currentBid: number;
};

type Bid = {
  id: string;

  amount: number;

  createdAt: string;

  user: {
    name: string;

    email: string;
  };
};

type Auction = {
  id: string;

  title: string;

  description: string;

  imageUrl: string;

  currentBid: number;

  endTime: string;

  category?: string;

  status?: string;

  seller: {
    name: string;
  };

  bids: Bid[];
};

export default function AuctionPage() {
  const params =
    useParams();

  const router =
    useRouter();

  const [auction, setAuction] =
    useState<Auction | null>(
      null
    );

  const [bidAmount, setBidAmount] =
    useState("");

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

    if (!token) {
      router.push("/login");

      return;
    }

    setAuthLoading(false);

    if (params?.id) {
      fetchAuction();
    }
  }, [params?.id, router]);

  /**
   * SOCKET LIVE BIDS
   */
  useEffect(() => {
    socket.on(
      "bidPlaced",
      (
        data: BidPlacedData
      ) => {
        if (
          data.auctionId ===
          params.id
        ) {
          setAuction(
            (prev) => {
              if (!prev)
                return prev;

              return {
                ...prev,

                currentBid:
                  data.currentBid,
              };
            }
          );
        }
      }
    );

    return () => {
      socket.off(
        "bidPlaced"
      );
    };
  }, [params.id]);

  /**
   * FETCH AUCTION
   */
  const fetchAuction =
    async () => {
      try {
        const data =
          await getAuctionById(
            params.id as string
          );

        setAuction(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  /**
   * PLACE BID
   */
  const handleBid =
    async () => {
      try {
        if (!bidAmount) {
          alert(
            "Enter bid amount"
          );

          return;
        }

        /**
         * AUCTION ENDED
         */
        if (
          new Date(
            auction!.endTime
          ).getTime() <
          new Date().getTime()
        ) {
          alert(
            "Auction has ended"
          );

          return;
        }

        await placeBid(
          params.id as string,
          Number(
            bidAmount
          )
        );

        await fetchAuction();

        setBidAmount("");
      } catch (error: any) {
        console.error(error);

        alert(
          error?.response
            ?.data?.error ||
            "Failed to place bid"
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

  /**
   * PAGE LOADING
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#06111F] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  /**
   * NOT FOUND
   */
  if (!auction) {
    return (
      <div className="min-h-screen bg-[#06111F] text-white flex items-center justify-center">
        Auction not found
      </div>
    );
  }

  const auctionEnded =
    new Date(
      auction.endTime
    ).getTime() <
    new Date().getTime();

  return (
    <div className="min-h-screen bg-[#06111F] text-white flex overflow-hidden">
      <Sidebar />

      <main className="flex-1 ml-[250px] overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto px-8 py-8 w-full">
          {/* TOPBAR */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <button className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                <ArrowLeft size={18} />

                Back to Auctions
              </button>
            </Link>

            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                auctionEnded
                  ? "bg-red-500/10 text-red-400"
                  : "bg-green-500/10 text-green-400"
              }`}
            >
              <Clock3 size={16} />

              {auctionEnded
                ? "Auction Ended"
                : "Live Auction"}
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10">
            {/* IMAGE */}
            <div>
              <div className="overflow-hidden rounded-3xl border border-white/5 bg-[#0B1727]">
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
                  className="w-full h-[650px] object-cover hover:scale-105 transition duration-700"
                />
              </div>
            </div>

            {/* RIGHT */}
            <div>
              {/* CATEGORY */}
              <p className="text-cyan-400 text-sm mb-3">
                {
                  auction.category
                }
              </p>

              {/* TITLE */}
              <div className="mb-8">
                <p className="text-gray-500 text-sm mb-3">
                  SOLD BY{" "}
                  <span className="font-semibold text-white">
                    {
                      auction
                        .seller
                        ?.name
                    }
                  </span>
                </p>

                <h1 className="text-6xl font-bold tracking-tight leading-tight mb-5">
                  {auction.title}
                </h1>

                <p className="text-gray-400 text-lg leading-relaxed">
                  {
                    auction.description
                  }
                </p>
              </div>

              {/* TIMER */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Auction Ends
                    In
                  </h3>

                  {!auctionEnded && (
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  )}
                </div>

                <AuctionTimer
                  endTime={
                    auction.endTime
                  }
                />
              </div>

              {/* CURRENT BID */}
              <div className="bg-gradient-to-br from-[#0B1727] to-[#0A1320] border border-cyan-500/10 rounded-3xl p-8 mb-6">
                <div className="flex items-center gap-2 text-gray-400 mb-4">
                  <Gavel size={18} />

                  Current Bid
                </div>

                <h2 className="text-7xl font-black tracking-tight text-cyan-400">
                  $
                  {
                    auction.currentBid
                  }
                </h2>
              </div>

              {/* BID BOX */}
              <div className="bg-[#0B1727] border border-white/5 rounded-3xl p-6 mb-6">
                <p className="text-sm text-gray-400 mb-4">
                  Place your bid
                </p>

                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Enter bid amount"
                    value={
                      bidAmount
                    }
                    onChange={(
                      e
                    ) =>
                      setBidAmount(
                        e.target
                          .value
                      )
                    }
                    disabled={
                      auctionEnded
                    }
                    className="flex-1 h-14 bg-[#06111F] border border-white/5 rounded-2xl px-5 outline-none focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />

                  <button
                    onClick={
                      handleBid
                    }
                    disabled={
                      auctionEnded
                    }
                    className="h-14 px-8 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-2xl transition"
                  >
                    Place Bid
                  </button>
                </div>
              </div>

              {/* BID HISTORY */}
              <div className="bg-[#0B1727] border border-white/5 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold">
                    Bid Activity
                  </h3>

                  <p className="text-sm text-gray-400">
                    {
                      auction.bids
                        ?.length
                    }{" "}
                    bids
                  </p>
                </div>

                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                  {auction.bids
                    ?.length ===
                  0 ? (
                    <p className="text-gray-500">
                      No bids yet
                    </p>
                  ) : (
                    auction.bids.map(
                      (
                        bid
                      ) => (
                        <div
                          key={
                            bid.id
                          }
                          className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4"
                        >
                          <div>
                            <p className="font-medium">
                              {
                                bid
                                  .user
                                  ?.name
                              }
                            </p>

                            <p className="text-sm text-gray-500">
                              {new Date(
                                bid.createdAt
                              ).toLocaleString()}
                            </p>
                          </div>

                          <p className="text-cyan-400 text-xl font-bold">
                            $
                            {
                              bid.amount
                            }
                          </p>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}