import React from "react";
import { User, Calendar, Eye, Edit3 } from "lucide-react";
import type { Order } from "../types/order.type";
import { statusBadgeClass } from "../utils/orderUtils";

interface OrderMobileCardProps {
  orders: Order[];
  onViewDetails?: (order: Order) => void;
  onUpdateStatus?: (order: Order) => void;
}

const OrderMobileCard: React.FC<OrderMobileCardProps> = ({
  orders,
  onViewDetails,
  onUpdateStatus,
}) => {
  return (
    <div className="block md:hidden space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-indigo-600 text-sm">{order.id}</span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusBadgeClass(order.status)}`}>
              {order.status}
            </span>
          </div>

          <div className="space-y-1.5 pt-1 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium flex items-center gap-1"><User size={12} /> Khách hàng:</span>
              <span className="text-slate-900 font-semibold">{order.customer}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium flex items-center gap-1"><Calendar size={12} /> Ngày tạo:</span>
              <span className="text-slate-700 font-medium">{order.createdAt}</span>
            </div>
            <div className="flex justify-between items-center pt-1.5 border-t border-slate-200/50">
              <span className="text-slate-500 font-medium">Tổng thanh toán:</span>
              <span className="text-slate-900 font-bold text-sm">{order.total}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1.5">
            <button 
              onClick={() => onViewDetails?.(order)}
              className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              <Eye size={12} /> Chi tiết
            </button>
            <button 
              onClick={() => onUpdateStatus?.(order)}
              className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              <Edit3 size={12} /> Cập nhật
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderMobileCard;
