import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Save, ArrowLeft, Ticket, Calendar, Percent, DollarSign } from "lucide-react";
import type { VoucherItem, VoucherRequest } from "../types/voucher.type";
import { BaseStatus, getBaseStatusLabel } from "@/types/status";

interface VoucherFormProps {
  initialData?: VoucherItem | null;
  onSubmit: (data: VoucherRequest) => void;
  onCancel: () => void;
}

const VoucherForm: React.FC<VoucherFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VoucherRequest>({
    defaultValues: {
      code: "",
      name: "",
      discountType: "FIXED",
      discountValue: 30000,
      minOrderValue: 200000,
      maxDiscountValue: 50000,
      startDate: "2026-06-01",
      endDate: "2026-06-30",
      quantity: 100,
      status: BaseStatus.ACTIVE,
      description: "",
    },
  });

  const selectedDiscountType = watch("discountType");

  useEffect(() => {
    if (initialData) {
      reset({
        code: initialData.code,
        name: initialData.name,
        discountType: initialData.discountType,
        discountValue: initialData.discountValue,
        minOrderValue: initialData.minOrderValue,
        maxDiscountValue: initialData.maxDiscountValue || 0,
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        quantity: initialData.quantity,
        status: initialData.status,
        description: initialData.description || "",
      });
    } else {
      reset({
        code: "",
        name: "",
        discountType: "FIXED",
        discountValue: 30000,
        minOrderValue: 200000,
        maxDiscountValue: 50000,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        quantity: 100,
        status: BaseStatus.ACTIVE,
        description: "",
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = (data: VoucherRequest) => {
    onSubmit(data);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6 animate-[fade-in_0.2s_ease-out]">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* TOP BUTTONS & SECTION TITLE */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Ticket size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isEdit ? `Hiệu chỉnh Voucher: ${initialData.code}` : "Phát hành Voucher giảm giá mới"}
              </h2>
              <p className="text-xs text-slate-500">Thiết lập các điều kiện giảm giá cho đơn hàng mua sắm</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft size={14} /> Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Save size={14} /> {isEdit ? "Cập nhật Voucher" : "Lưu Voucher"}
            </button>
          </div>
        </div>

        {/* FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mã Voucher */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Mã Voucher <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              disabled={isEdit}
              placeholder="Ví dụ: HELLOSUMMER"
              {...register("code", { required: "Vui lòng nhập mã Voucher" })}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border font-mono uppercase transition-all ${
                isEdit ? "bg-slate-100 text-slate-500 cursor-not-allowed" : "bg-slate-50/50 border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              }`}
            />
            {errors.code && (
              <p className="text-xs text-rose-500 font-medium">{errors.code.message}</p>
            )}
          </div>

          {/* Tên hiển thị Voucher */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Tên voucher <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Voucher giảm 30K cho đơn từ 200K"
              {...register("name", { required: "Vui lòng nhập tên voucher" })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
            {errors.name && (
              <p className="text-xs text-rose-500 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Hình thức giảm giá */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Hình thức giảm giá</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setValue("discountType", "FIXED")}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  selectedDiscountType === "FIXED"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <DollarSign size={14} /> Số tiền cố định (VNĐ)
              </button>
              <button
                type="button"
                onClick={() => setValue("discountType", "PERCENT")}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  selectedDiscountType === "PERCENT"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Percent size={14} /> Theo phần trăm (%)
              </button>
            </div>
          </div>

          {/* Giá trị giảm */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Mức giảm {selectedDiscountType === "PERCENT" ? "(%)" : "(VNĐ)"} <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              placeholder={selectedDiscountType === "PERCENT" ? "15" : "30000"}
              {...register("discountValue", { required: true, valueAsNumber: true })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* Giá trị đơn hàng tối thiểu */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Giá trị đơn tối thiểu (VNĐ)</label>
            <input
              type="number"
              placeholder="200000"
              {...register("minOrderValue", { valueAsNumber: true })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* Giảm tối đa (Nếu theo %) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Mức giảm tối đa (VNĐ)</label>
            <input
              type="number"
              disabled={selectedDiscountType !== "PERCENT"}
              placeholder="50000"
              {...register("maxDiscountValue", { valueAsNumber: true })}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all ${
                selectedDiscountType !== "PERCENT"
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "border-slate-200 bg-slate-50/50 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              }`}
            />
          </div>

          {/* Số lượng phát hành */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Tổng số lượt phát hành</label>
            <input
              type="number"
              placeholder="100"
              {...register("quantity", { required: true, valueAsNumber: true })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* Trạng thái */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Trạng thái phát hành</label>
            <select
              {...register("status")}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 cursor-pointer"
            >
              <option value={BaseStatus.ACTIVE}>{getBaseStatusLabel(BaseStatus.ACTIVE)}</option>
              <option value={BaseStatus.INACTIVE}>{getBaseStatusLabel(BaseStatus.INACTIVE)}</option>
              <option value={BaseStatus.DELETED}>{getBaseStatusLabel(BaseStatus.DELETED)}</option>
            </select>
          </div>

          {/* Thời hạn áp dụng */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Calendar size={13} /> Ngày bắt đầu
            </label>
            <input
              type="date"
              {...register("startDate", { required: true })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Calendar size={13} /> Ngày kết thúc
            </label>
            <input
              type="date"
              {...register("endDate", { required: true })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* Mô tả */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-slate-700">Điều kiện & Điều khoản áp dụng</label>
            <textarea
              rows={3}
              placeholder="Ghi chú điều kiện sử dụng mã voucher..."
              {...register("description")}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 resize-none"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default VoucherForm;
