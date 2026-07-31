import Container from "@/components/common/Container";

import { CheckoutMobileBar } from "@/components/user/CheckoutUI";
import { type CouponOption } from "@/modules/user/cart/types/cart.type";
import { showSuccessToast, showErrorToast, showWarningToast } from "@/utils/toastUtil";
import { formatMoney } from "@/utils/number.utils";
import { Package } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  getSelectedAddressId,
  getCachedSelectedAddress,
  setCachedSelectedAddress,
  type CouponForm,
} from "@/types/checkout.type";
import CartCheckoutSidebar from "@/components/user/CartCheckoutSidebar";
import CartItemCard from "@/modules/user/cart/components/CartItemCard";
import type { PaymentMethodType } from "@/modules/user/payment/types/payment-method.type";
import { CheckoutEmptyState } from "@/modules/user/cart/components/CheckoutEmptyState";
import {
  useUpdateQuantity,
  useCartData,
} from "@/modules/user/cart/hooks/useCart";
import { useAddresses } from "@/modules/user/address/hooks/useAddress";
import { useShippingFee } from "@/modules/user/payment/hooks/useGhn";
import { PaymentSkeleton } from "@/modules/user/payment/components/PaymentSkeleton";
import { useCreateOrder } from "@/modules/user/order/hooks/useOrder";
import type { OrderRequest, PaymentMethod } from "@/modules/user/order/types/order.type";

const mobilePrimaryButtonClass =
  "rounded-2xl bg-red-600 px-6 py-3.5 text-base font-bold text-white shadow-lg active:scale-95 transition hover:bg-red-700";

export default function PaymentPage() {
  const navigate = useNavigate();
  const createOrderMutation = useCreateOrder();
  const { data: cartData, isPending: isCartPending } = useCartData();

  const items = useMemo(() => {
    if (!cartData) return [];
    const fetchedItems = Array.isArray(cartData) ? cartData : [cartData];
    return fetchedItems.filter((item) => item.product != null && item.checked);
  }, [cartData]);

  // dùng để resolve selectedAddress trong useMemo bên dưới
  const [selectedAddressId] = useState(() => getSelectedAddressId());
  const [appliedCoupon, setAppliedCoupon] = useState<CouponOption | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("COD");
  const [note, setNote] = useState("");

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
    control,
    formState: { errors },
  } = useForm<CouponForm>({
    defaultValues: { couponCode: "" },
  });

  const couponInput = useWatch({ control, name: "couponCode" });

  const selectedCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, i) => sum + (i.product.price || 0) * i.quantity, 0),
    [items],
  );

  const productDiscount = useMemo(
    () =>
      items.reduce((sum, i) => {
        const origPrice = i.product.price || 0;
        const discountPct = i.product.discountValue || 0;
        const discountAmt = discountPct > 0 ? (origPrice * discountPct) / 100 : 0;
        return sum + Math.round(discountAmt) * i.quantity;
      }, 0),
    [items],
  );

  const voucherDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const basePrice = subtotal - productDiscount;
    if (appliedCoupon.minOrderValue && basePrice < appliedCoupon.minOrderValue) {
      return 0;
    }
    let calculated = 0;
    if (appliedCoupon.discountValue <= 100) {
      calculated = Math.round((basePrice * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscountValue && appliedCoupon.maxDiscountValue > 0) {
        calculated = Math.min(calculated, appliedCoupon.maxDiscountValue);
      }
    } else {
      calculated = appliedCoupon.discountValue;
    }
    return Math.min(calculated, Math.max(0, basePrice));
  }, [appliedCoupon, subtotal, productDiscount]);

  const { data: addresses = [], isPending: isAddressesPending } = useAddresses();
  const cachedAddress = useMemo(() => getCachedSelectedAddress(), []);

  const selectedAddress = useMemo(() => {
    if (addresses.length > 0) {
      const found =
        addresses.find((a) => a.id === selectedAddressId) ??
        addresses.find((a) => a.default) ??
        addresses[0] ??
        null;
      if (found) {
        setCachedSelectedAddress(found);
      }
      return found;
    }
    return cachedAddress;
  }, [addresses, selectedAddressId, cachedAddress]);

  const isAddressLoading = isAddressesPending && !selectedAddress;

  const totalWeight = useMemo(
    () =>
      items.reduce((sum, i) => sum + (i.product.weight || 0) * i.quantity, 0),
    [items],
  );

  const shippingFeeRequest = useMemo(() => {
    if (
      !selectedAddress ||
      !selectedAddress.districtId ||
      !selectedAddress.wardCode
    ) {
      return null;
    }
    const districtId = Number(selectedAddress.districtId);
    const wardCode = String(selectedAddress.wardCode).trim();
    if (isNaN(districtId) || districtId <= 0 || !wardCode) {
      return null;
    }
    return {
      toDistrictId: districtId,
      toWardCode: wardCode,
      weight: Math.max(200, totalWeight),
    };
  }, [selectedAddress, totalWeight]);

  const { data: fetchedShippingFee } = useShippingFee(shippingFeeRequest);

  const shippingFee = fetchedShippingFee || 0;

  const total = subtotal - productDiscount - voucherDiscount + shippingFee;

  const handleCouponSelect = (coupon: CouponOption) => {
    if (appliedCoupon) {
      showWarningToast("Chỉ được áp dụng một mã giảm giá");
      return;
    }
    setAppliedCoupon(coupon);
    setValue("couponCode", coupon.code);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setValue("couponCode", "");
  };

  const handleConfirmOrder = () => {
    if (!selectedAddress || !selectedAddress.id) {
      showWarningToast("Vui lòng chọn địa chỉ giao hàng trước khi thanh toán");
      return;
    }
    if (items.length === 0) {
      showWarningToast("Không có sản phẩm nào trong giỏ hàng để thanh toán");
      return;
    }

    const method: PaymentMethod =
      paymentMethod.toUpperCase() === "VNPAY" ? "VNPAY" : "COD";

    const payload: OrderRequest = {
      addressId: selectedAddress.id,
      cartItemIds: items.map((item) => item.cartItemId),
      voucherId: appliedCoupon?.id ?? null,
      paymentMethod: method,
      note: note.trim() || undefined,
    };

    console.log("=== THỰC HIỆN ĐẶT HÀNG ===", payload);

    createOrderMutation.mutate(payload, {
      onSuccess: () => {
        showSuccessToast("Đặt hàng thành công!");
        navigate("/account/orders");
      },
    });
  };

  // Tự động gỡ voucher khi tạm tính không còn đủ điều kiện
  // Dùng queueMicrotask để tránh setState đồng bộ trong effect body
  useEffect(() => {
    if (
      !appliedCoupon ||
      items.length === 0 ||
      createOrderMutation.isPending ||
      createOrderMutation.isSuccess
    )
      return;

    const basePrice = subtotal - productDiscount;
    const isIneligible =
      appliedCoupon.minOrderValue > 0 &&
      basePrice < appliedCoupon.minOrderValue;
    if (!isIneligible) return;

    const code = appliedCoupon.code;
    const minVal = appliedCoupon.minOrderValue;

    queueMicrotask(() => {
      setAppliedCoupon(null);
      setValue("couponCode", "");
      showWarningToast(
        `Mã "${code}" đã bị gỡ vì đơn hàng chưa đủ ${formatMoney(minVal)}`
      );
    });
  }, [
    subtotal,
    productDiscount,
    appliedCoupon,
    setValue,
    items.length,
    createOrderMutation.isPending,
    createOrderMutation.isSuccess,
  ]);

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

  if (isCartPending) {
    return <PaymentSkeleton />;
  }

  return (
    <>
      <Container className="max-w-7xl p-2 my-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <section className="lg:col-span-7 xl:col-span-8">
            <div className="card-custom space-y-6">
              <h2 className="heading-2 text-slate-900">Xác nhận đơn hàng</h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <CartItemCard
                    key={item.cartItemId}
                    item={item}
                    onToggle={() => {}}
                    onUpdateQuantity={(delta) =>
                      updateQuantity(item.cartItemId, delta)
                    }
                    showRemove={false}
                    readonly
                  />
                ))}
              </div>

              <div className="pt-5 mt-2 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-2">
                  Ghi chú đơn hàng
                </h3>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nhập lời nhắn cho người bán (tùy chọn)..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition resize-none min-h-20"
                />
                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Thông tin ghi chú sẽ được in trên hóa đơn giao hàng.
                </p>
              </div>
            </div>
          </section>

          <CartCheckoutSidebar
            selectedCount={selectedCount}
            subtotal={subtotal}
            basePrice={subtotal - productDiscount}
            discount={productDiscount}
            voucherDiscount={voucherDiscount}
            shippingFee={shippingFee}
            total={total}
            hasSelected={items.length > 0}
            selectedAddress={selectedAddress}
            isAddressLoading={isAddressLoading}
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
            onCheckout={handleConfirmOrder}
          />
        </div>
      </Container>

      {!isCartPending && (
        <CheckoutMobileBar
          subtitle="Tổng thanh toán"
          total={total}
          discount={productDiscount + voucherDiscount}
          action={
            <button
              type="button"
              onClick={handleConfirmOrder}
              disabled={createOrderMutation.isPending}
              className={`${mobilePrimaryButtonClass} ${
                createOrderMutation.isPending ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {createOrderMutation.isPending ? "Đang xử lý..." : "Thanh toán"}
            </button>
          }
        />
      )}
    </>
  );
}

