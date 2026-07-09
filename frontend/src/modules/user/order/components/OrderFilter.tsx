import type { Dispatch, SetStateAction } from "react";
import { OrderStatusMapping, type OrderStatus } from "../types/order.type";
import InputField from "@/components/common/InputField";
import type { UseFormRegister } from "react-hook-form";
import type { OrderFilterForm } from "../hooks/useOrderFilter";

interface OrderFilterProps {
  register: UseFormRegister<OrderFilterForm>;
  statusFilter: OrderStatus | null;
  setStatusFilter: Dispatch<SetStateAction<OrderStatus | null>>;
  onReset: () => void;
}

export function OrderFilter({
  register,
  statusFilter,
  setStatusFilter,
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
        {/* Date Inputs & Search - Phía trên */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1">
            <InputField
              name="keyword"
              type="text"
              register={register}
              placeholder="Tìm theo tên khách hàng..."
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <InputField
              name="createDate"
              type="date"
              register={register}
              placeholder="Ngày bắt đầu"
            />
            <InputField
              name="endDate"
              type="date"
              register={register}
              placeholder="Ngày kết thúc"
            />
          </div>
        </div>

        {/* Status Buttons & Reset - Phía dưới */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter(null)}
              className={`px-3 py-1 text-sm rounded cursor-pointer ${
                statusFilter === null
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tất cả
            </button>
            {(Object.keys(OrderStatusMapping) as OrderStatus[]).map((status) => (
              <button
                key={status}
                onClick={() =>
                  setStatusFilter(statusFilter === status ? null : status)
                }
                className={`px-3 py-1 text-sm rounded cursor-pointer ${
                  statusFilter === status
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {OrderStatusMapping[status]}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onReset}
            className="px-4 py-1.5 text-sm font-medium rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
          >
            Làm mới
          </button>
        </div>
      </div>
    </>
  );
}
