import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  type PromotionResponse,
  type PromotionRequest,
  type PromotionCampaignType,
  campaignTypeLabels,
  type PromotionDetailResponse,
} from "../types/promotion.type";
import { BaseStatus } from "@/types/status";
import SelectBox from "@/components/common/SelectedBox";
import InputField from "@/components/common/InputField";

interface PromotionFormProps {
  initialData?: PromotionResponse | PromotionDetailResponse | null;
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
    onSubmit(data);
  };

  return (
    <div className="card-custom space-y-6">
      <form
        id="promotion-form"
        onSubmit={handleSubmit(onFormSubmit)}
        className="space-y-6"
      >
        {/* FORM GRID */}
        <div className="grid grid-cols-1 gap-6">
          {/* Tên chương trình */}
          <InputField<PromotionRequest>
            label="Tên chương trình khuyến mãi"
            name="name"
            register={register}
            rules={{ required: "Vui lòng nhập tên chương trình" }}
            error={errors.name}
            placeholder="Ví dụ: Khuyến Mãi Chào Hè 2026"
          />

          {/* HÀNG GỒM: NGÀY BẮT ĐẦU, NGÀY KẾT THÚC, LOẠI CHIẾN DỊCH, TRẠNG THÁI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Ngày bắt đầu */}
            <InputField<PromotionRequest>
              label="Ngày bắt đầu"
              name="startDate"
              type="date"
              register={register}
              rules={{ required: "Chọn ngày bắt đầu" }}
              error={errors.startDate}
            />

            {/* Ngày kết thúc */}
            <InputField<PromotionRequest>
              label="Ngày kết thúc"
              name="endDate"
              type="date"
              register={register}
              rules={{ required: "Chọn ngày kết thúc" }}
              error={errors.endDate}
            />

            {/* Loại chiến dịch (promotionCampaignType) */}
            <Controller
              name="promotionCampaignType"
              control={control}
              render={({ field }) => (
                <SelectBox<PromotionCampaignType>
                  searchable={false}
                  label="Loại chiến dịch"
                  options={[
                    {
                      label: campaignTypeLabels.PRODUCT_DISCOUNT,
                      value: "PRODUCT_DISCOUNT",
                    },
                    {
                      label: campaignTypeLabels.FLASH_SALE,
                      value: "FLASH_SALE",
                    },
                    {
                      label: campaignTypeLabels.SEASONAL,
                      value: "SEASONAL",
                    },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

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
