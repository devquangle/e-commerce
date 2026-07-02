import React from "react";
import { Package, TrendingUp, AlertTriangle } from "lucide-react";
import type { TopProductItem } from "../types/topProduct.type";

interface TopProductRankingTableProps {
  topProducts: TopProductItem[];
}

const rankBadge = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500">
      {rank}
    </span>
  );
};

const TopProductRankingTable: React.FC<TopProductRankingTableProps> = ({
  topProducts,
}) => {
  return (
    <div className="card-custom">
      <div className="mb-4 flex items-center gap-2">
        <Package className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-900">
          Bảng xếp hạng sản phẩm
        </h2>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="pb-3 pr-4">Hạng</th>
              <th className="pb-3 pr-4">Sản phẩm</th>
              <th className="pb-3 pr-4">Danh mục</th>
              <th className="pb-3 pr-4 text-right">Đã bán</th>
              <th className="pb-3 pr-4 text-right">Doanh thu</th>
              <th className="pb-3 pr-4 text-right">Tăng trưởng</th>
              <th className="pb-3 text-right">Tồn kho</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {topProducts.map((product) => {
              const isLowStock = product.stock < 50;
              const isPositiveGrowth = product.growth.startsWith("+");

              return (
                <tr
                  key={product.rank}
                  className="transition-colors hover:bg-slate-50/60"
                >
                  <td className="py-3.5 pr-4">
                    <span className="text-xl">{rankBadge(product.rank)}</span>
                  </td>
                  <td className="py-3.5 pr-4 font-medium text-slate-900">
                    {product.name}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-right font-semibold text-slate-800">
                    {product.sold.toLocaleString()}
                  </td>
                  <td className="py-3.5 pr-4 text-right font-semibold text-slate-800">
                    {product.revenue}
                  </td>
                  <td className="py-3.5 pr-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        isPositiveGrowth
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      <TrendingUp className="h-3 w-3" />
                      {product.growth}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-medium ${
                        isLowStock ? "text-amber-600" : "text-slate-600"
                      }`}
                    >
                      {isLowStock && (
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      )}
                      {product.stock}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {topProducts.map((product) => {
          const isLowStock = product.stock < 50;
          const isPositiveGrowth = product.growth.startsWith("+");

          return (
            <div
              key={product.rank}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{rankBadge(product.rank)}</span>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {product.name}
                    </p>
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                      {product.category}
                    </span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    isPositiveGrowth
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  <TrendingUp className="h-3 w-3" />
                  {product.growth}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-slate-50 px-2 py-2">
                  <p className="text-xs text-slate-500">Đã bán</p>
                  <p className="text-sm font-bold text-slate-800">
                    {product.sold.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 px-2 py-2">
                  <p className="text-xs text-slate-500">Doanh thu</p>
                  <p className="text-sm font-bold text-slate-800">
                    {product.revenue}
                  </p>
                </div>
                <div
                  className={`rounded-lg px-2 py-2 ${
                    isLowStock ? "bg-amber-50" : "bg-slate-50"
                  }`}
                >
                  <p className="text-xs text-slate-500">Tồn kho</p>
                  <p
                    className={`flex items-center justify-center gap-1 text-sm font-bold ${
                      isLowStock ? "text-amber-600" : "text-slate-800"
                    }`}
                  >
                    {isLowStock && (
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                    )}
                    {product.stock}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopProductRankingTable;
