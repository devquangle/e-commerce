import { useState, useEffect } from "react";
import Container from "@/components/common/Container";
import ProductCard from "@/components/user/ProductCard";
import FilterSidebar from "@/features/user/product-search/components/FilterSidebar";
import ProductToolbar from "@/features/user/product-search/components/ProductToolbar";
import { useProductFilter } from "@/features/user/product-search/hooks/useProductFilter";
import { useProductSearch } from "@/features/user/product-search/hooks/useProductSearch";
import Pagination from "@/components/common/Pagination";

export default function Products() {
  const [openFilter, setOpenFilter] = useState(false);

  const {
    filters,
    updateFilter,
    handlePageChange,
    handlePageSizeChange,
    resetFilters,
  } = useProductFilter({ size: 12 });

  const { data, isLoading, error } = useProductSearch(filters);

  const products = data?.items || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = data?.totalPages || 0;

  useEffect(() => {
    if (openFilter) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [openFilter]);

  return (
    <div className="bg-slate-50/50 min-h-screen pt-8 pb-16">
      <Container className="max-w-7xl px-4 md:px-8">
        {/* MAIN LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <FilterSidebar
            openFilter={openFilter}
            setOpenFilter={setOpenFilter}
            filters={filters}
            updateFilter={updateFilter}
            resetFilters={resetFilters}
          />

          {/* PRODUCTS LIST */}
          <main className="flex-1 w-full">
            <ProductToolbar
              totalItems={totalItems}
              setOpenFilter={setOpenFilter}
              filters={filters}
              updateFilter={updateFilter}
            />

            {/* PRODUCT GRID */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error && !data?.items ? (
              <div className="text-center text-red-500 my-8 py-8 border border-red-100 bg-red-50 rounded-2xl">
                {error instanceof Error ? error.message : String(error)}. Hiển thị dữ liệu mẫu.
              </div>
            ) : null}

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* PAGINATION */}
            <div className="mt-12">
              <Pagination
                currentPage={filters.page || 1}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={totalItems}
                pageSize={filters.size || 12}
                onPageSizeChange={handlePageSizeChange}
                className="border-none justify-center"
              />
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
}
