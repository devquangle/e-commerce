import React, { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Calendar, Percent, Flame, Sparkles } from "lucide-react";
import {
  type PromotionResponse,
   type PromotionRequest,
  campaignTypeLabels,
} from "../types/promotion.type";
import { BaseStatus } from "@/types/status";
import SelectBox from "@/components/common/SelectedBox";

interface PromotionFormProps {
  initialData?: PromotionResponse | null;
  onSubmit: (data: PromotionRequest) => void;
}

const PromotionForm: React.FC<PromotionFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<PromotionRequest>({
    defaultValues: {
      name: "",
      startDate: "2026-06-01",
      endDate: "2026-06-30",
      status: BaseStatus.ACTIVE,
      promotionCampaignType: "PRODUCT_DISCOUNT",
    },
  });

  const selectedCampaignType = useWatch({
    control,
    name: "promotionCampaignType",
    defaultValue: initialData?.promotionCampaignType ?? "PRODUCT_DISCOUNT",
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        status: initialData.status,
        promotionCampaignType: initialData.promotionCampaignType,
      });
    } else {
      reset({
        name: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        status: BaseStatus.ACTIVE,
        promotionCampaignType: "PRODUCT_DISCOUNT",
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = (data: PromotionRequest) => {

    onSubmit(data)
  };

  return (
    <div className="card-custom space-y-6">
      <form
        id="promotion-form"
        onSubmit={handleSubmit(onFormSubmit)}
        className="space-y-6"
      >
        {/* FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tên chương trình */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-slate-700">
              Tên chương trình khuyến mãi{" "}
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Khuyến Mãi Chào Hè 2026"
              {...register("name", {
                required: "Vui lòng nhập tên chương trình",
              })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
            {errors.name && (
              <p className="text-xs text-rose-500 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Loại chiến dịch (promotionCampaignType) */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-slate-700">
              Loại chiến dịch
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() =>
                  setValue("promotionCampaignType", "PRODUCT_DISCOUNT")
                }
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  selectedCampaignType === "PRODUCT_DISCOUNT"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Percent size={14} /> {campaignTypeLabels.PRODUCT_DISCOUNT}
              </button>
              <button
                type="button"
                onClick={() => setValue("promotionCampaignType", "FLASH_SALE")}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  selectedCampaignType === "FLASH_SALE"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Flame size={14} /> {campaignTypeLabels.FLASH_SALE}
              </button>
              <button
                type="button"
                onClick={() => setValue("promotionCampaignType", "SEASONAL")}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  selectedCampaignType === "SEASONAL"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Sparkles size={14} /> {campaignTypeLabels.SEASONAL}
              </button>
            </div>
          </div>

          {/* HÀNG GỒM: NGÀY BẮT ĐẦU, NGÀY KẾT THÚC, TRẠNG THÁI CÙNG 1 HÀNG */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:col-span-2">
            {/* Ngày bắt đầu */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Calendar size={13} /> Ngày bắt đầu
              </label>
              <input
                type="date"
                {...register("startDate", { required: "Chọn ngày bắt đầu" })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            {/* Ngày kết thúc */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Calendar size={13} /> Ngày kết thúc
              </label>
              <input
                type="date"
                {...register("endDate", { required: "Chọn ngày kết thúc" })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            {/* Trạng thái (status) */}
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <SelectBox<BaseStatus>
                  searchable={false}
                  label="Trạng thái"
                  options={[
                    { label: "Hoạt động", value: BaseStatus.ACTIVE },
                    { label: "Tạm Ngưng", value: BaseStatus.INACTIVE },
                  ]}
                  value={field.value as BaseStatus}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PromotionForm;
