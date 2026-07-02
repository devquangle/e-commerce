import { useState } from "react";
import { Download } from "lucide-react";
import type { Order } from "@/modules/admin/order/types/order.type";
import OrderFilter from "@/modules/admin/order/components/OrderFilter";
import OrderTable from "@/modules/admin/order/components/OrderTable";
import OrderMobileCard from "@/modules/admin/order/components/OrderMobileCard";

const initialOrders: Order[] = [
  {
    id: "#DH1029",
    customer: "Nguyen Van A",
    createdAt: "05/05/2026",
    total: "1.250.000đ",
    status: "Chờ xác nhận",
  },
  {
    id: "#DH1028",
    customer: "Tran Thi B",
    createdAt: "05/05/2026",
    total: "890.000đ",
    status: "Đang xử lý",
  },
  {
    id: "#DH1027",
    customer: "Le Van C",
    createdAt: "04/05/2026",
    total: "2.490.000đ",
    status: "Đã giao",
  },
  {
    id: "#DH1026",
    customer: "Pham Thi D",
    createdAt: "04/05/2026",
    total: "340.000đ",
    status: "Đã hủy",
  },
];

export default function Order() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [orders] = useState<Order[]>(initialOrders);

  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      !search.trim() ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <section className=" flex-1 flex flex-col gap-4">
      {/* HEADER WITH card-custom */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between card-custom">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Quản lý đơn hàng
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi trạng thái xử lý và lịch sử đơn hàng gần đây.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200 cursor-pointer active:scale-95">
          <Download size={16} />
          Xuất danh sách
        </button>
      </div>

      {/* FILTER & ORDERS CONTAINER WITH card-custom */}
      <div className="card-custom p-4">
        <OrderFilter
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <OrderTable orders={filteredOrders} />

        <OrderMobileCard orders={filteredOrders} />
      </div>
    </section>
  );
}
