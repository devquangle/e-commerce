import { Filter, X } from "lucide-react";
import FilterContent from "./FilterContent";
import { SORT_OPTIONS, type ProductFilterOptions } from "../types/product.filter.options";

interface FilterSidebarProps {
  openFilter: boolean;
  setOpenFilter: (open: boolean) => void;
  filters: ProductFilterOptions;
  updateFilter: (filters: Partial<ProductFilterOptions>) => void;
  resetFilters: () => void;
}

export default function FilterSidebar({
  openFilter,
  setOpenFilter,
  filters,
  updateFilter,
  resetFilters,
}: FilterSidebarProps) {
  const setPriceRange = (val: number) => updateFilter({ maxPrice: val });
  const priceRange = filters.maxPrice ?? 500000;

  return (
    <>
      {/* ASIDE DESKTOP */}
      <aside className="hidden lg:block lg:w-[280px] shrink-0">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-5 pb-4 border-b border-slate-100 flex items-center gap-2">
            <Filter size={18} className="text-indigo-600" />
            Bộ Lọc Tìm Kiếm
          </h2>
          <FilterContent priceRange={priceRange} setPriceRange={setPriceRange} />
        </div>
      </aside>

      {/* MODAL FILTER MOBILE */}
      {openFilter && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center lg:hidden transition-all duration-300">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setOpenFilter(false)}
          />

          <div className="relative bg-white w-full sm:w-[90%] sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300 z-10">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Filter size={18} className="text-indigo-600" />
                Bộ lọc & Sắp xếp
              </h3>
              <button
                onClick={() => setOpenFilter(false)}
                className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
              {/* Sắp xếp theo */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Sắp xếp theo
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SORT_OPTIONS.map((option) => {
                    const isSelected = filters.sort === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateFilter({ sort: option.value })}
                        className={`text-left px-4 py-3 rounded-xl font-bold text-xs border transition-all ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-500 text-indigo-600"
                            : "bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Bộ lọc nâng cao */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  Bộ lọc nâng cao
                </label>
                <FilterContent priceRange={priceRange} setPriceRange={setPriceRange} />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 p-4 sm:p-6 bg-slate-50/80 rounded-b-2xl">
              <div className="flex gap-3">
                <button
                  onClick={resetFilters}
                  className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold text-sm py-3 rounded-xl hover:bg-slate-100 transition-all"
                >
                  Thiết lập lại
                </button>
                <button
                  onClick={() => setOpenFilter(false)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
