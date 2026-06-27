import React from "react";
import { Activity, ShoppingBag, Coins } from "lucide-react";

interface PromotionStatsProps {
  activeCount: number;
  totalUsage: number;
  totalRevenue: string;
}

const PromotionStats: React.FC<PromotionStatsProps> = ({
  activeCount,
  totalUsage,
  totalRevenue,
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100/50 flex items-center justify-between hover:scale-[1.02] transition-all duration-300">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-500">Chiến dịch đang chạy</p>
          <p className="text-3xl font-extrabold text-slate-900">{activeCount}</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
          <Activity size={24} />
        </div>
      </article>

      <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100/50 flex items-center justify-between hover:scale-[1.02] transition-all duration-300">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-500">Lượt dùng hôm nay</p>
          <p className="text-3xl font-extrabold text-slate-900">{totalUsage}</p>
        </div>
        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <ShoppingBag size={24} />
        </div>
      </article>

      <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100/50 flex items-center justify-between hover:scale-[1.02] transition-all duration-300 sm:col-span-2 lg:col-span-1">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-500">Doanh thu từ ưu đãi</p>
          <p className="text-3xl font-extrabold text-slate-900">{totalRevenue}</p>
        </div>
        <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
          <Coins size={24} />
        </div>
      </article>
    </div>
  );
};

export default PromotionStats;
