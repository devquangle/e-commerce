import React from 'react';
import { PieChart } from 'lucide-react';

interface OrderStatus {
  label: string;
  percentage: number;
  colorClass: string;
  bgClass: string;
}

const DashboardOrderStatus: React.FC = () => {
  const statuses: OrderStatus[] = [
    { label: 'Đã giao', percentage: 45, colorClass: 'bg-emerald-500', bgClass: 'bg-emerald-100' },
    { label: 'Đang xử lý', percentage: 30, colorClass: 'bg-amber-500', bgClass: 'bg-amber-100' },
    { label: 'Chờ xác nhận', percentage: 15, colorClass: 'bg-violet-500', bgClass: 'bg-violet-100' },
    { label: 'Đã hủy', percentage: 10, colorClass: 'bg-rose-500', bgClass: 'bg-rose-100' },
  ];

  return (
    <div className="card-custom p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <PieChart className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-800">Đơn hàng theo trạng thái</h2>
      </div>

      <div className="flex flex-col gap-4">
        {statuses.map((status, index) => (
          <div key={index} className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-700 font-medium">{status.label}</span>
              <span className="text-slate-500">{status.percentage}%</span>
            </div>
            <div className={`w-full h-2 rounded-full ${status.bgClass}`}>
              <div 
                className={`h-full rounded-full ${status.colorClass}`}
                style={{ width: `${status.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardOrderStatus;
