"use client";

import { useEffect, useState } from "react";

type Props = {
  endTime: string;
};

export default function AuctionTimer({
  endTime,
}: Props) {
  const calculateTimeLeft = () => {
    const difference =
      new Date(endTime).getTime() -
      new Date().getTime();

    if (difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(
        difference /
          (1000 * 60 * 60 * 24)
      ),

      hours: Math.floor(
        (difference /
          (1000 * 60 * 60)) %
          24
      ),

      minutes: Math.floor(
        (difference / 1000 / 60) %
          60
      ),

      seconds: Math.floor(
        (difference / 1000) % 60
      ),
    };
  };

  const [timeLeft, setTimeLeft] =
    useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(
        calculateTimeLeft()
      );
    }, 1000);

    return () =>
      clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-5">
        Auction Ended
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      {[
        {
          label: "Days",
          value: timeLeft.days,
        },

        {
          label: "Hours",
          value: timeLeft.hours,
        },

        {
          label: "Minutes",
          value: timeLeft.minutes,
        },

        {
          label: "Seconds",
          value: timeLeft.seconds,
        },
      ].map((item) => (
        <div
          key={item.label}
          className="bg-[#0B1727] border border-white/5 rounded-2xl p-4 text-center"
        >
          <p className="text-3xl font-bold text-cyan-400">
            {String(item.value).padStart(
              2,
              "0"
            )}
          </p>

          <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}