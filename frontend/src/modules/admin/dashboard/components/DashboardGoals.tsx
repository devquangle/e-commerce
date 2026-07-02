import React from "react";

interface DashboardGoalsProps {
  revenuePercent: number;
  ordersPercent: number;
  customersPercent: number;
  suggestionText: string;
}

const DashboardGoals: React.FC<DashboardGoalsProps> = ({
  revenuePercent,
  ordersPercent,
  customersPercent,
  suggestionText,
}) => {
  return (
    <div className="card-custom p-4 flex flex-col justify-between">
      <div>
        <h2 className="mb-6 text-lg font-bold text-slate-900">Mục tiêu tháng 5</h2>
        <div className="space-y-5">
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-semibold text-slate-600">Doanh thu đạt được</span>
              <span className="font-bold text-indigo-600">{revenuePercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600" style={{ width: `${revenuePercent}%` }} />
            </div>
          </div>

          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-semibold text-slate-600">Đơn hàng hoàn thành</span>
              <span className="font-bold text-emerald-600">{ordersPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600" style={{ width: `${ordersPercent}%` }} />
            </div>
          </div>

          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-semibold text-slate-600">Khách hàng mới</span>
              <span className="font-bold text-amber-600">{customersPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600" style={{ width: `${customersPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/50 text-xs text-indigo-700 leading-relaxed">
        💡 <b>Gợi ý:</b> {suggestionText}
      </div>
    </div>
  );
};

export default DashboardGoals;
