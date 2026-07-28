
import { OrderFilter } from "@/modules/user/order/components/OrderFilter";
import { OrderCard } from "@/modules/user/order/components/OrderCard";
import { useOrderFilter } from "@/modules/user/order/hooks/useOrderFilter";
import Pagination from "@/components/common/Pagination";

export default function Orders() {
  const { 
    form, 
    filters, 
    setStatus, 
    setPage, 
    setSize, 
    resetFilters,
    orders,
    totalItems,
    totalPages,
    isLoading,
  } = useOrderFilter();

  return (
    <div className="flex-1 p-2 flex flex-col min-h-full">
      <OrderFilter
        register={form.register}
        statusFilter={filters.status}
        setStatusFilter={setStatus}
        onReset={resetFilters}
      />

      {/* Orders */}
      <div className="grid grid-cols-1 gap-3 flex-1">
        {isLoading ? (
          <p className="text-center text-gray-500 text-sm py-8">
            Đang tải đơn hàng...
          </p>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm py-8">
            Không có đơn hàng nào
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="mt-4">
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={setPage}
            pageSize={filters.size}
            onPageSizeChange={setSize}
            totalItems={totalItems}
          />
        </div>
      )}
    </div>
  );
}
