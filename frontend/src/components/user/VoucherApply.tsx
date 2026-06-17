import { Tag, X, ChevronRight } from "lucide-react";
import type { CouponOption } from "@/types/cart.type";
import { MOCK_COUPONS } from "@/types/cart.type";

interface VoucherApplyProps {
  appliedCoupon: CouponOption | null;
  onRemoveCoupon: () => void;
  onOpenModal: () => void;
}

export function VoucherApply({
  appliedCoupon,
  onRemoveCoupon,
  onOpenModal,
}: VoucherApplyProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
          <Tag size={18} className="text-amber-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Mã giảm giá</h2>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between rounded-2xl border border-green-200/60 bg-green-50/30 p-4">
          <div>
            <p className="font-bold text-green-900">{appliedCoupon.code}</p>
            <p className="text-xs text-green-700 mt-1">{appliedCoupon.description}</p>
          </div>
          <button
            type="button"
            onClick={onRemoveCoupon}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onOpenModal}
          className="w-full flex items-center justify-between rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-5 py-5 hover:border-slate-400 hover:bg-slate-100/50 transition group"
        >
          <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">
            🏷️ Có {MOCK_COUPONS.length} voucher có thể sử dụng
          </span>
          <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-600" />
        </button>
      )}
    </div>
  );
}