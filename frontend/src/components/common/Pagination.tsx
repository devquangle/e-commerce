import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import type { ChangeEvent } from "react";

import { cn } from "@/lib/utils";

type PageItem = number | "ellipsis-left" | "ellipsis-right";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  siblingCount?: number;
  totalItems?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  disabled?: boolean;
};

function createPageItems(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): PageItem[] {
  const items: PageItem[] = [];
  const visibleSlots = siblingCount * 2 + 5;

  if (totalPages <= visibleSlots) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 2);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages - 1);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  items.push(1);

  if (showLeftEllipsis) {
    items.push("ellipsis-left");
  }

  for (let page = leftSibling; page <= rightSibling; page += 1) {
    items.push(page);
  }

  if (showRightEllipsis) {
    items.push("ellipsis-right");
  }

  items.push(totalPages);

  return items;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  siblingCount = 1,
  totalItems,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
  disabled = false,
}: PaginationProps) {
  if (totalPages === 0) return null;

  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), safeTotalPages);
  const safePageSize =
    typeof pageSize === "number" && pageSize > 0 ? pageSize : undefined;
  const pages = createPageItems(
    safeCurrentPage,
    safeTotalPages,
    Math.max(0, siblingCount)
  );
  const canGoPrevious = safeCurrentPage > 1 && !disabled;
  const canGoNext = safeCurrentPage < safeTotalPages && !disabled;
  const showSummary =
    typeof totalItems === "number" &&
    typeof safePageSize === "number" &&
    totalItems > 0 &&
    safePageSize > 0;
  const startItem = showSummary ? (safeCurrentPage - 1) * safePageSize + 1 : 0;
  const endItem = showSummary
    ? Math.min(safeCurrentPage * safePageSize, totalItems)
    : 0;
  const canChangePageSize = Boolean(onPageSizeChange && safePageSize);
  const sizeOptions = safePageSize
    ? Array.from(new Set([...pageSizeOptions, safePageSize])).sort(
        (first, second) => first - second
      )
    : pageSizeOptions;

  const handlePageChange = (page: number) => {
    if (disabled || page === safeCurrentPage) return;
    onPageChange(page);
  };

  const handlePageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextPageSize = Number(event.target.value);
    if (disabled || !onPageSizeChange || nextPageSize === safePageSize) return;
    onPageSizeChange(nextPageSize);
  };

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex flex-col items-center gap-4 border-t p-4 sm:flex-row sm:justify-between",
        className
      )}
    >
      {/* TEXT SUMMARY: Đẩy xuống làm dòng phụ ở mobile (order-2), lên desktop đứng trước (sm:order-1) */}
      {showSummary ? (
        <p className="order-2 text-xs text-gray-500 sm:order-1 sm:text-sm">
          Showing <span className="font-medium text-gray-700">{startItem}-{endItem}</span> of{" "}
          <span className="font-medium text-gray-700">{totalItems}</span>
        </p>
      ) : (
        <p className="order-2 text-xs text-gray-500 sm:order-1 sm:text-sm">
          Page {safeCurrentPage} / {safeTotalPages}
        </p>
      )}

      {/* Đống nút bấm điều hướng */}
      <div className="order-1 flex items-center gap-1.5 sm:order-2 sm:gap-2">
        
        {/* DROP-DOWN SIZE: Ẩn hoàn toàn trên mobile (`hidden`), chỉ hiện từ màn hình tablet/desktop trở lên (`sm:flex`) */}
        {canChangePageSize && (
          <label className="hidden items-center gap-2 text-sm text-gray-500 sm:flex mr-1">
            <span>Size</span>
            <select
              value={safePageSize}
              onChange={handlePageSizeChange}
              disabled={disabled}
              className="h-9 rounded-md border bg-white px-2 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* Nút Previous */}
        <button
          type="button"
          aria-label="Previous page"
          disabled={!canGoPrevious}
          onClick={() => handlePageChange(safeCurrentPage - 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Danh sách các số trang */}
        {pages.map((item) =>
          typeof item === "number" ? (
            <button
              type="button"
              key={item}
              aria-current={item === safeCurrentPage ? "page" : undefined}
              disabled={disabled}
              onClick={() => handlePageChange(item)}
              className={cn(
                "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50",
                item === safeCurrentPage
                  ? "border-indigo-600 bg-indigo-600 text-white font-semibold"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              )}
            >
              {item}
            </button>
          ) : (
            <span
              key={item}
              className="inline-flex h-9 w-8 items-center justify-center text-gray-400"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          )
        )}

        {/* Nút Next */}
        <button
          type="button"
          aria-label="Next page"
          disabled={!canGoNext}
          onClick={() => handlePageChange(safeCurrentPage + 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}