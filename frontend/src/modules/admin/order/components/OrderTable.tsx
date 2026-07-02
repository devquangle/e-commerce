import React from "react";
import { Calendar, Eye, Edit3 } from "lucide-react";
import type { Order } from "../types/order.type";
import { statusBadgeClass } from "../utils/orderUtils";

interface OrderTableProps {
  orders: Order[];
  onViewDetails?: (order: Order) => void;
  onUpdateStatus?: (order: Order) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onViewDetails,
  onUpdateStatus,
}) => {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-slate-400 font-semibold">
            <th className="pb-3 font-semibold w-28">Mã đơn</th>
            <th className="pb-3 font-semibold">Khách hàng</th>
            <th className="pb-3 font-semibold w-36">Ngày tạo</th>
            <th className="pb-3 font-semibold w-36">Tổng tiền</th>
            <th className="pb-3 font-semibold w-36">Trạng thái</th>
            <th className="pb-3 font-semibold text-right w-36">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="py-4 font-bold text-indigo-600">{order.id}</td>
              <td className="py-4 text-slate-900 font-semibold">{order.customer}</td>
              <td className="py-4 text-slate-500 font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={13} className="text-slate-400" />
                  {order.createdAt}
                </span>
              </td>
              <td className="py-4 text-slate-900 font-bold">{order.total}</td>
              <td className="py-4">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusBadgeClass(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="py-4 text-right space-x-1 whitespace-nowrap">
                <button 
                  onClick={() => onViewDetails?.(order)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition active:scale-90 cursor-pointer" 
                  title="Chi tiết đơn"
                >
                  <Eye size={14} />
                </button>
                <button 
                  onClick={() => onUpdateStatus?.(order)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition active:scale-90 cursor-pointer" 
                  title="Cập nhật trạng thái"
                >
                  <Edit3 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
