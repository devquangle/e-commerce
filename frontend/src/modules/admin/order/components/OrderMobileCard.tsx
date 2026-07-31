import type { OrderResponse } from "../types/order.type";
import {
  OrderStatusMapping,
  OrderStatusColor,
  PaymentMethodMapping,
  PaymentStatusMapping,
} from "../types/order.type";
import { formatMoney } from "@/utils/number.utils";
import { SearchX } from "lucide-react";
import OrderActionButtons from "./OrderActionButtons";

interface OrderMobileCardProps {
  orders: OrderResponse[];
  onViewDetail?: (order: OrderResponse) => void;
  onApprove?: (order: OrderResponse) => void;
  onCancel?: (order: OrderResponse) => void;
}

export default function OrderMobileCard({
  orders,
  onViewDetail,
  onApprove,
  onCancel,
}: OrderMobileCardProps) {
  if (!orders || orders.length === 0) {
    return (
      <div className="md:hidden py-10 text-center text-slate-400">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="p-3 bg-slate-50 rounded-full text-slate-400 mb-1 animate-pulse">
            <SearchX size={32} strokeWidth={1.5} />
          </div>
          <span className="text-sm font-medium text-slate-600">
            Không tìm thấy đơn hàng nào
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="md:hidden flex flex-col gap-3">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2"
        >
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="font-semibold text-indigo-600">
              {order.orderCode}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                OrderStatusColor[order.status] || "bg-gray-100 text-gray-700"
              }`}
            >
              {OrderStatusMapping[order.status] || order.status}
            </span>
          </div>

          <div className="flex justify-between items-start text-sm">
            <div>
              <p className="font-medium text-slate-900">
                {order.fullName}{" "}
                <span className="font-normal text-xs text-slate-500">
                  - {order.phone}
                </span>
              </p>
              {(order.successRate !== undefined || order.successOrders !== undefined) && (
                <div className="flex flex-col gap-0.5 mt-1">
                  <span
                    className={`inline-flex items-center w-fit px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      (order.successRate ?? 0) >= 90
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : (order.successRate ?? 0) >= 70
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    Tỉ lệ nhận: {order.successRate ?? 0}%
                  </span>
                  {(order.finishedOrders !== undefined && order.successOrders !== undefined) && (
                    <span className="text-[10px] text-slate-500">
                      Thành công: <strong className="text-slate-700">{order.successOrders}/{order.finishedOrders}</strong> đơn
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900">
                {formatMoney(order.total)}
              </p>
              <p className="text-xs text-slate-400">{order.createdAt}</p>
            </div>
          </div>

          <div className="flex flex-col pt-2 border-t border-slate-100 text-xs gap-2">
            <div>
              <span className="text-slate-500">Thanh toán: </span>
              <span className="font-medium text-slate-700">
                {PaymentMethodMapping[order.paymentMethod] || order.paymentMethod}
              </span>
              {" ("}
              <span
                className={
                  order.paymentStatus === "PAID"
                    ? "text-emerald-600 font-semibold"
                    : "text-amber-600 font-semibold"
                }
              >
                {PaymentStatusMapping[order.paymentStatus] || order.paymentStatus}
              </span>
              {")"}
            </div>

            <OrderActionButtons
              item={order}
              onApprove={onApprove}
              onCancel={onCancel}
              onViewDetail={onViewDetail}
              mobile
            />
          </div>
        </div>
      ))}
    </div>
  );
}
