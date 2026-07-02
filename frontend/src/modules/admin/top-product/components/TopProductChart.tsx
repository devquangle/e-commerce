import React from "react";
import type { TopProductItem } from "../types/topProduct.type";

interface TopProductChartProps {
  topProducts: TopProductItem[];
}

const TopProductChart: React.FC<TopProductChartProps> = ({ topProducts }) => {
  const maxSold = Math.max(...topProducts.map((product) => product.sold));

  return (
    <div className="card-custom p-4 xl:col-span-2">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Biểu đồ cột số lượng sách bán ra</h2>
      <div className="grid grid-cols-5 items-end gap-4">
        {topProducts.map((product) => (
          <div key={product.rank} className="flex flex-col items-center gap-2">
            <p className="text-xs font-semibold text-slate-500">{product.sold}</p>
            <div className="flex h-56 items-end">
              <div
                className="w-12 rounded-t-md bg-indigo-600 transition-all hover:bg-indigo-700 cursor-pointer"
                style={{ height: `${Math.round((product.sold / maxSold) * 100)}%` }}
                title={`${product.name}: ${product.sold} bản`}
              />
            </div>
            <p className="line-clamp-2 text-center text-xs font-medium text-slate-700">{product.name}</p>
            <p className="text-xs text-emerald-600">{product.growth}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProductChart;
