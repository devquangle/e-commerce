import React from "react";
import { BarChart3 } from "lucide-react";
import type { MonthlyRevenue } from "../types/revenue.type";

interface RevenueChartProps {
  monthlyRevenue: MonthlyRevenue[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ monthlyRevenue }) => {
  const maxRevenue = Math.max(...monthlyRevenue.map((item) => item.revenue));

  return (
    <div className="card-custom p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-indigo-600" size={20} />
          <h2 className="text-lg font-bold text-slate-900">Biểu đồ cột doanh thu theo tháng</h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">Đơn vị tính: Triệu VNĐ (tr)</span>
      </div>

      {/* CHART GRID */}
      <div className="grid grid-cols-6 items-end gap-2 sm:gap-4 border-b border-slate-100 pb-4 h-64">
        {monthlyRevenue.map((row) => {
          const height = Math.round((row.revenue / maxRevenue) * 100);

          return (
            <div key={row.month} className="flex flex-col items-center gap-3 group h-full justify-end">
              {/* Bar Value Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-lg shadow-sm mb-1 z-10 translate-y-1 group-hover:translate-y-0 transform transition-transform">
                {row.revenue}tr
              </div>

              {/* Column */}
              <div className="w-full flex h-48 items-end justify-center">
                <div
                  className="w-8 sm:w-16 rounded-t-xl bg-gradient-to-t from-indigo-500 via-indigo-600 to-violet-600 transition-all duration-300 hover:scale-x-105 hover:from-indigo-600 hover:to-violet-700 shadow-sm hover:shadow-md cursor-pointer origin-bottom"
                  style={{ height: `${height}%` }}
                  title={`${row.month}: ${row.revenue} triệu (${row.growth})`}
                />
              </div>

              {/* Month Name */}
              <span className="text-[11px] sm:text-sm font-semibold text-slate-700 truncate max-w-full">
                {row.month}
              </span>

              {/* Growth Pill */}
              <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] sm:text-xs font-bold ${
                row.isGrowth ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              }`}>
                {row.growth}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RevenueChart;
