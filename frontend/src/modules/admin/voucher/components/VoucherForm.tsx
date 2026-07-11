import React from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import type { VoucherRequest } from "../types/voucher.type";
import { VoucherStatus, getVoucherStatusLabel } from "../types/voucher.status";
import InputField from "@/components/common/InputField";
import SelectedBox from "@/components/common/SelectedBox";

export interface VoucherFormProps {
  form: UseFormReturn<VoucherRequest>;
  isEdit?: boolean;
}

const VoucherForm: React.FC<VoucherFormProps> = ({ form, isEdit = false }) => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = form;

  const currentStatus = useWatch({ control, name: "status" });

  return (
    <div className="card-custom space-y-6 flex-1">
      <div className="space-y-6">
        {/* FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mã Voucher */}
          <InputField<VoucherRequest>
            label="Mã Voucher"
            name="code"
            register={register}
            rules={{ required: "Vui lòng nhập mã Voucher" }}
            error={errors.code}
            disabled={isEdit}
            placeholder="Ví dụ: HELLOSUMMER"
            className="font-mono uppercase"
          />

          {/* Tên hiển thị Voucher */}
          <InputField<VoucherRequest>
            label="Tên voucher"
            name="name"
            register={register}
            rules={{ required: "Vui lòng nhập tên voucher" }}
            error={errors.name}
            placeholder="Ví dụ: Voucher giảm 30K cho đơn từ 200K"
          />

          {/* Thời hạn áp dụng */}
          <InputField<VoucherRequest>
            label="Ngày bắt đầu"
            name="startDate"
            type="date"
            register={register}
            rules={{ required: "Vui lòng chọn ngày bắt đầu" }}
            error={errors.startDate}
          />

          <InputField<VoucherRequest>
            label="Ngày kết thúc"
            name="endDate"
            type="date"
            register={register}
            rules={{ required: "Vui lòng chọn ngày kết thúc" }}
            error={errors.endDate}
          />

          {/* Giá trị giảm */}
          <InputField<VoucherRequest>
            label="Mức giảm (%)"
            name="discountValue"
            type="number"
            register={register}
            rules={{
              required: "Vui lòng nhập mức giảm",
              valueAsNumber: true,
              min: { value: 1, message: "Mức giảm phải từ 1%" },
              max: { value: 100, message: "Mức giảm không được quá 100%" },
            }}
            error={errors.discountValue}
            placeholder="10"
          />

          {/* Trạng thái */}
          <div>
            <SelectedBox<VoucherStatus>
              label="Trạng thái phát hành"
              options={[
                {
                  label: getVoucherStatusLabel(VoucherStatus.ACTIVE),
                  value: VoucherStatus.ACTIVE,
                },
                {
                  label: getVoucherStatusLabel(VoucherStatus.INACTIVE),
                  value: VoucherStatus.INACTIVE,
                },
                {
                  label: getVoucherStatusLabel(VoucherStatus.DELETED),
                  value: VoucherStatus.DELETED,
                },
              ]}
              value={currentStatus}
              onChange={(val) =>
                setValue("status", val as VoucherStatus, {
                  shouldValidate: true,
                })
              }
              searchable={false}
              required
            />
          </div>
          {/* Tổng số lượt phát hành */}
          <InputField<VoucherRequest>
            label="Tổng số lượt phát hành"
            name="usageLimit"
            type="number"
            register={register}
            rules={{ required: "Vui lòng nhập số lượng", valueAsNumber: true }}
            error={errors.usageLimit}
            placeholder="100"
          />

          {/* Giảm tối đa */}
          <InputField<VoucherRequest>
            label="Mức giảm tối đa (VNĐ)"
            name="maxDiscountValue"
            type="number"
            register={register}
            rules={{
              required: "Vui lòng nhập mức giảm tối đa",
              valueAsNumber: true,
            }}
            error={errors.maxDiscountValue}
            placeholder="50000"
          />
          {/* Số lượng mỗi user */}
          <InputField<VoucherRequest>
            label="Số lượng mỗi người dùng được sử dụng"
            name="usageLimitPerUser"
            type="number"
            register={register}
            rules={{ required: "Vui lòng nhập số lượng", valueAsNumber: true }}
            error={errors.usageLimitPerUser}
            placeholder="1"
          />
          {/* Giá trị đơn hàng tối thiểu */}
          <InputField<VoucherRequest>
            label="Giá trị đơn tối thiểu (VNĐ)"
            name="minOrderValue"
            type="number"
            register={register}
            rules={{
              required: "Vui lòng nhập giá trị đơn tối thiểu",
              valueAsNumber: true,
            }}
            error={errors.minOrderValue}
            placeholder="200000"
          />
        </div>
      </div>
    </div>
  );
};

export default VoucherForm;
