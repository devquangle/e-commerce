import { useState } from "react";
import type { ReactNode } from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

import type {
  CouponOption,
} from "@/modules/user/cart/types/cart.type";

import VoucherModal from "./VoucherModal";
// Import các sub-component sạch sẽ
import { ShippingAddress } from "./ShippingAddress";
import { VoucherApply } from "./VoucherApply";
import { PriceBreakdown } from "./PriceBreakdown";
import {
  type CouponForm,
} from "@/types/checkout.type";
import PaymentMethod from "@/modules/user/payment/components/PaymentMethod";
import { useAddresses } from "@/modules/user/address/hooks/useAddress";
import type { PaymentMethodType } from "@/modules/user/payment/types/payment-method.type";

type CartCheckoutSidebarProps = {
  selectedCount: number;
  subtotal: number;
  discount: number;
  voucherDiscount?: number;
  shippingFee?: number;
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
  voucherDiscount,
  shippingFee,
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
  isCheckoutPage,
}: CartCheckoutSidebarProps) {
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);
  const { data: addresses = [] } = useAddresses();
  const selectedAddress = addresses.find(
    (a) => a.id === selectedAddressId,
  ) ?? null;

  return (
    <>
      <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 lg:self-start mb-4 space-y-3">
        {/* 1. Địa chỉ giao hàng */}
        <ShippingAddress selectedAddress={selectedAddress} />

        {/* 2. Áp dụng mã giảm giá */}
        <VoucherApply
          appliedCoupon={appliedCoupon}
          voucherDiscount={voucherDiscount}
          onRemoveCoupon={onRemoveCoupon}
          onOpenModal={() => setVoucherModalOpen(true)}
        />
        {/* 3. Phương thức thanh toán */}
        <PaymentMethod value={paymentMethod} onChange={onPaymentChange} />

        {/* 4. Tóm tắt chi phí hóa đơn & Cầm nút CTA */}
        <PriceBreakdown
          selectedCount={selectedCount}
          subtotal={subtotal}
          discount={discount}
          voucherDiscount={voucherDiscount}
          shippingFee={shippingFee}
          total={total}
          hasSelected={hasSelected}
          primaryAction={primaryAction}
          backLink={backLink}
          isCheckout={isCheckoutPage}
        />
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
