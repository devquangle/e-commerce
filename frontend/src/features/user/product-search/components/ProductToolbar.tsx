import { Filter, ChevronDown, Search } from "lucide-react";
import { SORT_OPTIONS, type ProductFilterOptions, type SortType } from "../types/product.filter.options";

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
    <>
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
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 mb-6 flex items-center justify-between gap-4 shadow-sm">
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
            <div className="relative w-[180px]">
              <select
                value={sortBy}
                onChange={(e) => updateFilter({ sort: e.target.value as SortType })}
                className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2.5 rounded-xl outline-none appearance-none cursor-pointer transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
              >
                {SORT_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="font-medium text-slate-800 bg-white"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
