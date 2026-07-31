import type { OrderItemResponse, OrderResponse } from "../../order/types/order.type";
import { formatMoney } from "@/utils/number.utils";

interface OrderSummaryFooterProps {
  orderInfo: OrderResponse;
  items: OrderItemResponse[];
}

export default function OrderSummaryFooter({
  orderInfo,
  items,
}: OrderSummaryFooterProps) {
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  const subtotalOriginal = items.reduce(
    (acc, item) =>
      acc +
      (item.originalPrice > 0 ? item.originalPrice : item.price) *
        item.quantity,
    0,
  );

  const subtotalSelling = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const productDiscount = Math.max(0, subtotalOriginal - subtotalSelling);
  const voucherDiscount = orderInfo.voucherAmount || 0;
  const totalDiscount = productDiscount + voucherDiscount;
  const shippingFee = orderInfo.shippingFee || 0;
  const grandTotal = orderInfo.total;

  return (
    <div className="p-4 border-t border-slate-200/80 flex flex-col items-end text-sm">
      <div className="w-full sm:w-80 space-y-2.5">
        <h4 className="font-bold text-base text-slate-900 pb-0.5">
          Tóm tắt đơn hàng
        </h4>

        {/* Total Items */}
        <div className="flex justify-between items-center text-slate-600">
          <span>Tổng số sản phẩm</span>
          <span className="font-bold text-slate-900">{totalQuantity} cuốn</span>
        </div>

        {/* Subtotal */}
        <div className="flex justify-between items-center text-slate-600">
          <span>Tạm tính</span>
          <span className="font-bold text-slate-900">
            {formatMoney(subtotalOriginal > 0 ? subtotalOriginal : subtotalSelling)}
          </span>
        </div>

        {/* Discount */}
        {totalDiscount > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-600">
              <span>Giảm giá</span>
              <span className="font-bold text-emerald-600">
                -{formatMoney(totalDiscount)}
              </span>
            </div>

            <div className="border-l-2 border-slate-200/80 pl-3 ml-1 space-y-1 text-xs text-slate-500">
              {productDiscount > 0 && (
                <div className="flex justify-between items-center">
                  <span>Sản phẩm</span>
                  <span className="font-medium text-emerald-600">
                    -{formatMoney(productDiscount)}
                  </span>
                </div>
              )}
              {voucherDiscount > 0 && (
                <div className="flex justify-between items-center">
                  <span>Voucher</span>
                  <span className="font-medium text-emerald-600">
                    -{formatMoney(voucherDiscount)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shipping Fee */}
        <div className="flex justify-between items-center text-slate-600">
          <span>Phí vận chuyển</span>
          <span className="font-medium text-slate-900">
            {shippingFee > 0 ? formatMoney(shippingFee) : "Miễn phí"}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between items-baseline">
          <span className="font-bold text-slate-900 text-base">Tổng cộng</span>
          <span className="font-bold text-red-600 text-xl tabular-nums">
            {formatMoney(grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
