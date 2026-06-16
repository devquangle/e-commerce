import { useState } from "react";
import Container from '@/components/common/Container'
import FilterContent from "@/components/user/FilterContent";
import ProductCard from '@/components/user/ProductCard'
import type { Product } from '@/types/product.type';
import { Filter, X, ChevronDown } from "lucide-react";

const products: Product[] = [
  {
    id: 1,
    title: 'Sách Marketing Căn Bản - Philip Kotler (Tái bản 2024)',
    price: 185000,
    originalPrice: 250000,
    author: ['Philip Kotler'],
    coverUrl: 'https://picsum.photos/400/500?random=1',
    publishedAt: '2024-01-01',
    soldCount: 1520,
    rating: 4.8,
    reviewCount: 320,
    isFeatured: true
  },
  {
    id: 2,
    title: 'Đắc Nhân Tâm - Bí Quyết Thành Công Mọi Thời Đại (Bìa Cứng Cao Cấp)',
    price: 95000,
    originalPrice: 120000,
    author: ['Dale Carnegie'],
    coverUrl: 'https://picsum.photos/400/500?random=2',
    publishedAt: '2023-05-15',
    soldCount: 8400,
    rating: 5.0,
    reviewCount: 1250,
    isFeatured: true
  }, 
  {
    id: 3,
    title: 'Sapiens - Lược Sử Loài Người',
    price: 210000,
    originalPrice: 265000,
    author: ['Yuval Noah Harari'],
    coverUrl: 'https://picsum.photos/400/500?random=3',
    publishedAt: '2022-10-10',
    soldCount: 3200,
    rating: 4.9,
    reviewCount: 890,
    isFeatured: false
  }, 
  {
    id: 4,
    title: 'Atomic Habits - Thay Đổi Tí Hon Hiệu Quả Bất Ngờ',
    price: 135000,
    originalPrice: 160000,
    author: ['James Clear'],
    coverUrl: 'https://picsum.photos/400/500?random=4',
    publishedAt: '2023-01-20',
    soldCount: 5600,
    rating: 4.8,
    reviewCount: 1100,
    isFeatured: true
  },
  {
    id: 5,
    title: 'Nhà Lãnh Đạo Không Chức Danh',
    price: 85000,
    originalPrice: 110000,
    author: ['Robin Sharma'],
    coverUrl: 'https://picsum.photos/400/500?random=5',
    publishedAt: '2021-08-05',
    soldCount: 2100,
    rating: 4.7,
    reviewCount: 450,
    isFeatured: false
  },
  {
    id: 6,
    title: 'Tâm Lý Học Tội Phạm - Phát Hoạ Chân Dung Kẻ Phạm Tội',
    price: 155000,
    originalPrice: 195000,
    author: ['Diệp Hồng Vĩ'],
    coverUrl: 'https://picsum.photos/400/500?random=6',
    publishedAt: '2022-11-11',
    soldCount: 1250,
    rating: 4.6,
    reviewCount: 210,
    isFeatured: true
  }
];

export default function Products() {
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <div className="bg-slate-50/50 min-h-screen pb-12">
      {/* HEADER SECTION WITH BREADCRUMBS/TITLE */}
      <div className="bg-white border-b border-slate-200 py-6 mb-8">
        <Container className="max-w-7xl px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-sm text-slate-500 mb-2 flex items-center gap-2">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Trang chủ</span>
                <span>/</span>
                <span className="text-slate-800 font-medium">Sản phẩm</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Tất Cả Sản Phẩm
              </h1>
            </div>

            {/* HEADER MOBILE & SORT DESKTOP */}
            <div className="flex justify-between items-center gap-4">
              <button
                onClick={() => setOpenFilter(true)}
                className="lg:hidden flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <Filter size={18} />
                <span>Bộ lọc</span>
              </button>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500 hidden md:block">Sắp xếp theo:</span>
                <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors text-sm">
                  <span>Mới nhất</span>
                  <ChevronDown size={16} className="text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="max-w-7xl px-4 md:px-8">
        {/* MAIN LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ASIDE DESKTOP */}
          <aside className="hidden lg:block lg:w-[280px] flex-shrink-0">
            <div className="sticky top-24 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Filter size={20} className="text-blue-600"/>
                Bộ Lọc Tìm Kiếm
              </h2>
              <FilterContent />
            </div>
          </aside>

          {/* PRODUCTS LIST */}
          <main className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 items-stretch">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* LOAD MORE BUTTON */}
            <div className="mt-12 flex justify-center">
              <button className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl shadow-sm hover:bg-slate-50 hover:text-blue-600 transition-all active:scale-95">
                Xem Thêm Sản Phẩm
              </button>
            </div>
          </main>
        </div>

        {/* ================= MODAL FILTER MOBILE ================= */}
        {openFilter && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
            onClick={() => setOpenFilter(false)}
          >
            <div
              className="bg-white w-full sm:w-[90%] sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Filter size={20} className="text-blue-600"/>
                  Bộ lọc
                </h3>
                <button
                  onClick={() => setOpenFilter(false)}
                  className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <FilterContent />
              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 p-4 sm:p-6 bg-slate-50 rounded-b-2xl">
                <div className="flex gap-3">
                  <button
                    onClick={() => setOpenFilter(false)}
                    className="flex-1 bg-white border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Thiết lập lại
                  </button>
                  <button
                    onClick={() => setOpenFilter(false)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md shadow-blue-600/20 transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
