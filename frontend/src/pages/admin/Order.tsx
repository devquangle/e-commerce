import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import Pagination from "@/components/common/Pagination";
import { OrderFilter } from "@/modules/admin/order/components/OrderFilter";
import OrderTable from "@/modules/admin/order/components/OrderTable";
import OrderMobileCard from "@/modules/admin/order/components/OrderMobileCard";
import { useOrderFilter } from "@/modules/admin/order/hooks/useOrderFilter";
import {
  useFilterOrder,
  useUpdateOrderStatus,
  useCancelOrder,
} from "@/modules/admin/order/hooks/useOrder";
import OrderSkeleton from "@/modules/admin/order/components/OrderSkeleton";
import type { OrderResponse } from "@/modules/admin/order/types/order.type";

export default function Order() {
  const navigate = useNavigate();

  const {
    keyword,
    startDate,
    endDate,
    status,
    page,
    size,
    filterParams,
    setPage,
    setSize,
    handleKeywordChange,
    handleStartDateChange,
    handleEndDateChange,
    handleStatusChange,
    handleResetFilter,
  } = useOrderFilter();

  const { data: orderData, isPending } = useFilterOrder(filterParams);
  const updateStatusMutation = useUpdateOrderStatus();
  const cancelOrderMutation = useCancelOrder();

  const orders = orderData?.items || [];

  const handleApproveOrder = (order: OrderResponse) => {
    updateStatusMutation.mutate({ id: order.id, status: "CONFIRMED" });
  };

  const handleCancelOrder = (order: OrderResponse) => {
    cancelOrderMutation.mutate({ id: order.id });
  };

  const handleViewDetail = (order: OrderResponse) => {
    navigate(`/admin/order-items`, { state: { orderId: order.id, order } });
  };

  return (
    <section className="flex-1 flex flex-col gap-4">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between card-custom">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Quản lý đơn hàng
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi trạng thái xử lý và lịch sử đơn hàng gần đây.
          </p>
        </div>
        <Button color="outline" icon={Download}>
          Xuất danh sách
        </Button>
      </div>

      {/* FILTER & ORDERS CONTAINER */}
      <div className="card-custom p-4 flex flex-col gap-4">
        <OrderFilter
          keyword={keyword}
          startDate={startDate}
          endDate={endDate}
          status={status}
          onKeywordChange={handleKeywordChange}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          onStatusChange={handleStatusChange}
          onReset={handleResetFilter}
        />

        {isPending ? (
          <OrderSkeleton />
        ) : (
          <>
            <OrderTable
              orders={orders}
              page={page}
              pageSize={size}
              onApprove={handleApproveOrder}
              onCancel={handleCancelOrder}
              onViewDetail={handleViewDetail}
            />

            <OrderMobileCard
              orders={orders}
              onApprove={handleApproveOrder}
              onCancel={handleCancelOrder}
              onViewDetail={handleViewDetail}
            />

            <Pagination
              currentPage={page}
              totalPages={orderData?.totalPages || 1}
              onPageChange={setPage}
              totalItems={orderData?.totalItems || 0}
              pageSize={size}
              onPageSizeChange={(s) => {
                setSize(s);
                setPage(1);
              }}
            />
          </>
        )}
      </div>
    </section>
  );
}
