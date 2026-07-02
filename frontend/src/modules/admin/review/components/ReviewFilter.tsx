import React from "react";
import { Search, RotateCcw } from "lucide-react";

interface ReviewFilterProps {
  search: string;
  onSearchChange: (val: string) => void;
  ratingFilter: string;
  onRatingFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  onReset: () => void;
}

const ReviewFilter: React.FC<ReviewFilterProps> = ({
  search,
  onSearchChange,
  ratingFilter,
  onRatingFilterChange,
  statusFilter,
  onStatusFilterChange,
  onReset,
}) => {
  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="relative lg:col-span-2">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm người mua, sách hoặc mã đơn..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
        />
      </div>

      <div>
        <select
          value={ratingFilter}
          onChange={(event) => onRatingFilterChange(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 cursor-pointer"
        >
          <option value="ALL">Tất cả số sao</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="LTE3">3 sao trở xuống</option>
        </select>
      </div>

      <div className="flex gap-2">
        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 cursor-pointer"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="Đã duyệt">Đã duyệt</option>
          <option value="Chờ duyệt">Chờ duyệt</option>
          <option value="Bị báo cáo">Bị báo cáo</option>
        </select>

        <button
          onClick={onReset}
          className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50 transition active:scale-95 cursor-pointer"
          title="Làm mới bộ lọc"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
};

export default ReviewFilter;
