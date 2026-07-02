import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";

interface OrderFilterProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  onFilterClick?: () => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onFilterClick,
}) => {
  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="relative lg:col-span-2">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm theo mã đơn hoặc khách hàng..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      
      <select 
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-600 bg-white cursor-pointer"
      >
        <option value="ALL">Tất cả trạng thái</option>
        <option value="Chờ xác nhận">Chờ xác nhận</option>
        <option value="Đang xử lý">Đang xử lý</option>
        <option value="Đã giao">Đã giao</option>
        <option value="Đã hủy">Đã hủy</option>
      </select>
      
      <button 
        onClick={onFilterClick}
        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition active:scale-95 cursor-pointer"
      >
        <SlidersHorizontal size={14} />
        Lọc đơn hàng
      </button>
    </div>
  );
};

export default OrderFilter;
