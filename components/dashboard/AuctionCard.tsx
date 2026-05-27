"use client";

import Link from "next/link";

type Props = {
  id?: string;
  title: string;
  price: number;
  image: string;
};

export default function AuctionCard({
  id,
  title,
  price,
  image,
}: Props) {
  return (
    <Link href={`/auction/${id}`}>
      <div className="group bg-[#0B1727] border border-white/5 rounded-3xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        <div className="relative overflow-hidden">
          <img
            src={
              image && image.trim() !== ""
                ? image
                : "https://img.magnific.com/free-vector/box-mockup_1017-7633.jpg?semt=ais_hybrid&w=740&q=80"
            }
            alt={title}
            className="w-full h-60 object-cover group-hover:scale-105 transition duration-500"
          />

          <div className="absolute top-4 left-4 bg-cyan-500 text-black text-xs font-bold px-3 py-1 rounded-full">
            LIVE
          </div>
        </div>

        <div className="p-5">
          <h2 className="text-xl font-semibold mb-4 line-clamp-1">
            {title}
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Current Bid
              </p>

              <p className="text-2xl font-bold text-cyan-400">
                ${price}
              </p>
            </div>

            <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium px-5 py-2 rounded-xl transition">
              Bid Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}