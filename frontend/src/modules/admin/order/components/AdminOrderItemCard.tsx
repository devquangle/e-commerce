import type { OrderItemResponse } from "../types/order.type";
import { formatMoney } from "@/utils/number.utils";

interface AdminOrderItemCardProps {
  item: OrderItemResponse;
}

export default function AdminOrderItemCard({ item }: AdminOrderItemCardProps) {
  const product = item.productInfo;
  const unitPrice = item.price;
  const originalPrice = item.originalPrice;
  const hasDiscount = originalPrice > unitPrice;
  const itemTotal = unitPrice * item.quantity;

  return (
    <div className="flex items-start sm:items-center gap-4 p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs hover:shadow-xs transition-all">
      {/* Product Image */}
      <div className="relative shrink-0 overflow-hidden rounded-lg border border-slate-200/80 bg-slate-50 w-16 h-20">
        <img
          src={product?.urlImage || "/placeholder-book.png"}
          alt={product?.name || "Sản phẩm"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <h4 className="font-semibold text-slate-900 text-sm sm:text-base line-clamp-2 leading-snug">
          {product?.name || "Sản phẩm không có tên"}
        </h4>

        {product?.publisher && (
          <p className="text-xs text-slate-500 line-clamp-1">
            NXB: {product.publisher}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
            Số lượng: {item.quantity}
          </span>
          <span className="text-xs text-slate-500">
            Đơn giá: {formatMoney(unitPrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-slate-400 line-through">
              {formatMoney(originalPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Total Amount for this item */}
      <div className="text-right shrink-0">
        <span className="text-xs text-slate-400 block">Thành tiền</span>
        <span className="font-bold text-slate-900 text-sm sm:text-base text-indigo-600">
          {formatMoney(itemTotal)}
        </span>
      </div>
    </div>
  );
}
