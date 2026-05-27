"use client";

type Props = {
  data: {
    month: string;
    auctions: number;
  }[];
};

export default function AnalyticsChart({
  data,
}: Props) {
  return (
    <div className="bg-[#0B1727] border border-white/5 rounded-3xl p-7">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">
          Platform Analytics
        </h2>

        <p className="text-gray-400 mt-1">
          Monthly auction growth
        </p>
      </div>

      {data.length === 0 ? (
        <div className="h-[320px] flex items-center justify-center text-gray-500">
          No analytics data
          available
        </div>
      ) : (
        <div className="space-y-5">
          {data.map((item) => (
            <div
              key={item.month}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">
                  {item.month}
                </span>

                <span className="text-sm font-semibold text-cyan-400">
                  {
                    item.auctions
                  }{" "}
                  auctions
                </span>
              </div>

              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      item.auctions *
                        10,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}