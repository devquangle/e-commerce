import { useSearchParams, useNavigate } from "react-router-dom";
import { useOrderDetail } from "@/modules/user/order/hooks/useOrder";
import { OrderItemCard } from "@/modules/user/order/components/OrderItemCard";
import {
  OrderStatusColor,
  OrderStatusMapping,
  PaymentMethodMapping,
  PaymentStatusMapping,
} from "@/modules/user/order/types/order.type";
import { formatMoney } from "@/utils/number.utils";

export default function OrderDetailPage() {
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get("orderCode");
  const navigate = useNavigate();

  const { data: orderDetail, isLoading, isError, error } = useOrderDetail(
    orderCode ?? undefined
  );

  if (isLoading) {
    return (
      <div className="flex-1 p-6 text-center text-gray-500 font-medium min-h-screen">
        Đang tải chi tiết đơn hàng...
      </div>
    );
  }

  if (isError || !orderDetail) {
    return (
      <div className="flex-1 p-6 text-center text-red-500 font-medium min-h-screen">
        {error ? error.message : "Không tìm thấy đơn hàng"}
      </div>
    );
  }

  const { orderInfo, items } = orderDetail;

  const statusColor =
    OrderStatusColor[orderInfo.status] || "bg-gray-100 text-gray-700";
  const statusLabel =
    OrderStatusMapping[orderInfo.status] || orderInfo.status;
  const paymentMethodLabel =
    PaymentMethodMapping[orderInfo.paymentMethod] || orderInfo.paymentMethod;
  const paymentStatusLabel =
    PaymentStatusMapping[orderInfo.paymentStatus] || orderInfo.paymentStatus;

  return (
    <div className="flex-1 p-3 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">
        Chi tiết đơn hàng #{orderInfo.orderCode}
      </h2>

      {/* ===== INFO ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-3">👤 Khách hàng</h3>
          <p className="font-semibold text-gray-900">{orderInfo.fullName}</p>
          <p className="text-gray-700">{orderInfo.phone}</p>
          <p className="text-gray-500">{orderInfo.streetFull}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-3">📦 Đơn hàng</h3>
          <p>Ngày tạo: {orderInfo.createdAt}</p>
          <p>Thanh toán: {paymentMethodLabel}</p>
          <p>TT thanh toán: {paymentStatusLabel}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
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

      {/* ===== PRODUCTS ===== */}
      <div className="bg-white p-4 rounded-lg border my-5 space-y-4">
        <h3 className="font-medium text-lg">🛒 Sản phẩm</h3>

        <div className="space-y-3">
          {items.map((item) => (
            <OrderItemCard key={item.orderItemId} item={item} />
          ))}
        </div>
      </div>

      {/* ===== ACTION ===== */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        {orderInfo.status === "PENDING" && (
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer">
            Huỷ đơn
          </button>
        )}
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
}
