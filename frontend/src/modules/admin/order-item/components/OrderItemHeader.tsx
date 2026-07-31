import Button from "@/components/common/Button";
import { ArrowLeft } from "lucide-react";

interface OrderItemHeaderProps {
  orderCode?: string;
  onBack: () => void;
}

export default function OrderItemHeader({
  orderCode,
  onBack,
}: OrderItemHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between card-custom">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Chi tiết đơn hàng {orderCode ? orderCode : ""}
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Theo dõi danh sách sản phẩm, địa chỉ giao hàng và tổng số tiền thanh toán.
        </p>
      </div>
      <Button
        color="secondary"
        size="md"
        icon={ArrowLeft}
        onClick={onBack}
      >
        Quay lại danh sách
      </Button>
    </div>
  );
}
