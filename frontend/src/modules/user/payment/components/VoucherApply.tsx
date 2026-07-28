import { useState } from "react";
import { X, Loader2, Tag, ChevronRight } from "lucide-react";
import type { VoucherUserResponse } from "@/modules/admin/voucher/types/voucher.type";
import {
  useGetVoucherForUser,
  useGetVoucherForUserMutation,
} from "@/modules/admin/voucher/hooks/useVoucher";
import VoucherModal from "@/modules/user/payment/components/VoucherModal";
import { formatMoney } from "../../../../utils/number.utils";

interface VoucherApplyProps {
  appliedCoupon: VoucherUserResponse | null;
  voucherDiscount?: number;
  onRemoveCoupon: () => void;
  onOpenModal?: () => void;
  onSelectCoupon?: (coupon: VoucherUserResponse) => void;
  /** Giá sau giảm sản phẩm, dùng để tính số mã khả dụng */
  subtotal?: number;
}

export function VoucherApply({
  appliedCoupon,
  voucherDiscount = 0,
  onRemoveCoupon,
  onOpenModal,
  onSelectCoupon,
  subtotal = 0,
}: VoucherApplyProps) {
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: vouchers = [] } = useGetVoucherForUser();
  const voucherMutation = useGetVoucherForUserMutation();

  const eligibleCount = vouchers.filter(
    (v) => v.minOrderValue <= 0 || subtotal >= v.minOrderValue,
  ).length;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCode = code.trim();
    if (!trimmedCode) return;
    setErrorMsg("");

    voucherMutation.mutate(trimmedCode, {
      onSuccess: (voucherData) => {
        const list = Array.isArray(voucherData) ? voucherData : [voucherData];
        // Phải tìm đúng voucher khớp với code người dùng nhập
        const selected = list.find(
          (v) => v.code.toLowerCase() === trimmedCode.toLowerCase(),
        );
        if (selected) {
          // check minOrderValue
          if (selected.minOrderValue > 0 && subtotal < selected.minOrderValue) {
            setErrorMsg(
              `Đơn hàng chưa đủ điều kiện tối thiểu ` +
                formatMoney(selected.minOrderValue),
            );
            return;
          }
          onSelectCoupon?.(selected);
          setCode("");
          setErrorMsg("");
        } else {
          setErrorMsg("Mã giảm giá không tồn tại hoặc đã hết hạn sử dụng.");
        }
      },
      onError: (error: unknown) => {
        const msg =
          error instanceof Error ? error.message : "Mã giảm giá không hợp lệ.";
        setErrorMsg(msg);
      },
    });
  };
  const openModal = () => {
    if (onOpenModal) {
      onOpenModal();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleSelect = (voucher: VoucherUserResponse) => {
    onSelectCoupon?.(voucher);
    setIsModalOpen(false);
  };
  return (
    <>
      <div className="card-custom space-y-3">
        <div className="flex items-center gap-2">
          <Tag size={18} className="text-red-600" />
          <h2 className="text-base font-bold text-slate-900">Mã giảm giá</h2>
        </div>

        {appliedCoupon ? (
          <div className="relative overflow-hidden rounded-xl border border-green-300/50 bg-linear-to-r from-green-50 to-emerald-50/60 p-3.5">
            {/* Decorative ticket notches */}
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border border-green-300/50" />
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border border-green-300/50" />

            <div className="flex items-center gap-3 pl-2">
              {/* Left: icon + info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 rounded-md bg-green-600 px-2 py-0.5 text-[11px] font-extrabold tracking-widest text-white uppercase">
                    <Tag size={10} />
                    {appliedCoupon.code}
                  </span>
                  {voucherDiscount > 0 && (
                    <span className="text-sm font-extrabold text-green-700 tabular-nums">
                      -{formatMoney(voucherDiscount)}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-green-800/80 truncate">
                  {appliedCoupon.name}
                </p>
              </div>

              {/* Right: remove */}
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-green-600 hover:bg-green-100 hover:text-green-800 transition"
                title="Gỡ mã giảm giá"
              >
                <X size={15} />
              </button>
            </div>

            {/* Bottom dashed divider line */}
            <div className="mt-2.5 ml-2 border-t border-dashed border-green-300/60" />
            <p className="mt-1.5 ml-2 text-[10px] text-green-600/70 font-medium">
              ✓ Mã giảm giá đã được áp dụng
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            <form onSubmit={handleApply} className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="Nhập mã giảm giá..."
                className={`flex-1 rounded-xl border px-3.5 py-2 text-sm outline-none uppercase font-semibold transition ${
                  errorMsg
                    ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400 bg-red-50/30"
                    : "border-slate-200 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                }`}
              />
              <button
                type="submit"
                disabled={!code.trim() || voucherMutation.isPending}
                className="flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {voucherMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Áp dụng"
                )}
              </button>
            </form>

            {/* Inline error message */}
            {errorMsg && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1 duration-200">
                <span className="shrink-0">✕</span>
                {errorMsg}
              </p>
            )}

            <button
              type="button"
              onClick={openModal}
              className="w-full flex items-center justify-between rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-100/50 transition group cursor-pointer"
            >
              <span>🏷️ Chọn từ danh sách ({eligibleCount} mã khả dụng)</span>
              <ChevronRight
                size={16}
                className="text-slate-400 group-hover:text-slate-600"
              />
            </button>
          </div>
        )}
      </div>
      {!onOpenModal && (
        <VoucherModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          appliedCoupon={appliedCoupon}
          onSelect={handleSelect}
          subtotal={subtotal}
        />
      )}
    </>
  );
}
