import React from "react";
import { Search, RotateCcw } from "lucide-react";
import { BaseStatus, getBaseStatusLabel } from "@/types/status";

interface VoucherFilterProps {
  search: string;
  statusFilter: string;
  onSearchChange: (val: string) => void;
  onStatusFilterChange: (val: string) => void;
  onReset: () => void;
}

const VoucherFilter: React.FC<VoucherFilterProps> = ({
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onReset,
}) => {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
      {/* Search bar */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm theo mã voucher hoặc tên..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
        />
      </div>

      {/* Status dropdown */}
      <div className="w-full md:w-56">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 cursor-pointer"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value={BaseStatus.ACTIVE}>{getBaseStatusLabel(BaseStatus.ACTIVE)}</option>
          <option value={BaseStatus.INACTIVE}>{getBaseStatusLabel(BaseStatus.INACTIVE)}</option>
          <option value={BaseStatus.DELETED}>{getBaseStatusLabel(BaseStatus.DELETED)}</option>
        </select>
      </div>

      {/* Reset button */}
      <button
        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
        onClick={onReset}
      >
        <RotateCcw size={16} />
        Làm mới
      </button>
    </div>
  );
};

export default VoucherFilter;
