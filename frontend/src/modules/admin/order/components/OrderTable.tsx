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

interface OrderTableProps {
  orders: OrderResponse[];
  page?: number;
  pageSize?: number;
  onViewDetail?: (order: OrderResponse) => void;
  onApprove?: (order: OrderResponse) => void;
  onCancel?: (order: OrderResponse) => void;
}

export default function OrderTable({
  orders,
  page = 1,
  pageSize = 10,
  onViewDetail,
  onApprove,
  onCancel,
}: OrderTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50">
          <tr className="text-slate-500">
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">
              STT
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">
              Mã đơn hàng
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">
              Khách hàng
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">
              Thanh toán
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">
              Tổng tiền
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">
              Ngày tạo
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-right">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {orders && orders.length > 0 ? (
            orders.map((order, index) => (
              <tr
                key={order.id}
                className="hover:bg-slate-50/60 transition-colors"
              >
                <td className="py-4 px-4 text-slate-500 font-medium">
                  {(page - 1) * pageSize + index + 1}
                </td>
                <td className="py-4 px-4 font-semibold text-indigo-600">
                  {order.orderCode}
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-0.5">
                    <div className="font-semibold text-slate-900">
                      {order.fullName}{" "}
                      <span className="font-normal text-xs text-slate-500">
                        - {order.phone}
                      </span>
                    </div>
                    {(order.successRate !== undefined || order.successOrders !== undefined) && (
                      <div className="flex flex-col gap-0.5 mt-0.5">
                        <span
                          className={`inline-flex items-center w-fit px-1.5 py-0.5 rounded text-[11px] font-semibold ${
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
                          <span className="text-[11px] text-slate-500">
                            Thành công: <strong className="text-slate-700">{order.successOrders}/{order.finishedOrders}</strong> đơn
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-700">
                      {PaymentMethodMapping[order.paymentMethod] || order.paymentMethod}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        order.paymentStatus === "PAID"
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}
                    >
                      {PaymentStatusMapping[order.paymentStatus] || order.paymentStatus}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 font-semibold text-slate-900">
                  {formatMoney(order.total)}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      OrderStatusColor[order.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {OrderStatusMapping[order.status] || order.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-slate-500 text-xs">
                  {order.createdAt}
                </td>
                <td className="py-4 px-4 text-right">
                  <OrderActionButtons
                    item={order}
                    onApprove={onApprove}
                    onCancel={onCancel}
                    onViewDetail={onViewDetail}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={8}
                className="py-12 text-center text-slate-400"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="p-3 bg-slate-50 rounded-full text-slate-400 mb-1 animate-pulse">
                    <SearchX size={32} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    Không tìm thấy đơn hàng nào
                  </span>
                  <p className="text-xs text-slate-400 max-w-[220px] leading-relaxed">
                    Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc xem sao nhé.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
