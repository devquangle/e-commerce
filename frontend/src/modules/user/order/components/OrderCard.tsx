import { 
  type Order, 
  OrderStatusMapping, 
  OrderStatusColor, 
  PaymentStatusMapping, 
  PaymentMethodMapping 
} from "../types/order.type";

interface OrderCardProps {
  order: Order;
}

// Hàm format ngày từ YYYY-MM-DD sang DD/MM/YYYY
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
};

export function OrderCard({ order }: OrderCardProps) {
  return (
    <div className="rounded-xl shadow-sm hover:shadow-md bg-white p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start m-0">
        <div className="text-sm space-y-0.5">
          <p className="font-medium text-gray-800">
            {order.fullname} - Ngày đặt: {formatDate(order.date)}
          </p>
        </div>

        <span
          className={`px-2 py-1 rounded text-xs font-medium ${OrderStatusColor[order.status]}`}
        >
          {OrderStatusMapping[order.status]}
        </span>
      </div>

      {/* Body */}
      <div className="grid md:grid-cols-2 gap-3 text-sm bg-gray-50 rounded-lg m-0 p-3">
        <div className="space-y-1">
          <p className="text-gray-500">{order.phone}</p>
          <p className="text-gray-600">{order.address}</p>
        </div>

        <div className="space-y-1">
          <p>
            <span className="font-medium">Thanh toán:</span>{" "}
            {PaymentMethodMapping[order.paymentMethod]}
          </p>
          <p>
            <span className="font-medium">Trạng thái:</span>{" "}
            <span
              className={`px-2 py-0.5 rounded text-xs ${
                order.paymentStatus === "PAID"
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {PaymentStatusMapping[order.paymentStatus]}
            </span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap justify-between items-center gap-3 pt-1">
        <p className="font-semibold text-gray-800">
          Tổng tiền: {order.total.toLocaleString("vi-VN")}₫
        </p>

        <div className="flex gap-2 flex-wrap">
          <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
            Chi tiết
          </button>

          <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 cursor-pointer">
            Mua lại
          </button>

          {order.status === "PENDING" && (
            <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer">
              Huỷ đơn
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
