import Container from "@/components/common/Container";

import {
  CheckoutMobileBar,
} from "@/components/user/CheckoutUI";
import {
  type CouponOption,
} from "@/modules/user/cart/types/cart.type";
import { showSuccessToast, showWarningToast } from "@/utils/toastUtil";
import { Package } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { getSelectedAddressId, type CouponForm } from "@/types/checkout.type";
import CartCheckoutSidebar from "@/components/user/CartCheckoutSidebar";
import CartItemCard from "@/modules/user/cart/components/CartItemCard";
import type { PaymentMethodType } from "@/modules/user/payment/types/payment-method.type";
import { CheckoutEmptyState } from "@/modules/user/cart/components/CheckoutEmptyState";
import { useUpdateQuantity, useCartData } from "@/modules/user/cart/hooks/useCart";
import { useAddresses } from "@/modules/user/address/hooks/useAddress";
import { useShippingFee } from "@/modules/user/payment/hooks/useGhn";
import Loading from "@/components/common/Loading";

const mobilePrimaryButtonClass =
  "rounded-2xl bg-red-600 px-6 py-3.5 text-base font-bold text-white shadow-lg active:scale-95 transition hover:bg-red-700";

export default function PaymentPage() {
  const { data: cartData, isPending: isCartPending } = useCartData();

  const items = useMemo(() => {
    if (!cartData) return [];
    const fetchedItems = Array.isArray(cartData) ? cartData : [cartData];
    return fetchedItems.filter((item) => item.product != null && item.checked);
  }, [cartData]);

  const [selectedAddressId, setSelectedAddressId] = useState(
    () => getSelectedAddressId(),
  );
  const [appliedCoupon, setAppliedCoupon] = useState<CouponOption | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("cod");

  const updateQuantityMutation = useUpdateQuantity();

  const updateQuantity = (cartItemId: number, delta: number) => {
    const item = items.find((i) => i.cartItemId === cartItemId);
    if (!item) return;
    
    const newQuantity = Math.max(1, item.quantity + delta);
    if (newQuantity !== item.quantity) {
      updateQuantityMutation.mutate({ cartItemId, quantity: newQuantity });
    }
  };

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CouponForm>({
    defaultValues: { couponCode: "" },
  });

  const couponInput = watch("couponCode");

  useEffect(() => {
    setSelectedAddressId(getSelectedAddressId());
  }, []);

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

  const { data: addresses = [] } = useAddresses();
  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === selectedAddressId) ?? null,
    [addresses, selectedAddressId]
  );

  const totalWeight = useMemo(
    () => items.reduce((sum, i) => sum + (i.product.weight || 0) * i.quantity, 0),
    [items]
  );

  const { data: fetchedShippingFee } = useShippingFee(
    selectedAddress && selectedAddress.districtId && selectedAddress.wardCode
      ? {
          toDistrictId: selectedAddress.districtId,
          toWardCode: selectedAddress.wardCode,
          weight: totalWeight,
        }
      : null
  );

  const shippingFee = fetchedShippingFee || 0;

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

  if (items.length === 0 && !isCartPending) {
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
            {isCartPending ? (
              <div className="card-custom min-h-[300px] flex items-center justify-center">
                <Loading />
              </div>
            ) : (
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
            )}
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

      {!isCartPending && (
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
      )}
    </>
  );
}
