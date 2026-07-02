import React from "react";
import { Table2, BarChart3, Calendar, RotateCcw } from "lucide-react";

export type ViewTab = "table" | "chart";

interface AdminFilterTabsProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  dateRange: string;
  onDateRangeChange: (val: string) => void;
  startDate?: string;
  onStartDateChange?: (val: string) => void;
  endDate?: string;
  onEndDateChange?: (val: string) => void;
  onReset?: () => void;
  dateRangeOptions?: { value: string; label: string }[];
}

const defaultDateRangeOptions = [
  { value: "today", label: "Hôm nay" },
  { value: "7days", label: "7 ngày qua" },
  { value: "30days", label: "30 ngày qua" },
  { value: "quarter", label: "Quý này" },
  { value: "year", label: "Năm nay" },
  { value: "custom", label: "Tùy chỉnh..." },
];

const AdminFilterTabs: React.FC<AdminFilterTabsProps> = ({
  activeTab,
  onTabChange,
  dateRange,
  onDateRangeChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onReset,
  dateRangeOptions = defaultDateRangeOptions,
}) => {
  return (
    <div className="card-custom flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* LEFT: Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100">
        <button
          onClick={() => onTabChange("table")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === "table"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Table2 size={15} />
          Bảng
        </button>
        <button
          onClick={() => onTabChange("chart")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === "chart"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <BarChart3 size={15} />
          Biểu đồ
        </button>
      </div>

      {/* RIGHT: Date Range Filter */}
      <div className="flex items-center gap-2">
        {dateRange === "custom" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate || ""}
              onChange={(e) => onStartDateChange?.(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            <span className="text-slate-400">-</span>
            <input
              type="date"
              value={endDate || ""}
              onChange={(e) => onEndDateChange?.(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        )}

        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 cursor-pointer appearance-none min-w-[150px]"
          >
            {dateRangeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 transition active:scale-95 cursor-pointer"
            title="Đặt lại bộ lọc"
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminFilterTabs;
