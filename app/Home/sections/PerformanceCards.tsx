"use client";

import { TrendingUp, AlertCircle } from "lucide-react";

const weeklyData = [
  { day: "MON", label: "Mon", value: 55 },
  { day: "TUE", label: "Tue", value: 40 },
  { day: "WED", label: "Wed", value: 78 },
  { day: "THU", label: "Thu", value: 62 },
  { day: "FRI", label: "Fri", value: 90 },
  { day: "SAT", label: "Sat (Today)", value: 75, isToday: true },
  { day: "SUN", label: "Sun", value: 50 },
];

export default function PerformanceCards() {
  const maxValue = Math.max(...weeklyData.map((d) => d.value));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 h-100">
      {/* Weekly Performance Trends */}
      <div className="rounded-xl border border-slate-200 bg-[#F8F9FE] p-5 md:col-span-2 flex flex-col justify-between">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">
            Weekly Performance Trends /{" "}
            <span className="font-semibold">أداء الأسبوع</span>
          </h3>
          <button className="text-xs font-semibold text-amber-700 hover:underline">
            View Full Report
          </button>
        </div>

        {/* FIXED: Added a concrete height (h-40) or min-height, and set to w-full */}
        <div className="flex h-40 w-full items-end justify-between gap-2 sm:gap-3">
          {weeklyData.map((item) => (
            <div
              key={item.day}
              className="flex h-full flex-1 flex-col justify-end items-center gap-2"
            >
              {/* Bar wrapper to help contain the height correctly */}
              <div className="w-full flex-1 flex items-end">
                <div
                  className={`w-full rounded-md transition-all duration-300 ${
                    item.isToday ? "bg-amber-400" : "bg-slate-300"
                  }`}
                  style={{ height: `${(item.value / maxValue) * 100}%` }}
                />
              </div>

              {/* Labels */}
              <span
                className={`text-[10px] font-bold tracking-wider ${
                  item.isToday ? "text-amber-600" : "text-slate-400"
                }`}
              >
                {item.label.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="flex flex-col justify-between rounded-xl bg-[#0B1730] p-5">
        <div>
          <h3 className="mb-4 text-sm font-bold text-white">Quick Insights</h3>

          <div className="mb-3 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">98% Attendance</p>
              <p className="text-xs text-slate-400">
                Liturgy Grade reached record highs.
              </p>
            </div>
          </div>

          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-200">
              <AlertCircle className="h-4 w-4 text-indigo-800" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">3 Action Items</p>
              <p className="text-xs text-slate-400">
                Marks pending for Grade 1 midterm.
              </p>
            </div>
          </div>
        </div>

        <button className="w-full rounded-lg bg-white py-2.5 text-sm font-bold text-[#0B1730] hover:bg-slate-100">
          Review Analytics
        </button>
      </div>
    </div>
  );
}
