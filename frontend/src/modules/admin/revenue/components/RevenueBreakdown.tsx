import React from "react";
import { Layers } from "lucide-react";

const channels = [
  { name: "Website trực tiếp", revenue: "185.000.000đ", percent: 55, color: "bg-indigo-500" },
  { name: "Shopee", revenue: "87.000.000đ", percent: 26, color: "bg-orange-500" },
  { name: "Tiki", revenue: "43.000.000đ", percent: 13, color: "bg-blue-500" },
  { name: "Lazada", revenue: "20.000.000đ", percent: 6, color: "bg-rose-500" },
];

const RevenueBreakdown: React.FC = () => {
  return (
    <div className="card-custom">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Layers className="text-indigo-600" size={20} />
          <h2 className="text-lg font-bold text-slate-900">Doanh thu theo kênh</h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">Tháng 6 / 2026</span>
      </div>

      {/* Channel List */}
      <div className="flex flex-col gap-4">
        {channels.map((channel) => (
          <div
            key={channel.name}
            className="group rounded-xl p-3 transition-all duration-200 hover:bg-slate-50 cursor-pointer"
          >
            {/* Top Row: Name + Revenue */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <span className={`h-2.5 w-2.5 rounded-full ${channel.color} ring-2 ring-offset-1 ring-transparent group-hover:ring-current transition-all duration-200`} />
                <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                  {channel.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{channel.revenue}</span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
                  {channel.percent}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${channel.color} transition-all duration-500 group-hover:shadow-sm`}
                style={{ width: `${channel.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Summary */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">Tổng doanh thu</span>
        <span className="text-sm font-bold text-slate-900">335.000.000đ</span>
      </div>
    </div>
  );
};

export default RevenueBreakdown;
