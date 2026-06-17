import { X, Check } from "lucide-react";
import type { CouponOption } from "@/types/cart.type";
import { MOCK_COUPONS } from "@/types/cart.type";

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  appliedCoupon: CouponOption | null;
  onSelect: (coupon: CouponOption) => void;
}

export default function VoucherModal({
  isOpen,
  onClose,
  appliedCoupon,
  onSelect,
}: VoucherModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-[32px] bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200/60 px-6 py-5 flex items-center justify-between rounded-t-[32px]">
          <h2 className="text-xl font-bold text-slate-900">Chọn mã giảm giá</h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {MOCK_COUPONS.map((coupon) => (
            <button
              key={coupon.code}
              onClick={() => {
                onSelect(coupon);
                onClose();
              }}
              className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 text-left ${
                appliedCoupon?.code === coupon.code
                  ? "border-red-600 bg-red-50"
                  : "border-slate-200/60 bg-white hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {coupon.code}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1.5">
                    {coupon.description}
                  </p>
                </div>
                {appliedCoupon?.code === coupon.code && (
                  <div className="ml-4 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 shrink-0">
                    <Check size={16} className="text-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent px-6 py-5 border-t border-slate-200/60">
          <button
            onClick={onClose}
            className="w-full h-14 rounded-2xl bg-slate-100 text-slate-900 font-bold text-base hover:bg-slate-200 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </>
  );
}
