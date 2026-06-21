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
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-24 h-24 mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Không tìm thấy sản phẩm nào</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-6">
                  Rất tiếc, chúng tôi không thể tìm thấy sản phẩm phù hợp với tiêu chí tìm kiếm của bạn.
                </p>
                <button 
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm shadow-indigo-200"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* PAGINATION */}
            {products.length > 0 && (
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
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}
