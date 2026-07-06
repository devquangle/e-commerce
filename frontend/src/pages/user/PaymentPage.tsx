import Container from "@/components/common/Container";

import {
  CheckoutMobileBar,
} from "@/components/user/CheckoutUI";
import {
  type CartItemUI,
  type CouponOption,
  MOCK_CART_ITEMS,
} from "@/modules/user/cart/types/cart.type";
import { showSuccessToast, showWarningToast } from "@/utils/toastUtil";
import { Package } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getSelectedAddressId, type CouponForm } from "@/types/checkout.type";
import CartCheckoutSidebar from "@/components/user/CartCheckoutSidebar";
import CartItemCard from "@/modules/user/cart/components/CartItemCard";
import type { PaymentMethodType } from "@/modules/user/payment/types/payment-method.type";
import { CheckoutEmptyState } from "@/modules/user/cart/components/CheckoutEmptyState";

interface CheckoutState {
  checkedItems?: CartItemUI[];
  appliedCoupon?: CouponOption | null;
  paymentMethod?: PaymentMethodType;
  selectedAddressId?: number;
}

function getInitialItems(state: CheckoutState): CartItemUI[] {
  if (state.checkedItems?.length) {
    return state.checkedItems.map((i) => ({ ...i, checked: true }));
  }
  return MOCK_CART_ITEMS.filter((i) => i.checked).map((i) => ({
    ...i,
    checked: true,
  }));
}


const mobilePrimaryButtonClass =
  "rounded-2xl bg-red-600 px-6 py-3.5 text-base font-bold text-white shadow-lg active:scale-95 transition hover:bg-red-700";

export default function PaymentPage() {
  const location = useLocation();
  const checkoutState = (location.state as CheckoutState) ?? {};

  const [items, setItems] = useState<CartItemUI[]>(() =>
    getInitialItems(checkoutState),
  );
  const [selectedAddressId, setSelectedAddressId] = useState(
    () => checkoutState.selectedAddressId ?? getSelectedAddressId(),
  );
  const [appliedCoupon, setAppliedCoupon] = useState<CouponOption | null>(
    checkoutState.appliedCoupon ?? null,
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(
    checkoutState.paymentMethod ?? "cod",
  );

  const updateQuantity = (cartItemId: number, delta: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.cartItemId === cartItemId
          ? { ...i, quantity: Math.max(1, i.quantity + delta) }
          : i
      )
    );
  };

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CouponForm>({
    defaultValues: { couponCode: appliedCoupon?.code ?? "" },
  });

  const couponInput = watch("couponCode");

  useEffect(() => {
    setSelectedAddressId(getSelectedAddressId());
  }, [location.key]);

  const selectedCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, i) => {
        const originalPrice =
          i.product.discountValue > 0
            ? i.product.price / (1 - i.product.discountValue / 100)
            : i.product.price;
        return sum + originalPrice * i.quantity;
      }, 0),
    [items],
  );

  const productDiscount = useMemo(
    () =>
      items.reduce((sum, i) => {
        const originalPrice =
          i.product.discountValue > 0
            ? i.product.price / (1 - i.product.discountValue / 100)
            : i.product.price;
        return sum + (originalPrice - i.product.price) * i.quantity;
      }, 0),
    [items],
  );

  const voucherDiscount = appliedCoupon
    ? Math.round(
        (subtotal - productDiscount) * (appliedCoupon.discountPercent / 100),
      )
    : 0;

  // Giả lập phí vận chuyển: 30.000đ khi có địa chỉ
  const shippingFee = selectedAddressId ? 30000 : 0;

  const total = subtotal - productDiscount - voucherDiscount + shippingFee;

  const handleCouponSelect = (coupon: CouponOption) => {
    if (appliedCoupon) {
      showWarningToast("Chỉ được áp dụng một mã giảm giá");
      return;
    }
    setAppliedCoupon(coupon);
    setValue("couponCode", coupon.code);
    showSuccessToast(`Đã áp dụng mã ${coupon.code}`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setValue("couponCode", "");
    showSuccessToast("Đã gỡ mã giảm giá");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Container className="max-w-7xl p-2 px-4 md:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
          <CheckoutEmptyState
            icon={Package}
            title="Không có sản phẩm để thanh toán"
            description="Giỏ hàng trống hoặc bạn chưa chọn sản phẩm nào. Hãy quay lại giỏ hàng để tiếp tục."
            action={{ to: "/cart", label: "Quay lại giỏ hàng" }}
          />
        </Container>
      </div>
    );
  }

  return (
    <>
      <Container className="max-w-7xl p-2  my-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <section className="lg:col-span-8">
            <div className="card-custom space-y-6">
              <h2 className="heading-2 text-slate-900">Xác nhận đơn hàng</h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <CartItemCard
                    key={item.cartItemId}
                    item={item}
                    onToggle={() => {}}
                    onUpdateQuantity={(delta) => updateQuantity(item.cartItemId, delta)}
                    showRemove={false}
                    readonly
                  />
                ))}
              </div>
            </div>
          </section>

          <CartCheckoutSidebar
            selectedCount={selectedCount}
            subtotal={subtotal}
            discount={productDiscount}
            voucherDiscount={voucherDiscount}
            shippingFee={shippingFee}
            total={total}
            hasSelected={items.length > 0}
            selectedAddressId={selectedAddressId}
            appliedCoupon={appliedCoupon}
            paymentMethod={paymentMethod}
            onPaymentChange={setPaymentMethod}
            onCouponSelect={handleCouponSelect}
            onRemoveCoupon={handleRemoveCoupon}
            register={register}
            errors={errors}
            couponInput={couponInput}
            backLink={{ to: "/cart", label: "← Quay lại giỏ hàng" }}
            isCheckoutPage
          />
        </div>
      </Container>

      <CheckoutMobileBar
        subtitle="Tổng thanh toán"
        total={total}
        discount={productDiscount + voucherDiscount}
        action={
          <button type="button" className={mobilePrimaryButtonClass}>
            Thanh toán
          </button>
        }
      />
    </>
  );
}
