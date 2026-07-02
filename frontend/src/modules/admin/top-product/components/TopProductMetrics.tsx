import React from "react";

interface TopProductMetricsProps {
  totalSold: string;
  totalSoldTrend: string;
  top5Revenue: string;
  top5RevenueTrend: string;
  leaderName: string;
  leaderSold: number;
  highlightCategory: string;
  highlightCategoryShareText: string;
}

const TopProductMetrics: React.FC<TopProductMetricsProps> = ({
  totalSold,
  totalSoldTrend,
  top5Revenue,
  top5RevenueTrend,
  leaderName,
  leaderSold,
  highlightCategory,
  highlightCategoryShareText,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article className="card-custom p-4">
        <p className="text-sm text-slate-500">Tổng sách bán ra</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{totalSold}</p>
        <p className="mt-2 text-xs font-medium text-emerald-600">{totalSoldTrend}</p>
      </article>
      <article className="card-custom p-4">
        <p className="text-sm text-slate-500">Doanh thu từ top 5</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{top5Revenue}</p>
        <p className="mt-2 text-xs font-medium text-emerald-600">{top5RevenueTrend}</p>
      </article>
      <article className="card-custom p-4">
        <p className="text-sm text-slate-500">Đầu sách dẫn đầu</p>
        <p className="mt-1 text-base font-semibold text-slate-900">{leaderName}</p>
        <p className="mt-2 text-xs text-slate-500">{leaderSold} bản đã bán</p>
      </article>
      <article className="card-custom p-4">
        <p className="text-sm text-slate-500">Danh mục nổi bật</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{highlightCategory}</p>
        <p className="mt-2 text-xs text-slate-500">{highlightCategoryShareText}</p>
      </article>
    </div>
  );
};

export default TopProductMetrics;
