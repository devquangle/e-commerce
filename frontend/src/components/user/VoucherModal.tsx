import { Check } from "lucide-react";
import type { CouponOption } from "@/modules/user/cart/types/cart.type";
import { MOCK_COUPONS } from "@/modules/user/cart/types/cart.type";
import Modal from "@/components/common/Modal";

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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chọn mã giảm giá"
      cancelText="Đóng"
      size="md"
    >
      <div className="space-y-3">
        {MOCK_COUPONS.map((coupon) => (
          <button
            key={coupon.code}
            onClick={() => {
              onSelect(coupon);
              onClose();
            }}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              appliedCoupon?.code === coupon.code
                ? "border-red-600 bg-red-50"
                : "border-slate-200/60 bg-white hover:border-slate-300 hover:bg-slate-50/50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900">
                  {coupon.code}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
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
    </Modal>
  );
}
