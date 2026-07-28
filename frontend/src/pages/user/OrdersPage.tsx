import { OrderFilter } from "@/modules/user/order/components/OrderFilter";
import { OrderCard } from "@/modules/user/order/components/OrderCard";
import { OrderCardSkeleton } from "@/modules/user/order/components/OrderCardSkeleton";
import { OrderEmpty } from "@/modules/user/order/components/OrderEmpty";
import { useOrderFilter } from "@/modules/user/order/hooks/useOrderFilter";
import { useSearchOrderByUser } from "@/modules/user/order/hooks/useOrder";
import Pagination from "@/components/common/Pagination";

export default function Orders() {
  const {
    keyword,
    startDate,
    endDate,
    status,
    page,
    size,
    filterParams,
    handleKeywordChange,
    handleStartDateChange,
    handleEndDateChange,
    handleStatusChange,
    handleResetFilter,
    setPage,
    setSize,
  } = useOrderFilter();

  const { data: orderData, isFetching } = useSearchOrderByUser(filterParams);

  const orders = orderData?.items ?? [];
  const totalItems = orderData?.totalItems ?? 0;
  const totalPages = orderData?.totalPages ?? 0;

  return (
    <div className="flex-1 p-2 flex flex-col min-h-full">
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

      {/* Orders */}
      <div className="grid grid-cols-1 gap-3 flex-1">
        {isFetching ? (
          Array.from({ length: 3 }).map((_, index) => (
            <OrderCardSkeleton key={index} />
          ))
        ) : orders.length > 0 ? (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        ) : (
          <OrderEmpty />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="mt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            pageSize={size}
            onPageSizeChange={setSize}
            totalItems={totalItems}
          />
        </div>
      )}
    </div>
  );
}
