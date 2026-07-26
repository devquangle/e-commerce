import { useState } from "react";
import type { ReactNode } from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

import type { CouponOption } from "@/modules/user/cart/types/cart.type";
import type { AddressResponse } from "@/modules/user/address/types/address";

import VoucherModal from "../../modules/user/payment/components/VoucherModal";
import { ShippingAddress } from "../../modules/user/payment/components/ShippingAddress";
import { VoucherApply } from "../../modules/user/payment/components/VoucherApply";
import { PriceBreakdown } from "./PriceBreakdown";
import { type CouponForm } from "@/types/checkout.type";
import PaymentMethod from "@/modules/user/payment/components/PaymentMethod";
import type { PaymentMethodType } from "@/modules/user/payment/types/payment-method.type";

type CartCheckoutSidebarProps = {
  selectedCount: number;
  subtotal: number;
  /** Giá sau giảm giá sản phẩm, dùng để kiểm tra điều kiện voucher */
  basePrice?: number;
  discount: number;
  voucherDiscount?: number;
  shippingFee?: number;
  total: number;
  hasSelected: boolean;
  /** Địa chỉ đã resolve sẵn từ parent — tránh fetch lại */
  selectedAddress?: AddressResponse | null;
  /** Đang load địa chỉ */
  isAddressLoading?: boolean;
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
  basePrice,
  discount,
  voucherDiscount,
  shippingFee,
  total,
  hasSelected,
  selectedAddress = null,
  isAddressLoading = false,
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
  return (
    <>
      <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start space-y-3">
        {/* 1. Địa chỉ giao hàng */}
        <ShippingAddress selectedAddress={selectedAddress} isLoading={isAddressLoading} />

        {/* 2. Áp dụng mã giảm giá */}
        <VoucherApply
          appliedCoupon={appliedCoupon}
          voucherDiscount={voucherDiscount}
          onRemoveCoupon={onRemoveCoupon}
          onOpenModal={() => setVoucherModalOpen(true)}
          onSelectCoupon={onCouponSelect}
          subtotal={basePrice ?? subtotal}
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
        subtotal={basePrice ?? subtotal}
      />
    </>
  );
}
