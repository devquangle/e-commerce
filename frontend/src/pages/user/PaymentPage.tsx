import Container from "@/components/common/Container";
import CartItemCard from "@/components/user/CartItemCard";

import {
  CheckoutEmptyState,
  CheckoutMobileBar,
  CheckoutPageHeader,
} from "@/components/user/CheckoutUI";
import {
  type CartItemUI,
  type CouponOption,
  type PaymentMethodType,
  MOCK_CART_ITEMS,
  getLineTotal,
} from "@/types/cart.type";
import {
  showSuccessToast,
  showWarningToast,
} from "@/utils/toastUtil";
import { CreditCard, Package } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getSelectedAddressId, type CouponForm } from "@/types/checkout.type";
import CartCheckoutSidebar from "@/components/user/CartCheckoutSidebar";

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

const primaryButtonClass =
  "w-full rounded-2xl bg-red-600 py-4 text-base font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/30 active:scale-[0.98]";

const mobilePrimaryButtonClass =
  "rounded-2xl bg-red-600 px-6 py-3.5 text-base font-bold text-white shadow-lg active:scale-95 transition hover:bg-red-700";

export default function PaymentPage() {
  const location = useLocation();
  const checkoutState = (location.state as CheckoutState) ?? {};

  const [items, setItems] = useState<CartItemUI[]>(() =>
    getInitialItems(checkoutState)
  );
  const [selectedAddressId, setSelectedAddressId] = useState(
    () => checkoutState.selectedAddressId ?? getSelectedAddressId()
  );
  const [appliedCoupon, setAppliedCoupon] = useState<CouponOption | null>(
    checkoutState.appliedCoupon ?? null
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(
    checkoutState.paymentMethod ?? "ewallet"
  );

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
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + getLineTotal(i), 0),
    [items]
  );

  const discount = appliedCoupon
    ? Math.round(subtotal * (appliedCoupon.discountPercent / 100))
    : 0;
  const total = subtotal - discount;

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
        <Container className="max-w-7xl px-4 md:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
          <CheckoutEmptyState
            icon={Package}
            title="Không có sản phẩm để thanh toán"
            description="Giỏ hàng trống hoặc bạn chưa chọn sản phẩm nào. Hãy quay lại giỏ hàng để tiếp tục."
            action={{ to: "/carts", label: "Quay lại giỏ hàng" }}
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32 lg:pb-10">
      <Container className="max-w-7xl px-4 md:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
        <div className="mb-10 lg:mb-12">
          <CheckoutPageHeader
            icon={CreditCard}
            title="Xác nhận đơn hàng"
            subtitle={`${selectedCount} sản phẩm · Kiểm tra và thanh toán`}
            iconClassName="bg-red-600 shadow-red-600/20"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <section className="lg:col-span-8">
            <div className="rounded-3xl border border-slate-200/60 bg-white p-6 lg:p-8 shadow-lg space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  Sản phẩm của bạn
                </h2>
                <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-4 py-2 rounded-lg">
                  {items.length} mục
                </span>
              </div>

              <Link
                to="/carts"
                className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-medium transition"
              >
                ← Chỉnh sửa giỏ hàng
              </Link>

              <div className="space-y-4">
                {items.map((item) => (
                  <CartItemCard
                    key={item.cartItemId}
                    item={item}
                    onToggle={() => {}}
                    onUpdateQuantity={() => {}}
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
            discount={discount}
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
            backLink={{ to: "/carts", label: "← Quay lại giỏ hàng" }}
            primaryAction={
              <button type="button" className={primaryButtonClass}>
                Xác nhận đặt hàng
              </button>
            }
            isCheckoutPage
          />
        </div>
      </Container>

      <CheckoutMobileBar
        subtitle="Tổng thanh toán"
        total={total}
        discount={discount}
        action={
          <button type="button" className={mobilePrimaryButtonClass}>
            Thanh toán
          </button>
        }
      />
    </div>
  );
}
