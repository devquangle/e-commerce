import { useState, useEffect } from "react";
import Container from '@/components/common/Container'
import ProductCard from '@/components/user/ProductCard'
import type { ProductCard as ProductCardType } from '@/types/product.card.type';
import FilterSidebar from "@/features/user/product-search/components/FilterSidebar";
import ProductToolbar from "@/features/user/product-search/components/ProductToolbar";
import { useProductFilter } from "@/features/user/product-search/hooks/useProductFilter";
import Pagination from "@/components/common/Pagination";

const mockProducts = [
  {
    id: 1,
    slug: 'sach-marketing-can-ban',
    name: 'Sách Marketing Căn Bản - Philip Kotler (Tái bản 2024)',
    price: 185000,
    urlImage: 'https://picsum.photos/400/500?random=1',
    soldCount: 1520,
    rating: 4.8,
    reviewCount: 320,
    badge: 'BEST_SELLER',
    createdAt: '2024-06-01T10:00:00Z',
    promotion: { value: 10, type: 'PRODUCT_DISCOUNT' },
  },
  {
    id: 2,
    slug: 'dac-nhan-tam',
    name: 'Đắc Nhân Tâm - Bí Quyết Thành Công Mọi Thời Đại (Bìa Cứng Cao Cấp)',
    price: 95000,
    urlImage: 'https://picsum.photos/400/500?random=2',
    soldCount: 8400,
    rating: 5.0,
    reviewCount: 1250,
    badge: 'NEW',
    createdAt: '2024-06-05T09:30:00Z',
    promotion: { value: 15, type: 'FLASH_SALE' },
  },
  {
    id: 3,
    slug: 'sapiens',
    name: 'Sapiens - Lược Sử Loài Người',
    price: 210000,
    urlImage: 'https://picsum.photos/400/500?random=3',
    soldCount: 3200,
    rating: 4.9,
    reviewCount: 890,
    badge: null,
    createdAt: '2024-05-20T08:00:00Z',
    promotion: { value: 0, type: null },
  },
  {
    id: 4,
    slug: 'atomic-habits',
    name: 'Atomic Habits - Thay Đổi Tí Hon Hiệu Quả Bất Ngờ',
    price: 135000,
    urlImage: 'https://picsum.photos/400/500?random=4',
    soldCount: 5600,
    rating: 4.8,
    reviewCount: 1100,
    badge: 'FLASH_SALE',
    createdAt: '2024-06-10T11:20:00Z',
    promotion: { value: 25, type: 'FLASH_SALE' },
  },
  {
    id: 5,
    slug: 'nha-lanh-dao-khong-chuc-danh',
    name: 'Nhà Lãnh Đạo Không Chức Danh',
    price: 85000,
    urlImage: 'https://picsum.photos/400/500?random=5',
    soldCount: 2100,
    rating: 4.7,
    reviewCount: 450,
    badge: null,
    createdAt: '2024-04-15T14:45:00Z',
    promotion: { value: 20, type: 'SEASONAL' },
  },
  {
    id: 6,
    slug: 'tam-ly-hoc-toi-pham',
    name: 'Tâm Lý Học Tội Phạm - Phát Hoạ Chân Dung Kẻ Phạm Tội',
    price: 155000,
    urlImage: 'https://picsum.photos/400/500?random=6',
    soldCount: 1250,
    rating: 4.6,
    reviewCount: 210,
    badge: 'NEW',
    createdAt: '2024-05-01T16:15:00Z',
    promotion: { value: 0, type: null },
  },
] as ProductCardType[];

export default function Products() {
  const [openFilter, setOpenFilter] = useState(false);
  
  const {
    filters,
    updateFilter,
    handlePageChange,
    handlePageSizeChange,
    resetFilters,
    data,
    isLoading,
    error,
  } = useProductFilter();

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

  // Use API data if available (even if empty array), otherwise fallback to mock data for demonstration
  const products = data?.content !== undefined ? data.content : mockProducts;
  const totalItems = data?.totalElements ?? products.length;
  const pageSize = filters.size || 12;
  const totalPages = data?.totalPages ?? Math.max(1, Math.ceil(totalItems / pageSize));

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
            ) : error && !data?.content ? (
              <div className="text-center text-red-500 my-8 py-8 border border-red-100 bg-red-50 rounded-2xl">
                {error}. Hiển thị dữ liệu mẫu.
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