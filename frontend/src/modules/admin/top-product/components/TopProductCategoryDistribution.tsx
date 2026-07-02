import React from "react";
import type { CategoryDistributionItem } from "../types/topProduct.type";

interface TopProductCategoryDistributionProps {
  categoryDistribution: CategoryDistributionItem[];
  onDetailAnalysisClick?: () => void;
}

const TopProductCategoryDistribution: React.FC<TopProductCategoryDistributionProps> = ({
  categoryDistribution,
  onDetailAnalysisClick,
}) => {
  return (
    <aside className="card-custom p-4">
      <h2 className="text-lg font-semibold text-slate-900">Tỷ trọng danh mục</h2>
      <p className="mt-1 text-sm text-slate-500">Phân bổ doanh thu theo danh mục sách.</p>

      <div className="mt-6 space-y-4">
        {categoryDistribution.map((item) => (
          <div key={item.name}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{item.name}</span>
              <span className="text-slate-500">{item.percent}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-indigo-600"
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={onDetailAnalysisClick}
        className="mt-6 w-full rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer active:scale-95"
      >
        Xem phân tích chi tiết
      </button>
    </aside>
  );
};

export default TopProductCategoryDistribution;
