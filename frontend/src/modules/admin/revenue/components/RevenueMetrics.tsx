import React from "react";
import { DollarSign, ShoppingBag, Percent, TrendingUp, RefreshCw } from "lucide-react";

interface RevenueMetricsProps {
  monthlyRevenueText: string;
  monthlyRevenueTrend: string;
  averageOrderValueText: string;
  averageOrderValueTrend: string;
  returnRateText: string;
  returnRateTrend: string;
}

const RevenueMetrics: React.FC<RevenueMetricsProps> = ({
  monthlyRevenueText,
  monthlyRevenueTrend,
  averageOrderValueText,
  averageOrderValueTrend,
  returnRateText,
  returnRateTrend,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* DOANH THU THÁNG NÀY */}
      <article className="relative overflow-hidden card-custom p-4">
        <div className="absolute top-0 inset-x-0 h-1 bg-indigo-500" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">Doanh thu tháng này</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <DollarSign size={20} />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <p className="text-2xl font-bold tracking-tight text-slate-900">{monthlyRevenueText}</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            <TrendingUp size={12} />
            {monthlyRevenueTrend}
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400">so với tháng trước</p>
      </article>

      {/* GIÁ TRỊ ĐƠN TRUNG BÌNH */}
      <article className="relative overflow-hidden card-custom p-4">
        <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">Giá trị đơn trung bình</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ShoppingBag size={20} />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <p className="text-2xl font-bold tracking-tight text-slate-900">{averageOrderValueText}</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            <TrendingUp size={12} />
            {averageOrderValueTrend}
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400">so với tháng trước</p>
      </article>

      {/* TỶ LỆ HOÀN ĐƠN */}
      <article className="relative overflow-hidden card-custom p-4">
        <div className="absolute top-0 inset-x-0 h-1 bg-rose-500" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">Tỷ lệ hoàn đơn</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <Percent size={18} />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <p className="text-2xl font-bold tracking-tight text-slate-900">{returnRateText}</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
            <RefreshCw size={12} className="animate-spin-slow" />
            {returnRateTrend}
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400">so với tháng trước</p>
      </article>
    </div>
  );
};

export default RevenueMetrics;
