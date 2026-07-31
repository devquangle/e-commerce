import type { OrderResponse } from "../../order/types/order.type";
import {
  OrderStatusColor,
  OrderStatusMapping,
  PaymentMethodMapping,
  PaymentStatusMapping,
} from "../../order/types/order.type";
import { formatMoney } from "@/utils/number.utils";

interface OrderInfoCardsProps {
  orderInfo: OrderResponse;
}

export default function OrderInfoCards({ orderInfo }: OrderInfoCardsProps) {
  const statusColor =
    OrderStatusColor[orderInfo.status] || "bg-gray-100 text-gray-700";
  const statusLabel = OrderStatusMapping[orderInfo.status] || orderInfo.status;
  const paymentMethodLabel =
    PaymentMethodMapping[orderInfo.paymentMethod] || orderInfo.paymentMethod;
  const paymentStatusLabel =
    PaymentStatusMapping[orderInfo.paymentStatus] || orderInfo.paymentStatus;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="card-custom">
        <h3 className="font-medium mb-3">👤 Khách hàng</h3>
        <p className="font-semibold text-gray-900">{orderInfo.fullName} ({orderInfo.phone})</p>
        <p className="text-gray-500">{orderInfo.streetFull}</p>
      </div>

      <div className="card-custom">
        <h3 className="font-medium mb-3">📦 Đơn hàng</h3>
        <p>Ngày tạo: {orderInfo.createdAt}</p>
        <p>Thanh toán: {paymentMethodLabel}</p>
        <p>TT thanh toán: {paymentStatusLabel}</p>
      </div>

      <div className="card-custom">
        <h3 className="font-medium mb-3">🚦 Trạng thái</h3>
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
        >
          {statusLabel}
        </span>

        <p className="mt-4 text-lg font-semibold text-red-600">
          Tổng tiền: {formatMoney(orderInfo.total)}
        </p>
      </div>
    </div>
  );
}
