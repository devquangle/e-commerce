import React, { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
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
  onValuesChange?: (values: { startDate: string; endDate: string }) => void;
}

const getLocalTodayStr = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getLocalFutureDateStr = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const PromotionForm: React.FC<PromotionFormProps> = ({
  initialData,
  onSubmit,
  onValuesChange,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, dirtyFields },
    setValue,
    trigger,
  } = useForm<PromotionRequest>({
    mode: "onChange",
    defaultValues: {
      name: "",
      startDate: getLocalTodayStr(),
      endDate: getLocalFutureDateStr(30),
      status: BaseStatus.ACTIVE,
      promotionCampaignType: "PRODUCT_DISCOUNT",
    },
  });

  const watchedStartDate = useWatch({ control, name: "startDate" }) as
    | string
    | "";
  const watchedEndDate = useWatch({ control, name: "endDate" }) as string | "";

  useEffect(() => {
    if (dirtyFields.startDate && watchedStartDate) {
      const start = new Date(watchedStartDate);
      if (!isNaN(start.getTime())) {
        const end = new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);
        const endStr = end.toISOString().split("T")[0];
        setValue("endDate", endStr, { shouldDirty: true, shouldValidate: true });
      }
    }
    if (watchedStartDate) {
      trigger("endDate");
    }
  }, [watchedStartDate, dirtyFields.startDate, setValue, trigger]);

  useEffect(() => {
    if (onValuesChange) {
      onValuesChange({
        startDate: watchedStartDate ?? "",
        endDate: watchedEndDate ?? "",
      });
    }
  }, [watchedStartDate, watchedEndDate, onValuesChange]);

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
        startDate: getLocalTodayStr(),
        endDate: getLocalFutureDateStr(30),
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
        <div className="grid grid-cols-1 gap-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
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
              rules={{
                required: "Chọn ngày kết thúc",
                validate: (value) => {
                  if (!watchedStartDate || !value) return true;
                  return (
                    value > watchedStartDate ||
                    "Ngày kết thúc phải sau ngày bắt đầu"
                  );
                },
              }}
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
