"use client";

import NotificationBell from "./NotificationBell";

type Props = {
  search: string;

  setSearch: (
    value: string
  ) => void;

  category: string;

  setCategory: (
    value: string
  ) => void;

  sortBy: string;

  setSortBy: (
    value: string
  ) => void;
};

export default function Topbar({
  search,
  setSearch,
  category,
  setCategory,
  sortBy,
  setSortBy,
}: Props) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6 mb-10">
      {/* LEFT */}
      <div>
        <h1 className="text-5xl font-bold tracking-tight text-white">
          Dashboard
        </h1>

        <p className="text-gray-400 mt-2 text-lg">
          Discover premium live
          auctions
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search auctions..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="h-12 w-[260px] bg-[#0B1727] border border-white/5 rounded-2xl px-5 outline-none focus:border-cyan-500 transition text-white placeholder:text-gray-500"
        />

        {/* CATEGORY */}
        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
          className="h-12 min-w-[180px] bg-[#0B1727] border border-white/5 rounded-2xl px-5 outline-none focus:border-cyan-500 transition text-white"
        >
          <option value="">
            All Categories
          </option>

          <option value="Electronics">
            Electronics
          </option>

          <option value="Industrial">
            Industrial
          </option>

          <option value="Vehicles">
            Vehicles
          </option>

          <option value="Luxury">
            Luxury
          </option>

          <option value="Art">
            Art
          </option>
        </select>

        {/* SORT */}
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(
              e.target.value
            )
          }
          className="h-12 min-w-[170px] bg-[#0B1727] border border-white/5 rounded-2xl px-5 outline-none focus:border-cyan-500 transition text-white"
        >
          <option value="">
            Sort By
          </option>

          <option value="highest">
            Highest Bid
          </option>

          <option value="lowest">
            Lowest Bid
          </option>

          <option value="newest">
            Newest
          </option>

          <option value="oldest">
            Oldest
          </option>
        </select>

        {/* NOTIFICATION BELL */}
        <NotificationBell />
      </div>
    </div>
  );
}