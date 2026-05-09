import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

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
  disabled = false,
}: PaginationProps) {
   if (totalPages === 0) return null;


  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), safeTotalPages);
  const pages = createPageItems(
    safeCurrentPage,
    safeTotalPages,
    Math.max(0, siblingCount)
  );
  const canGoPrevious = safeCurrentPage > 1 && !disabled;
  const canGoNext = safeCurrentPage < safeTotalPages && !disabled;
  const showSummary =
    typeof totalItems === "number" &&
    typeof pageSize === "number" &&
    totalItems > 0 &&
    pageSize > 0;
  const startItem = showSummary ? (safeCurrentPage - 1) * pageSize + 1 : 0;
  const endItem = showSummary
    ? Math.min(safeCurrentPage * pageSize, totalItems)
    : 0;

  const handlePageChange = (page: number) => {
    if (disabled || page === safeCurrentPage) return;
    onPageChange(page);
  };

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      {showSummary ? (
        <p className="text-sm text-gray-500">
          Showing {startItem}-{endItem} of {totalItems}
        </p>
      ) : (
        <p className="text-sm text-gray-500">
          Page {safeCurrentPage} / {safeTotalPages}
        </p>
      )}

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          disabled={!canGoPrevious}
          onClick={() => handlePageChange(safeCurrentPage - 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((item) =>
          typeof item === "number" ? (
            <button
              type="button"
              key={item}
              aria-current={item === safeCurrentPage ? "page" : undefined}
              disabled={disabled}
              onClick={() => handlePageChange(item)}
              className={cn(
                "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
                item === safeCurrentPage
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              {item}
            </button>
          ) : (
            <span
              key={item}
              className="inline-flex h-9 w-9 items-center justify-center text-gray-400"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          )
        )}

        <button
          type="button"
          aria-label="Next page"
          disabled={!canGoNext}
          onClick={() => handlePageChange(safeCurrentPage + 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
