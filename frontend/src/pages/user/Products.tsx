import { useState, useEffect } from "react";
import Container from '@/components/common/Container'
import FilterContent from "@/components/user/FilterContent";
import ProductCard from '@/components/user/ProductCard'
import type { ProductCard as ProductCardType } from '@/types/product.card.type';
import { Filter, X, ChevronDown, Search } from "lucide-react";

const products: ProductCardType[] = [
  { id: 1, slug: 'sach-marketing-can-ban', name: 'Sách Marketing Căn Bản - Philip Kotler (Tái bản 2024)', price: 185000, promosionValue: 26, urlImage: 'https://picsum.photos/400/500?random=1', soldCount: 1520, rating: 4.8, reviewCount: 320, bage: 'Bán chạy' },
  { id: 2, slug: 'dac-nhan-tam', name: 'Đắc Nhân Tâm - Bí Quyết Thành Công Mọi Thời Đại (Bìa Cứng Cao Cấp)', price: 95000, promosionValue: 21, urlImage: 'https://picsum.photos/400/500?random=2', soldCount: 8400, rating: 5.0, reviewCount: 1250, bage: 'Mới' }, 
  { id: 3, slug: 'sapiens', name: 'Sapiens - Lược Sử Loài Người', price: 210000, promosionValue: 21, urlImage: 'https://picsum.photos/400/500?random=3', soldCount: 3200, rating: 4.9, reviewCount: 890, bage: '' }, 
  { id: 4, slug: 'atomic-habits', name: 'Atomic Habits - Thay Đổi Tí Hon Hiệu Quả Bất Ngờ', price: 135000, promosionValue: 16, urlImage: 'https://picsum.photos/400/500?random=4', soldCount: 5600, rating: 4.8, reviewCount: 1100, bage: 'Hot' },
  { id: 5, slug: 'nha-lanh-dao-khong-chuc-danh', name: 'Nhà Lãnh Đạo Không Chức Danh', price: 85000, promosionValue: 23, urlImage: 'https://picsum.photos/400/500?random=5', soldCount: 2100, rating: 4.7, reviewCount: 450, bage: '' },
  { id: 6, slug: 'tam-ly-hoc-toi-pham', name: 'Tâm Lý Học Tội Phạm - Phát Hoạ Chân Dung Kẻ Phạm Tội', price: 155000, promosionValue: 21, urlImage: 'https://picsum.photos/400/500?random=6', soldCount: 1250, rating: 4.6, reviewCount: 210, bage: 'Nổi bật' }
];

export default function Products() {
  const [openFilter, setOpenFilter] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<number>(500000);

  const sortOptions = [
    { value: "newest", label: "Sách mới nhất" },
    { value: "bestseller", label: "Bán chạy nhất" },
    { value: "price-asc", label: "Giá: Thấp đến Cao" },
    { value: "price-desc", label: "Giá: Cao đến Thấp" },
  ];

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

  const handleResetFilter = () => {
    setPriceRange(500000);
    setSortBy("newest");
    setSearchQuery("");
  };

  return (
    <div className="bg-slate-50/50 min-h-screen pt-8 pb-16">
      <Container className="max-w-7xl px-4 md:px-8">
        
        {/* MAIN LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* ASIDE DESKTOP */}
          <aside className="hidden lg:block lg:w-[280px] flex-shrink-0">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-5 pb-4 border-b border-slate-100 flex items-center gap-2">
                <Filter size={18} className="text-indigo-600"/>
                Bộ Lọc Tìm Kiếm
              </h2>
              <FilterContent priceRange={priceRange} setPriceRange={setPriceRange} />
            </div>
          </aside>

          {/* PRODUCTS LIST */}
          <main className="flex-1 w-full">
            
            {/* INPUT TEXT TÌM KIẾM - MOBILE */}
            <div className="block lg:hidden mb-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm sách bạn quan tâm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                Tìm thấy <span className="font-bold text-slate-800">{products.length}</span> sản phẩm
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
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Sắp xếp:</span>
                  <div className="relative w-[180px]">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2.5 rounded-xl outline-none appearance-none cursor-pointer transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value} className="font-medium text-slate-800 bg-white">
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

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* LOAD MORE BUTTON */}
            <div className="mt-12 flex justify-center">
              <button className="px-8 py-3 bg-white border border-slate-200 text-sm font-bold text-slate-700 rounded-xl shadow-sm hover:border-indigo-600 hover:text-indigo-600 hover:shadow-md transition-all active:scale-95">
                Xem Thêm Sản Phẩm
              </button>
            </div>
          </main>
        </div>

        {/* ================= MODAL FILTER MOBILE ================= */}
        {openFilter && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center lg:hidden transition-all duration-300">
            {/* ĐÃ TÁCH BIỆT BACKDROP: Click ra ngoài lớp nền này mới đóng modal, không ảnh hưởng đến vuốt kéo bên trong */}
            <div 
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setOpenFilter(false)}
            />
            
            {/* Thân Modal hoàn toàn độc lập */}
            <div className="relative bg-white w-full sm:w-[90%] sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300 z-10">
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Filter size={18} className="text-indigo-600"/>
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
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Sắp xếp theo</label>
                  <div className="grid grid-cols-2 gap-2">
                    {sortOptions.map((option) => {
                      const isSelected = sortBy === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setSortBy(option.value)}
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
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Bộ lọc nâng cao</label>
                  <FilterContent priceRange={priceRange} setPriceRange={setPriceRange} />
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 p-4 sm:p-6 bg-slate-50/80 rounded-b-2xl">
                <div className="flex gap-3">
                  <button
                    onClick={handleResetFilter}
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
      </Container>
    </div>
  );
}