import { useState } from "react";
import { Link } from "react-router-dom";
import { formatMoney } from "@/utils/number.utils";
import Button from "@/components/common/Button";
import { CancelOrderModal } from "./CancelOrderModal";
import { ChangeAddressModal } from "./ChangeAddressModal";
import { 
  OrderStatusMapping, 
  OrderStatusColor, 
  PaymentStatusMapping, 
  PaymentMethodMapping, 
  type OrderResponse
} from "../types/order.type";

export type { OrderResponse };

interface OrderCardProps {
  order: OrderResponse;
}

// Hàm format ngày từ YYYY-MM-DD sang DD/MM/YYYY
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
};

export function OrderCard({ order }: OrderCardProps) {
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  return (
    <>
      <div className="card-custom space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start m-0">
          <div className="text-sm">
            <p className="font-semibold text-gray-900 flex items-center gap-2 flex-wrap">
              <span>
                Mã đơn: <span className="text-blue-600">{order.orderCode}</span>
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500 font-normal text-xs">
                Ngày tạo: {formatDate(order.createdAt)}
              </span>
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
            <p className="text-gray-800">
              <span className="font-medium">{order.fullName}</span>{" "}
              <span className="text-gray-500">({order.phone})</span>
            </p>
            <p className="text-gray-600">{order.streetFull}</p>
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
            Tổng tiền:  {formatMoney(order.total)}
          </p>

          <div className="flex gap-2 flex-wrap items-center">
            <Link to={`/account/order?orderCode=${order.orderCode}`}>
              <Button size="md" color="primary">
                Chi tiết
              </Button>
            </Link>

            <Button size="md" color="secondary">
              Mua lại
            </Button>

            {order.status === "PENDING" && (
              <>
                <Button
                  size="md"
                  color="warning"
                  onClick={() => setIsAddressOpen(true)}
                >
                  Đổi địa chỉ
                </Button>
                <Button
                  size="md"
                  color="danger"
                  onClick={() => setIsCancelOpen(true)}
                >
                  Huỷ đơn
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <CancelOrderModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        orderCode={order.orderCode}
      />

      <ChangeAddressModal
        isOpen={isAddressOpen}
        onClose={() => setIsAddressOpen(false)}
        order={order}
      />
    </>
  );
}
