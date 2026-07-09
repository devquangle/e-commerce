import type { Order } from "@/modules/user/order/types/order.type";
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
    resetFilters 
  } = useOrderFilter();

  const orders: Order[] = [
    {
      id: 1,
      fullname: "Nguyen Van A",
      phone: "0901234567",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      total: 250000,
      status: "COMPLETED",
      paymentMethod: "COD",
      paymentStatus: "UNPAID",
      date: "2025-12-01",
    },
    {
      id: 2,
      fullname: "Tran Thi B",
      phone: "0912345678",
      address: "456 Đường XYZ, Quận 3, TP.HCM",
      total: 520000,
      status: "SHIPPING",
      paymentMethod: "VNPAY",
      paymentStatus: "UNPAID",
      date: "2025-12-15",
    },
    {
      id: 3,
      fullname: "Nguyen Van A",
      phone: "0901234567",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      total: 250000,
      status: "PENDING",
      paymentMethod: "COD",
      paymentStatus: "UNPAID",
      date: "2025-12-01",
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.date).getTime();
    const start = filters.createDate ? new Date(filters.createDate).getTime() : null;
    const end = filters.endDate ? new Date(filters.endDate).getTime() : null;

    const statusMatch = filters.status ? order.status === filters.status : true;
    const dateMatch =
      (!start || orderDate >= start) && (!end || orderDate <= end);
    const nameMatch = filters.keyword
      ? order.fullname.toLowerCase().includes(filters.keyword.toLowerCase())
      : true;

    return statusMatch && dateMatch && nameMatch;
  });

  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / filters.size);
  const paginatedOrders = filteredOrders.slice(
    (filters.page - 1) * filters.size,
    filters.page * filters.size
  );

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
        {paginatedOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}

        {paginatedOrders.length === 0 && (
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
