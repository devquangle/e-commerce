import { X } from "lucide-react";
import { type ProductFilterOptions } from "../types/product.filter.options";
import { formatMoney } from "@/utils/number.utils";

interface ActiveFiltersProps {
  filters: ProductFilterOptions;
  updateFilter: (filters: Partial<ProductFilterOptions>) => void;
  resetFilters: () => void;
}

export default function ActiveFilters({ filters, updateFilter, resetFilters }: ActiveFiltersProps) {
  // Determine if there are any active filters (excluding page, size, sort)
  const activeKeys = Object.keys(filters).filter(k => 
    !['page', 'size', 'sort'].includes(k) && 
    filters[k as keyof ProductFilterOptions] !== undefined &&
    filters[k as keyof ProductFilterOptions] !== ''
  );
  
  if (activeKeys.length === 0) return null;

  const removeFilter = (key: keyof ProductFilterOptions, valueToRemove?: string) => {
    if (key === 'genres' || key === 'authors') {
      const current = filters[key] as string[];
      if (current && valueToRemove) {
        const next = current.filter(v => v !== valueToRemove);
        updateFilter({ [key]: next.length > 0 ? next : undefined });
      }
    } else {
      updateFilter({ [key]: undefined });
    }
  };

  const removePriceRange = () => {
    updateFilter({ minPrice: undefined, maxPrice: undefined });
  };

  const hasPriceRange = filters.minPrice !== undefined || filters.maxPrice !== undefined;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm font-medium text-slate-500 mr-1">Đang lọc theo:</span>
      
      {filters.keyword && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-[13px] font-medium rounded-full border border-indigo-100">
          Từ khóa: <span className="font-semibold">{filters.keyword}</span>
          <button onClick={() => removeFilter('keyword')} className="hover:bg-indigo-200 p-0.5 rounded-full transition-colors ml-1"><X size={14} /></button>
        </span>
      )}
      
      {hasPriceRange && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-[13px] font-medium rounded-full border border-indigo-100">
          Giá: <span className="font-semibold">{filters.minPrice ? formatMoney(filters.minPrice) : '0đ'} - {filters.maxPrice ? formatMoney(filters.maxPrice) : 'Trở lên'}</span>
          <button onClick={removePriceRange} className="hover:bg-indigo-200 p-0.5 rounded-full transition-colors ml-1"><X size={14} /></button>
        </span>
      )}
      
      {filters.rating && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-[13px] font-medium rounded-full border border-indigo-100">
          Đánh giá: <span className="font-semibold">từ {filters.rating} sao</span>
          <button onClick={() => removeFilter('rating')} className="hover:bg-indigo-200 p-0.5 rounded-full transition-colors ml-1"><X size={14} /></button>
        </span>
      )}
      
      {filters.publisher && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-[13px] font-medium rounded-full border border-indigo-100">
          NXB: <span className="font-semibold">{filters.publisher}</span>
          <button onClick={() => removeFilter('publisher')} className="hover:bg-indigo-200 p-0.5 rounded-full transition-colors ml-1"><X size={14} /></button>
        </span>
      )}

      {filters.hasPromotion === 'true' && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-[13px] font-medium rounded-full border border-indigo-100">
          <span className="font-semibold">Đang khuyến mãi</span>
          <button onClick={() => removeFilter('hasPromotion')} className="hover:bg-indigo-200 p-0.5 rounded-full transition-colors ml-1"><X size={14} /></button>
        </span>
      )}

      {filters.genres?.map(genre => (
        <span key={`genre-${genre}`} className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-[13px] font-medium rounded-full border border-indigo-100">
          Thể loại: <span className="font-semibold">{genre}</span>
          <button onClick={() => removeFilter('genres', genre)} className="hover:bg-indigo-200 p-0.5 rounded-full transition-colors ml-1"><X size={14} /></button>
        </span>
      ))}

      {filters.authors?.map(author => (
        <span key={`author-${author}`} className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-[13px] font-medium rounded-full border border-indigo-100">
          Tác giả: <span className="font-semibold">{author}</span>
          <button onClick={() => removeFilter('authors', author)} className="hover:bg-indigo-200 p-0.5 rounded-full transition-colors ml-1"><X size={14} /></button>
        </span>
      ))}

      <button 
        onClick={resetFilters}
        className="text-[13px] font-medium text-slate-500 hover:text-red-600 underline underline-offset-2 ml-2 transition-colors px-2 py-1"
      >
        Xóa tất cả
      </button>
    </div>
  );
}
