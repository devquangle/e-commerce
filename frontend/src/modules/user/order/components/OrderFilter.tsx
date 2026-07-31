import { OrderStatusMapping, type OrderStatus } from "../types/order.type";
import { RotateCcw, Search, Calendar } from "lucide-react";
import Button from "@/components/common/Button";

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
        {/* Search & Date Controls */}
        <div className="flex flex-col xl:flex-row gap-3 w-full">
          {/* Keyword Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              placeholder="Tìm theo mã, tên và số điện thoại khách hàng..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          {/* Dates & Reset */}
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            {/* Start Date */}
            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 h-11 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all flex-1 sm:flex-none min-w-[150px]">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                Từ:
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                title="Từ ngày"
                className="bg-transparent text-sm text-slate-800 outline-none cursor-pointer w-full min-w-0"
              />
            </div>

            {/* End Date */}
            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 h-11 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all flex-1 sm:flex-none min-w-[150px]">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                Đến:
              </span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                title="Đến ngày"
                className="bg-transparent text-sm text-slate-800 outline-none cursor-pointer w-full min-w-0"
              />
            </div>

            {/* Reset Button */}
            <Button
              color="secondary"
              icon={RotateCcw}
              onClick={onReset}
              className="h-11 whitespace-nowrap shrink-0"
            >
              Làm mới
            </Button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onStatusChange(null)}
            className={`px-3.5 py-1.5 text-sm rounded-lg font-medium cursor-pointer transition ${
              status === null
                ? "bg-indigo-600 text-white shadow-sm"
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
              className={`px-3.5 py-1.5 text-sm rounded-lg font-medium cursor-pointer transition ${
                status === st
                  ? "bg-indigo-600 text-white shadow-sm"
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
