import React from "react";
import { Search, RotateCcw } from "lucide-react";
import { BaseStatus } from "@/types/status";
import SelectBox from "@/components/common/SelectedBox";
import InputField from "@/components/common/InputField";
import type { FieldValues, UseFormRegister } from "react-hook-form";

interface PromotionFilterProps {
  search: string;
  statusFilter: string;
  campaignTypeFilter: string;
  startDateFilter: string;
  endDateFilter: string;
  onSearchChange: (val: string) => void;
  onStatusFilterChange: (val: string) => void;
  onCampaignTypeFilterChange: (val: string) => void;
  onStartDateFilterChange: (val: string) => void;
  onEndDateFilterChange: (val: string) => void;
  onReset: () => void;
}

const mockRegister = (name: string, value: string, onChange: (val: string) => void) => {
  return {
    name,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    ref: () => {},
  };
};

const PromotionFilter: React.FC<PromotionFilterProps> = ({
  search,
  statusFilter,
  campaignTypeFilter,
  startDateFilter,
  endDateFilter,
  onSearchChange,
  onStatusFilterChange,
  onCampaignTypeFilterChange,
  onStartDateFilterChange,
  onEndDateFilterChange,
  onReset,
}) => {
  return (
    <div className="mb-5 flex flex-col gap-4">
      {/* Top row: Search & Reset */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã hoặc tên khuyến mãi..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
        </div>
        <button
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 h-11 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer md:w-auto w-full"
          onClick={onReset}
        >
          <RotateCcw size={16} />
          Làm mới
        </button>
      </div>

      {/* Bottom row: Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Status */}
        <div>
          <SelectBox<string>
            label="Trạng thái"
            options={[
              { label: "Tất cả trạng thái", value: "ALL" },
              { label: "Hoạt động", value: BaseStatus.ACTIVE },
              { label: "Tạm ngưng", value: BaseStatus.INACTIVE },
              { label: "Đã xóa", value: BaseStatus.DELETED },
            ]}
            value={statusFilter}
            onChange={(val) => onStatusFilterChange(val || "ALL")}
            searchable={false}
          />
        </div>

        {/* Campaign Type */}
        <div>
          <SelectBox<string>
            label="Loại chiến dịch"
            options={[
              { label: "Tất cả chiến dịch", value: "ALL" },
              { label: "Giảm giá sản phẩm", value: "PRODUCT_DISCOUNT" },
              { label: "Flash Sale", value: "FLASH_SALE" },
              { label: "Khuyến mãi theo mùa", value: "SEASONAL" },
            ]}
            value={campaignTypeFilter}
            onChange={(val) => onCampaignTypeFilterChange(val || "ALL")}
            searchable={false}
          />
        </div>

        {/* Start Date */}
        <div>
          <InputField
            label="Ngày bắt đầu từ"
            name="startDate"
            type="date"
            register={
              (() =>
                mockRegister(
                  "startDate",
                  startDateFilter,
                  onStartDateFilterChange,
                )) as unknown as UseFormRegister<FieldValues>
            }
          />
        </div>

        {/* End Date */}
        <div>
          <InputField
            label="Đến ngày"
            name="endDate"
            type="date"
            register={
              (() =>
                mockRegister(
                  "endDate",
                  endDateFilter,
                  onEndDateFilterChange,
                )) as unknown as UseFormRegister<FieldValues>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PromotionFilter;

