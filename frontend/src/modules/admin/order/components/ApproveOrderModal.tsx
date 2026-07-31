import Modal from "@/components/common/Modal";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { OrderResponse, OrderStatus } from "../types/order.type";
import {
  OrderStatusColor,
  OrderStatusMapping,
} from "../types/order.type";
import { useUpdateOrderStatus } from "../hooks/useOrder";

interface ApproveOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderResponse | null;
  nextStatus?: OrderStatus;
  onSuccess?: () => void;
}

const NEXT_STATUS_MAP: Record<OrderStatus, OrderStatus> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "SHIPPING",
  SHIPPING: "DELIVERED",
  DELIVERED: "COMPLETED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  FAILED_DELIVERY: "FAILED_DELIVERY",
};

export function ApproveOrderModal({
  isOpen,
  onClose,
  order,
  nextStatus: customNextStatus,
  onSuccess,
}: ApproveOrderModalProps) {
  const updateStatusMutation = useUpdateOrderStatus();

  if (!order) return null;

  const currentStatus = order.status;
  const targetStatus =
    customNextStatus || NEXT_STATUS_MAP[currentStatus] || "CONFIRMED";

  const handleConfirm = () => {
    updateStatusMutation.mutate(
      {
        id: order.id,
        status: targetStatus,
      },
      {
        onSuccess: () => {
          onClose();
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Xác nhận duyệt đơn hàng"
      confirmText={
        updateStatusMutation.isPending ? "Đang xử lý..." : "Xác nhận duyệt đơn"
      }
      cancelText="Hủy"
      size="md"
    >
      <div className="space-y-4">
        {/* Info Banner */}
        <div className="flex items-start gap-3 p-3.5 bg-blue-50 rounded-xl border border-blue-200/80 text-blue-900">
          <CheckCircle2 size={24} className="text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm space-y-0.5">
            <p className="font-semibold text-blue-900">
              Duyệt đơn hàng #{order.orderCode}
            </p>
            <p className="text-blue-700 text-xs">
              Đơn hàng sẽ được chuyển sang trạng thái tiếp theo và cập nhật tự động tới khách hàng.
            </p>
          </div>
        </div>

        {/* Status Transition Cards */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Chuyển trạng thái đơn hàng:
          </span>
          <div className="flex items-center justify-between gap-3 pt-1">
            {/* Current Status */}
            <div className="flex flex-col gap-1 items-start">
              <span className="text-xs text-slate-500 font-medium">Hiện tại</span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  OrderStatusColor[currentStatus] || "bg-gray-100 text-gray-700"
                }`}
              >
                {OrderStatusMapping[currentStatus] || currentStatus}
              </span>
            </div>

            {/* Arrow */}
            <div className="p-1.5 bg-white rounded-full border border-slate-200 shadow-xs">
              <ArrowRight size={16} className="text-slate-400" />
            </div>

            {/* Next Status */}
            <div className="flex flex-col gap-1 items-end">
              <span className="text-xs text-slate-500 font-medium">Tiếp theo</span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  OrderStatusColor[targetStatus] || "bg-emerald-100 text-emerald-700"
                }`}
              >
                {OrderStatusMapping[targetStatus] || targetStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ApproveOrderModal;
