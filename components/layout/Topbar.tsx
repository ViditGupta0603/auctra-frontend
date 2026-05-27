"use client";

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
    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-10">
      {/* LEFT */}
      <div>
        <h1 className="text-5xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="text-gray-400 mt-2">
          Discover premium live
          auctions
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col md:flex-row gap-4">
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
          className="h-12 w-[260px] bg-[#0B1727] border border-white/5 rounded-2xl px-5 outline-none focus:border-cyan-500 transition"
        />

        {/* CATEGORY */}
        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
          className="h-12 bg-[#0B1727] border border-white/5 rounded-2xl px-5 outline-none focus:border-cyan-500 transition"
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
          className="h-12 bg-[#0B1727] border border-white/5 rounded-2xl px-5 outline-none focus:border-cyan-500 transition"
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
      </div>
    </div>
  );
}