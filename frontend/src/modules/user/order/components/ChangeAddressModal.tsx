import { useEffect } from "react";
import Modal from "@/components/common/Modal";
import InputField from "@/components/common/InputField";
import TextAreaField from "@/components/common/TextAreaField";
import SelectBox from "@/components/common/SelectedBox";
import { MapPin } from "lucide-react";
import { toast } from "react-toastify";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  useProvinces,
  useDistricts,
  useWards,
} from "@/modules/user/address/hooks/useAddressGHN";
import type { OrderResponse } from "../types/order.type";

interface ChangeAddressFormData {
  fullName: string;
  phone: string;
  provinceId: number;
  districtId: number;
  wardCode: string;
  street: string;
}

interface ChangeAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderResponse | null;
  onSuccess?: () => void;
}

export function ChangeAddressModal({
  isOpen,
  onClose,
  order,
  onSuccess,
}: ChangeAddressModalProps) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangeAddressFormData>();

  /* ================= WATCH ================= */
  const provinceId = useWatch({ control, name: "provinceId" });
  const districtId = useWatch({ control, name: "districtId" });

  /* ================= GHN DATA ================= */
  const { data: provinces = [] } = useProvinces();
  const { data: districts = [] } = useDistricts(provinceId);
  const { data: wards = [] } = useWards(districtId);

  // Sync thông tin địa chỉ từ order khi modal mở hoặc order thay đổi
  useEffect(() => {
    if (order && isOpen) {
      reset({
        fullName: order.fullName || "",
        phone: order.phone || "",
        street: order.street || "",
        provinceId: order.provinceId,
        districtId: order.districtId,
        wardCode: order.wardCode,
      });
    }
  }, [order, isOpen, reset]);

  // Set district once districts options are loaded and contain the required district
  useEffect(() => {
    if (order && districts.some((d) => d.DistrictID === order.districtId)) {
      setValue("districtId", order.districtId);
    }
  }, [order, districts, setValue]);

  // Set ward once wards options are loaded and contain the required ward
  useEffect(() => {
    if (order && wards.some((w) => w.WardCode === order.wardCode)) {
      setValue("wardCode", order.wardCode);
    }
  }, [order, wards, setValue]);

  if (!order) return null;

  const onSubmit = async (data: ChangeAddressFormData) => {
    try {
      console.log("Cập nhật địa chỉ đơn hàng:", data);
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success(`Đã cập nhật địa chỉ nhận hàng cho đơn hàng #${order.orderCode}`);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật địa chỉ thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit(onSubmit)}
      title="Thay đổi địa chỉ giao hàng"
      confirmText={isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
      cancelText="Hủy"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-16">
        {/* Banner thông tin đơn hàng */}
        <div className="flex items-center gap-3 p-3 bg-blue-50/70 rounded-xl border border-blue-200/60 text-blue-900">
          <MapPin size={20} className="text-blue-600 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-blue-900">
              Cập nhật địa chỉ nhận hàng cho đơn #{order.orderCode}
            </p>
            <p className="text-blue-700">
              Lưu ý: Chỉ áp dụng đối với đơn hàng ở trạng thái Chờ xử lý.
            </p>
          </div>
        </div>

        {/* HỌ VÀ TÊN + SỐ ĐIỆN THOẠI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Họ và tên"
            name="fullName"
            register={register}
            rules={{ required: "Họ và tên không được bỏ trống" }}
            error={errors.fullName}
          />

          <InputField
            label="Số điện thoại"
            name="phone"
            register={register}
            rules={{
              required: "Số điện thoại không được bỏ trống",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Số điện thoại không đúng định dạng",
              },
            }}
            error={errors.phone}
          />
        </div>

        {/* TỈNH/THÀNH + QUẬN/HUYỆN + PHƯỜNG/XÃ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* PROVINCE */}
          <Controller
            name="provinceId"
            control={control}
            rules={{ required: "Vui lòng chọn Tỉnh/Thành" }}
            render={({ field, fieldState }) => (
              <div>
                <SelectBox<number>
                  label="Tỉnh/Thành"
                  placeholder="Chọn Tỉnh/Thành"
                  options={provinces.map((p) => ({
                    label: p.ProvinceName ?? "",
                    value: p.ProvinceID,
                  }))}
                  value={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                    field.onBlur();
                    setValue("districtId", undefined as unknown as number);
                    setValue("wardCode", undefined as unknown as string);
                  }}
                />
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* DISTRICT */}
          <Controller
            name="districtId"
            control={control}
            rules={{ required: "Vui lòng chọn Quận/Huyện" }}
            render={({ field, fieldState }) => (
              <div>
                <SelectBox<number>
                  label="Quận/Huyện"
                  placeholder="Chọn Quận/Huyện"
                  options={districts.map((d) => ({
                    label: d.DistrictName ?? "",
                    value: d.DistrictID,
                  }))}
                  value={field.value}
                  disabled={!provinceId}
                  onChange={(val) => {
                    field.onChange(val);
                    field.onBlur();
                    setValue("wardCode", undefined as unknown as string);
                  }}
                />
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* WARD */}
          <Controller
            name="wardCode"
            control={control}
            rules={{ required: "Vui lòng chọn Phường/Xã" }}
            render={({ field, fieldState }) => (
              <div>
                <SelectBox<string>
                  label="Phường/Xã"
                  placeholder="Chọn Phường/Xã"
                  options={wards.map((w) => ({
                    label: w.WardName ?? "",
                    value: w.WardCode,
                  }))}
                  value={field.value}
                  disabled={!districtId}
                  onChange={(val) => {
                    field.onChange(val);
                    field.onBlur();
                  }}
                />
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* STREET */}
        <TextAreaField<ChangeAddressFormData>
          label="Địa chỉ cụ thể"
          name="street"
          register={register}
          rules={{ required: "Địa chỉ không được bỏ trống" }}
          error={errors.street}
          rows={4}
          placeholder="Số nhà, tên đường..."
        />
      </form>
    </Modal>
  );
}
