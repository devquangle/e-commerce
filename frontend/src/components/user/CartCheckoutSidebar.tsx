import { useState } from "react";
import { CreditCard } from "lucide-react";
import type { ReactNode } from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

import type { CouponOption, PaymentMethodType } from "@/types/cart.type";

import VoucherModal from "./VoucherModal";
import { PaymentMethodOptions } from "./PaymentMethodOptions";

// Import các sub-component sạch sẽ
import { ShippingAddress } from "./ShippingAddress";
import { VoucherApply } from "./VoucherApply";
import { PriceBreakdown } from "./PriceBreakdown";
import { MOCK_CHECKOUT_ADDRESSES, type CouponForm } from "@/types/checkout.type";



type CartCheckoutSidebarProps = {
  selectedCount: number;
  subtotal: number;
  discount: number;
  total: number;
  hasSelected: boolean;
  selectedAddressId: number;
  appliedCoupon: CouponOption | null;
  paymentMethod: PaymentMethodType;
  onPaymentChange: (method: PaymentMethodType) => void;
  onCouponSelect: (coupon: CouponOption) => void;
  onRemoveCoupon: () => void;
  register: UseFormRegister<CouponForm>;
  errors: FieldErrors<CouponForm>;
  couponInput: string;
  primaryAction?: ReactNode;
  backLink?: { to: string; label: string };
  isCheckoutPage?: boolean;
};

export default function CartCheckoutSidebar({
  selectedCount,
  subtotal,
  discount,
  total,
  hasSelected,
  selectedAddressId,
  appliedCoupon,
  paymentMethod,
  onPaymentChange,
  onCouponSelect,
  onRemoveCoupon,
  primaryAction,
  backLink,
}: CartCheckoutSidebarProps) {
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);
  const selectedAddress = MOCK_CHECKOUT_ADDRESSES.find(
    (a) => a.id === selectedAddressId
  );

  return (
    <>
      <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 lg:self-start mb-4">
        <div className="card-custom p-8 space-y-8 bg-white rounded-2xl border border-slate-100 shadow-sm">
          
          {/* 1. Địa chỉ giao hàng */}
          <ShippingAddress selectedAddress={selectedAddress} />

          <div className="border-t border-slate-200/60" />

          {/* 2. Áp dụng mã giảm giá */}
          <VoucherApply
            appliedCoupon={appliedCoupon}
            onRemoveCoupon={onRemoveCoupon}
            onOpenModal={() => setVoucherModalOpen(true)}
          />

          <div className="border-t border-slate-200/60" />

          {/* 3. Phương thức thanh toán */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                <CreditCard size={18} className="text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Phương thức thanh toán
              </h2>
            </div>
            <PaymentMethodOptions
              value={paymentMethod}
              onChange={onPaymentChange}
            />
          </div>

          <div className="border-t border-slate-200/60" />

          {/* 4. Tóm tắt chi phí hóa đơn & Cầm nút CTA */}
          <PriceBreakdown
            selectedCount={selectedCount}
            subtotal={subtotal}
            discount={discount}
            total={total}
            hasSelected={hasSelected}
            primaryAction={primaryAction}
            backLink={backLink}
          />
        </div>
      </div>

      <VoucherModal
        isOpen={voucherModalOpen}
        onClose={() => setVoucherModalOpen(false)}
        appliedCoupon={appliedCoupon}
        onSelect={onCouponSelect}
      />
    </>
  );
}