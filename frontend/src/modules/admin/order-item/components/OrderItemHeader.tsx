import Button from "@/components/common/Button";
import { ArrowLeft, Check, X } from "lucide-react";
import type { OrderStatus } from "../../order/types/order.type";

interface OrderItemHeaderProps {
  orderCode?: string;
  status?: OrderStatus;
  onBack: () => void;
  onApprove?: () => void;
  onCancel?: () => void;
}

export default function OrderItemHeader({
  orderCode,
  status,
  onBack,
  onApprove,
  onCancel,
}: OrderItemHeaderProps) {
  const isPending = status === undefined || status === "PENDING";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between card-custom p-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Chi tiết đơn hàng {orderCode ? orderCode : ""}
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Theo dõi danh sách sản phẩm, địa chỉ giao hàng và tổng số tiền thanh toán.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          color="secondary"
          size="md"
          icon={ArrowLeft}
          onClick={onBack}
        >
          Quay lại
        </Button>
        {onApprove && isPending && (
          <Button
            color="success"
            size="md"
            icon={Check}
            onClick={onApprove}
          >
            Duyệt đơn
          </Button>
        )}
        {onCancel && isPending && (
          <Button
            color="danger"
            size="md"
            icon={X}
            onClick={onCancel}
          >
            Hủy đơn
          </Button>
        )}
      </div>
    </div>
  );
}
