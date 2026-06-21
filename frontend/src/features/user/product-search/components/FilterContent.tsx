import { useState } from "react";
import { useBookFormData } from "@/hooks/useBookFormData";
import type { ProductFilterOptions } from "../types/product.filter.options";
import { Building2, Layers, ChevronDown, Star } from "lucide-react";

/* ================= TYPES ================= */

interface CheckboxListItem {
  id: number;
  name: string;
  urlImage?: string;
  bookCount?: number;
}

interface CheckboxListProps {
  items: CheckboxListItem[];
  limit?: number;
  selectedValues?: string[];
  onChange?: (value: string, checked: boolean) => void;
}

interface RadioListItem {
  id: number;
  name: string;
  slug: string;
  bookCount?: number;
}

interface RadioListProps {
  items: RadioListItem[];
  limit?: number;
  selectedValue?: string;
  onChange: (slug: string | undefined) => void;
  icon?: React.ReactNode;
}

interface FilterContentProps {
  priceRange?: number;
  setPriceRange?: (value: number) => void;
  filters?: ProductFilterOptions;
  updateFilter?: (filters: Partial<ProductFilterOptions>) => void;
}

/* ================= COMPONENTS ================= */

function FilterSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-100 last:border-0 pb-5 last:pb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full group py-1 outline-none"
      >
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
          {title}
        </h4>
        <ChevronDown
          size={16}
          strokeWidth={2.5}
          className={`text-slate-400 group-hover:text-indigo-600 transition-transform duration-300 ${isOpen ? "rotate-0" : "-rotate-90"}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[5000px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}
      >
        {children}
      </div>
    </div>
  );
}

function CheckboxList({
  items,
  limit = 5,
  selectedValues,
  onChange,
}: CheckboxListProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, limit);
  const hasMore = items.length > limit;

  return (
    <div>
      <div className="space-y-2">
        {visibleItems.map((item) => {
          const itemValue = item.slug || item.id.toString();
          const isChecked = selectedValues?.includes(itemValue) || false;
          return (
            <label
              key={item.id}
              className="flex items-center justify-between group text-sm font-medium text-slate-600 cursor-pointer select-none hover:text-indigo-600 transition-colors"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                <input
                  type="checkbox"
                  value={itemValue}
                  checked={isChecked}
                  onChange={(e) => onChange?.(itemValue, e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500/20 cursor-pointer flex-shrink-0"
                />
                <div className="w-6 h-6 rounded bg-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {item.urlImage ? (
                    <img
                      src={item.urlImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">
                      {item.name.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="truncate">{item.name}</span>
              </div>
              {item.bookCount !== undefined && (
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors flex-shrink-0">
                  {item.bookCount}
                </span>
              )}
            </label>
          );
        })}
        {items.length === 0 && (
          <span className="text-sm text-slate-400 italic">
            Không có dữ liệu
          </span>
        )}
      </div>
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors block"
        >
          {expanded ? "Thu gọn" : `Xem thêm (${items.length - limit})`}
        </button>
      )}
    </div>
  );
}

function RadioList({
  items,
  limit = 5,
  selectedValue,
  onChange,
  icon,
}: RadioListProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, limit);
  const hasMore = items.length > limit;

  return (
    <div>
      <div className="space-y-2">
        <label className="flex items-center gap-2.5 text-sm font-medium text-slate-600 cursor-pointer select-none hover:text-indigo-600 transition-colors mb-2">
          <input
            type="radio"
            checked={!selectedValue}
            onChange={() => onChange(undefined)}
            className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500/20 cursor-pointer flex-shrink-0"
          />
          <div className="w-6 h-6 rounded bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400">
            {icon}
          </div>
          <span className="truncate flex-1">Tất cả</span>
        </label>

        {visibleItems.map((item) => (
          <label
            key={item.id}
            className="flex items-center justify-between group text-sm font-medium text-slate-600 cursor-pointer select-none hover:text-indigo-600 transition-colors mt-2"
          >
            <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
              <input
                type="radio"
                value={item.slug}
                checked={selectedValue === item.slug}
                onChange={() => onChange(item.slug)}
                className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500/20 cursor-pointer flex-shrink-0"
              />
              <div className="w-6 h-6 rounded bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                {icon}
              </div>
              <span className="truncate">{item.name}</span>
            </div>
            {item.bookCount !== undefined && (
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors flex-shrink-0">
                {item.bookCount}
              </span>
            )}
          </label>
        ))}
        {items.length === 0 && (
          <span className="text-sm text-slate-400 italic">
            Không có dữ liệu
          </span>
        )}
      </div>
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors block"
        >
          {expanded ? "Thu gọn" : `Xem thêm (${items.length - limit})`}
        </button>
      )}
    </div>
  );
}

/* ================= MAIN ================= */

export default function FilterContent({
  priceRange = 500000,
  setPriceRange,
  filters,
  updateFilter,
}: FilterContentProps) {
  const { genresData, authorsData, publishersData, seriesData, isLoading } =
    useBookFormData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleCheckboxChange = (
    filterKey: "genres" | "authors",
    value: string,
    checked: boolean,
  ) => {
    if (!updateFilter) return;
    const currentValues = filters?.[filterKey] || [];
    let newValues;
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter((v) => v !== value);
    }
    updateFilter({ [filterKey]: newValues });
  };

  const SkeletonLoading = () => (
    <div className="animate-pulse space-y-2">
      <div className="h-4 bg-slate-100 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-slate-100 rounded w-full"></div>
      <div className="h-4 bg-slate-100 rounded w-full"></div>
      <div className="h-4 bg-slate-100 rounded w-3/4"></div>
    </div>
  );

  return (
    <div className="space-y-5">
      <FilterSection title="Thể loại" defaultOpen={true}>
        {isLoading ? (
          <SkeletonLoading />
        ) : (
          <CheckboxList
            items={genresData as any}
            limit={5}
            selectedValues={filters?.genres}
            onChange={(val, checked) =>
              handleCheckboxChange("genres", val, checked)
            }
          />
        )}
      </FilterSection>

      <FilterSection title="Tác giả" defaultOpen={true}>
        {isLoading ? (
          <SkeletonLoading />
        ) : (
          <CheckboxList
            items={authorsData as any}
            limit={5}
            selectedValues={filters?.authors}
            onChange={(val, checked) =>
              handleCheckboxChange("authors", val, checked)
            }
          />
        )}
      </FilterSection>

      <FilterSection title="Nhà xuất bản" defaultOpen={true}>
        {isLoading ? (
          <SkeletonLoading />
        ) : (
          <RadioList
            items={publishersData as any}
            limit={5}
            selectedValue={filters?.publisher}
            onChange={(slug) => updateFilter?.({ publisher: slug })}
            icon={<Building2 size={14} />}
          />
        )}
      </FilterSection>

      <FilterSection title="Series" defaultOpen={true}>
        {isLoading ? (
          <SkeletonLoading />
        ) : (
          <RadioList
            items={seriesData as any}
            limit={5}
            selectedValue={filters?.series}
            onChange={(slug) => updateFilter?.({ series: slug })}
            icon={<Layers size={14} />}
          />
        )}
      </FilterSection>

      <FilterSection title="Đánh giá" defaultOpen={true}>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 text-sm font-medium text-slate-600 cursor-pointer select-none hover:text-indigo-600 transition-colors">
            <input
              type="radio"
              name="rating"
              checked={!filters?.rating}
              onChange={() => updateFilter?.({ rating: undefined })}
              className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500/20 cursor-pointer flex-shrink-0"
            />
            <span className="flex-1">Tất cả</span>
          </label>
          {[5, 4, 3, 2, 1].map((r) => (
            <label
              key={r}
              className="flex items-center gap-2.5 text-sm font-medium text-slate-600 cursor-pointer select-none hover:text-indigo-600 transition-colors"
            >
              <input
                type="radio"
                name="rating"
                checked={filters?.rating === r}
                onChange={() => updateFilter?.({ rating: r })}
                className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500/20 cursor-pointer flex-shrink-0"
              />
              <div className="flex items-center gap-1 flex-1">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < r ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
                    />
                  ))}
                </div>
                {r < 5 && <span className="ml-1 text-[13px] text-slate-500">trở lên</span>}
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Khoảng giá" defaultOpen={true}>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg">
              Dưới {formatCurrency(priceRange)}
            </span>
          </div>

          <div className="relative pt-1">
            <input
              type="range"
              min="0"
              max="500000"
              step="10000"
              value={priceRange}
              onChange={(e) => {
                if (setPriceRange) {
                  setPriceRange(Number(e.target.value));
                }
              }}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 transition-all focus:outline-none"
            />
          </div>

          <div className="flex justify-between text-[11px] font-bold text-slate-400">
            <span>0đ</span>
            <span>500.000đ</span>
          </div>
        </div>
      </FilterSection>
    </div>
  );
}
