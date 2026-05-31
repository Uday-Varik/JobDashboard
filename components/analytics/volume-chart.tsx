"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subMonths, subDays, startOfMonth, endOfMonth, startOfDay } from "date-fns";
import type { Application } from "@/lib/types";
import { STAGES } from "@/lib/types";
import { cn } from "@/lib/utils";

type Range = "1W" | "4W" | "8W" | "12W" | "6M";
type GroupBy = "day" | "month";

const RANGES: { id: Range; label: string; days?: number; months?: number; groupBy: GroupBy; tickInterval: number }[] = [
  { id: "1W",  label: "1W",  days: 7,   groupBy: "day",   tickInterval: 0  },
  { id: "4W",  label: "4W",  days: 28,  groupBy: "day",   tickInterval: 6  },
  { id: "8W",  label: "8W",  days: 56,  groupBy: "day",   tickInterval: 13 },
  { id: "12W", label: "12W", days: 84,  groupBy: "day",   tickInterval: 13 },
  { id: "6M",  label: "6M",  months: 6, groupBy: "month", tickInterval: 0  },
];

const STAGE_OPTIONS = [
  { id: "all", label: "All" },
  ...STAGES.filter((s) =>
    ["applied", "phone_screen", "technical", "final_round", "offer", "rejected"].includes(s.id)
  ).map((s) => ({ id: s.id, label: s.label })),
];

interface Props {
  applications: Application[];
}

export function VolumeChart({ applications }: Props) {
  const [range, setRange] = useState<Range>("8W");
  const [stageFilter, setStageFilter] = useState("all");

  const cfg = RANGES.find((r) => r.id === range)!;

  const { data, monthLines } = useMemo(() => {
    const filtered = stageFilter === "all"
      ? applications
      : applications.filter((a) => a.stage === stageFilter);

    if (cfg.groupBy === "day") {
      const days = cfg.days!;
      const bars = Array.from({ length: days }, (_, i) => {
        const dayStart = startOfDay(subDays(new Date(), days - 1 - i));
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);
        const count = filtered.filter((a) => {
          const date = new Date(a.applied_date ?? a.created_at);
          return date >= dayStart && date < dayEnd;
        }).length;
        return { label: format(dayStart, "MMM d"), count, day: dayStart };
      });

      // find bars where the month changes — these get a month label beneath
      const lines: { label: string; x: string }[] = [];
      bars.forEach((bar, i) => {
        const isFirst = i === 0;
        const monthChanged = i > 0 && bar.day.getMonth() !== bars[i - 1].day.getMonth();
        if (isFirst || monthChanged) {
          lines.push({ label: format(bar.day, "MMMM"), x: bar.label });
        }
      });

      return { data: bars, monthLines: lines };
    } else {
      const months = cfg.months!;
      const bars = Array.from({ length: months }, (_, i) => {
        const monthStart = startOfMonth(subMonths(new Date(), months - 1 - i));
        const monthEnd = endOfMonth(monthStart);
        const count = filtered.filter((a) => {
          const date = new Date(a.applied_date ?? a.created_at);
          return date >= monthStart && date <= monthEnd;
        }).length;
        return { label: format(monthStart, "MMM yyyy"), count };
      });
      return { data: bars, monthLines: [] };
    }
  }, [applications, range, stageFilter]);

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <CardTitle className="text-sm font-semibold text-gray-700">Applications per Week</CardTitle>
          <div className="flex items-center gap-2">
            {/* Stage filter */}
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {STAGE_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>

            {/* Range toggle */}
            <div className="flex rounded-md border border-gray-200 overflow-hidden">
              {RANGES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRange(r.id)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium transition-colors",
                    range === r.id
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              interval={cfg.tickInterval}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={28}
              tickCount={8}
              domain={[0, (dataMax: number) => Math.max(dataMax + 3, 10)]}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Applications" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
