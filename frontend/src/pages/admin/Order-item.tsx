import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import {
  useOrderDetail,
  useUpdateOrderStatus,
  useCancelOrder,
} from "@/modules/admin/order/hooks/useOrder";
import OrderItemHeader from "@/modules/admin/order-item/components/OrderItemHeader";
import OrderInfoCards from "@/modules/admin/order-item/components/OrderInfoCards";
import OrderNoteCards from "@/modules/admin/order-item/components/OrderNoteCards";
import OrderSummaryFooter from "@/modules/admin/order-item/components/OrderSummaryFooter";

import OrderDetailSkeleton from "@/modules/admin/order/components/OrderDetailSkeleton";
import Button from "@/components/common/Button";
import { ArrowLeft, Check, X } from "lucide-react";
import { OrderItemCard } from "@/modules/admin/order-item/components/OrderItemCard";

export default function OrderItem() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const orderCodeParam = searchParams.get("orderCode");
  const stateOrder = location.state?.order;
  const orderCode = orderCodeParam || stateOrder?.orderCode;
  const orderId = location.state?.orderId || stateOrder?.id;

  const {
    data: orderDetail,
    isLoading,
    isError,
    error,
  } = useOrderDetail(orderCode);

  const updateStatusMutation = useUpdateOrderStatus();
  const cancelOrderMutation = useCancelOrder();

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  const orderInfo = orderDetail?.orderInfo || stateOrder;
  const items = orderDetail?.items || [];

  if (isError || !orderInfo) {
    return (
      <div className="flex-1 p-6 text-center text-red-500 font-medium min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-lg">
          {error ? error.message : "Không tìm thấy thông tin đơn hàng"}
        </p>
        <Button
          color="secondary"
          size="md"
          icon={ArrowLeft}
          onClick={() => navigate("/admin/orders")}
        >
          Quay lại danh sách đơn hàng
        </Button>
      </div>
    );
  }

  const handleApprove = () => {
    updateStatusMutation.mutate({ id: orderInfo.id, status: "CONFIRMED" });
  };

  const handleCancel = () => {
    cancelOrderMutation.mutate({ id: orderInfo.id });
  };

  const handleBack = () => {
    navigate("/admin/orders");
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      {/* HEADER */}
      <OrderItemHeader orderCode={orderInfo.orderCode} onBack={handleBack} />

      {/* ===== INFO CARDS ===== */}
      <OrderInfoCards orderInfo={orderInfo} />

      {/* ===== CANCELLATION REASON & NOTE CARDS ===== */}
      <OrderNoteCards orderInfo={orderInfo} />

      {/* ===== PRODUCTS ===== */}
      <div className="card-custom">
        <h3 className="font-medium text-lg mb-4">🛒 Sản phẩm</h3>
        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item) => (
              <OrderItemCard
                key={item.orderItemId}
                item={item}
              />
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm py-4 text-center">
            Chưa có sản phẩm nào trong đơn hàng này.
          </p>
        )}

        {/* Card Footer: Tóm tắt đơn hàng */}
        <OrderSummaryFooter orderInfo={orderInfo} items={items} />
      </div>

     
    </div>
  );
}
