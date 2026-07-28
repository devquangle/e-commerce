import { OrderStatusMapping, type OrderStatus } from "../types/order.type";
import { RotateCcw } from "lucide-react";

interface OrderFilterProps {
  keyword: string;
  startDate: string;
  endDate: string;
  status: OrderStatus | null;

  onKeywordChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onStatusChange: (status: OrderStatus | null) => void;
  onReset: () => void;
}

export function OrderFilter({
  keyword,
  startDate,
  endDate,
  status,
  onKeywordChange,
  onStartDateChange,
  onEndDateChange,
  onStatusChange,
  onReset,
}: OrderFilterProps) {
  return (
    <>
      <div className="flex justify-between items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Danh sách đơn hàng
        </h2>
      </div>
      {/* Filter */}
      <div className="flex flex-col gap-4 mb-4">
        {/* Date Inputs & Search */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1">
            <input
              type="text"
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              placeholder="Tìm theo tên khách hàng..."
              className="w-full h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto items-center">
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              placeholder="Ngày bắt đầu"
              className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              placeholder="Ngày kết thúc"
              className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-2 h-11 px-4 text-sm font-medium rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer whitespace-nowrap"
            >
              <RotateCcw size={16} />
              Làm mới
            </button>
          </div>
        </div>

        {/* Status Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onStatusChange(null)}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium cursor-pointer transition ${
              status === null
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tất cả
          </button>
          {(Object.keys(OrderStatusMapping) as OrderStatus[]).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => onStatusChange(status === st ? null : st)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium cursor-pointer transition ${
                status === st
                  ? "bg-blue-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {OrderStatusMapping[st]}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
