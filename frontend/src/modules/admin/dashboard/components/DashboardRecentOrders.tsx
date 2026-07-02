import React from "react";
import { ArrowUpRight } from "lucide-react";
import type { RecentOrder } from "../types/dashboard.type";

interface DashboardRecentOrdersProps {
  recentOrders: RecentOrder[];
}

const statusBadgeClass = (status: string) => {
  switch (status) {
    case "Đã giao":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "Đang xử lý":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "Chờ xác nhận":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "Đã hủy":
      return "bg-rose-50 text-rose-700 border-rose-100";
    default:
      return "bg-slate-50 text-slate-700 border-slate-100";
  }
};

const DashboardRecentOrders: React.FC<DashboardRecentOrdersProps> = ({
  recentOrders,
}) => {
  return (
    <div className="card-custom p-4 lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900">Đơn hàng gần đây</h2>
        <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition cursor-pointer flex items-center gap-1 group">
          Xem tất cả <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
      
      {/* ===================== DESKTOP TABLE ===================== */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold">
              <th className="pb-3 font-semibold">Mã đơn</th>
              <th className="pb-3 font-semibold">Khách hàng</th>
              <th className="pb-3 font-semibold">Tổng tiền</th>
              <th className="pb-3 font-semibold">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 font-semibold text-indigo-600">{order.id}</td>
                <td className="py-3.5 text-slate-700 font-medium">{order.customer}</td>
                <td className="py-3.5 text-slate-900 font-semibold">{order.total}</td>
                <td className="py-3.5">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===================== MOBILE CARDS ===================== */}
      <div className="block sm:hidden space-y-3">
        {recentOrders.map((order) => (
          <div key={order.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-600 text-sm">{order.id}</span>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold border ${statusBadgeClass(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Khách hàng:</span>
              <span className="text-slate-900 font-semibold">{order.customer}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Tổng tiền:</span>
              <span className="text-slate-900 font-bold">{order.total}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardRecentOrders;
