import { Filter, Search } from "lucide-react";
import { type ProductFilterOptions } from "../types/product.filter.options";

interface ProductToolbarProps {
  totalItems: number;
  setOpenFilter: (open: boolean) => void;
  filters: ProductFilterOptions;
  updateFilter: (filters: Partial<ProductFilterOptions>) => void;
}

export default function ProductToolbar({
  totalItems,
  setOpenFilter,
  filters,
  updateFilter,
}: ProductToolbarProps) {
  const searchQuery = filters.keyword || "";
  const sortBy = filters.sort || "NEWEST";

  return (
    <div className="flex flex-col gap-3 mb-4">
      {/* QUICK FILTERS */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-slate-700 mr-2">Bộ lọc nhanh:</span>
        <button
          onClick={() => updateFilter({ sort: "soldCount" })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            sortBy === "soldCount"
              ? "bg-orange-50 border-orange-200 text-orange-600"
              : "bg-white border-slate-200 text-slate-600 hover:border-orange-200 hover:text-orange-600"
          }`}
        >
          🔥 Bán chạy
        </button>
        <button
          onClick={() => updateFilter({ rating: filters.rating === 4 ? undefined : 4 })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            filters.rating === 4
              ? "bg-amber-50 border-amber-200 text-amber-600"
              : "bg-white border-slate-200 text-slate-600 hover:border-amber-200 hover:text-amber-600"
          }`}
        >
          ⭐ 4 sao+
        </button>
        <button
          onClick={() => updateFilter({ sort: "newest" })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            sortBy === "newest"
              ? "bg-emerald-50 border-emerald-200 text-emerald-600"
              : "bg-white border-slate-200 text-slate-600 hover:border-emerald-200 hover:text-emerald-600"
          }`}
        >
          📚 Sách mới
        </button>
        <button
          onClick={() => updateFilter({ maxPrice: filters.maxPrice === 100000 ? undefined : 100000 })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            filters.maxPrice === 100000
              ? "bg-blue-50 border-blue-200 text-blue-600"
              : "bg-white border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600"
          }`}
        >
          💰 Dưới 100k
        </button>
        <button
          onClick={() => updateFilter({ hasPromotion: filters.hasPromotion === "true" ? undefined : "true" })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            filters.hasPromotion === "true"
              ? "bg-rose-50 border-rose-200 text-rose-600"
              : "bg-white border-slate-200 text-slate-600 hover:border-rose-200 hover:text-rose-600"
          }`}
        >
          🎁 Khuyến mãi
        </button>
      </div>
      {/* INPUT TEXT TÌM KIẾM - MOBILE */}
      <div className="block lg:hidden mb-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Tìm kiếm sách bạn quan tâm..."
            value={searchQuery}
            onChange={(e) => updateFilter({ keyword: e.target.value })}
            className="w-full bg-white border border-slate-200 text-sm font-medium px-4 py-3 pl-10 rounded-xl outline-none shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-slate-800 placeholder-slate-400"
          />
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
        </div>
      </div>

      {/* UTILITY BAR */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 mb-4 flex items-center justify-between gap-4 shadow-sm">
        <div className="text-sm font-medium text-slate-500">
          Tìm thấy <span className="font-bold text-slate-800">{totalItems}</span> sản phẩm
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenFilter(true)}
            className="lg:hidden flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 transition-all active:scale-95"
          >
            <Filter size={14} className="text-indigo-600" />
            <span>Lọc & Sắp xếp</span>
          </button>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
              Sắp xếp:
            </span>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => updateFilter({ sort: "newest" })}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  sortBy === "newest"
                    ? "bg-white shadow text-indigo-600"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Mới nhất
              </button>
              <button
                onClick={() => updateFilter({ sort: "soldCount" })}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  sortBy === "soldCount"
                    ? "bg-white shadow text-indigo-600"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Bán chạy
              </button>
              <button
                onClick={() => updateFilter({ sort: "priceAsc" })}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  sortBy === "priceAsc"
                    ? "bg-white shadow text-indigo-600"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Giá ↑
              </button>
              <button
                onClick={() => updateFilter({ sort: "priceDesc" })}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  sortBy === "priceDesc"
                    ? "bg-white shadow text-indigo-600"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Giá ↓
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
