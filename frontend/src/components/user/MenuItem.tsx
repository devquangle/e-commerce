import { Link } from "react-router-dom";

import {
  ChevronDown,
  Star,
  Zap,
  Tag,
  BookOpen,
  Users,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import { useState } from "react";
import { useBookFormData } from "@/hooks/useBookFormData";

const menuItems = [
  { id: 3, label: "Giới thiệu", path: "/about" },
  { id: 4, label: "Liên hệ", path: "/contact" },
  { id: 5, label: "Tin tức", path: "/blogs" },
];

export default function MenuItem({ className = "" }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Thêm state để kiểm soát trạng thái hover trên Desktop
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  const { genresData: genres, authorsData: authors, isLoading } = useBookFormData();
  const loadingGenres = isLoading;
  const loadingAuthors = isLoading;

  const activeGenres = genres.filter((g) => g.status === "ACTIVE" || !g.status);
  const activeAuthors = authors.filter(
    (a) => a.status === "ACTIVE" || !a.status,
  );



  return (
    <ul className={className}>
      <li
        className="group cursor-pointer"
        onMouseEnter={() => setIsDesktopMenuOpen(true)}
        onMouseLeave={() => setIsDesktopMenuOpen(false)}
      >
        <div className="flex items-center justify-between py-4">
          <div
            className="flex items-center gap-1.5 hover:text-indigo-600 font-medium"
          >
            <LayoutGrid size={18} />
            Danh mục
            <ChevronDown
              size={16}
              className="hidden lg:block group-hover:rotate-180 transition-transform duration-300 ml-0.5"
            />
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="lg:hidden p-2 -mr-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronDown
              size={18}
              className={`transition-transform duration-300 ${isMobileMenuOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Dropdown Container */}
        {/* Thay đổi: Sử dụng cả class `group-hover:block` kết hợp trạng thái `isMobileMenuOpen` */}
        <div
          className={`lg:absolute lg:top-full lg:left-0 lg:w-full bg-white lg:rounded-3xl lg:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] lg:border border-slate-100/50 ${isMobileMenuOpen ? "block" : "hidden"} lg:hidden lg:group-hover:block transition-all duration-300 z-50`}
        >
          <div className="flex flex-col lg:grid lg:grid-cols-12 p-4 lg:p-8 gap-6 lg:gap-8">
            {/* === CỘT 1: THỂ LOẠI === */}
            <div className="lg:col-span-4 flex flex-col">
              <div className="flex items-center justify-between border-b-2 border-gradient-to-r from-indigo-200 to-transparent pb-3 mb-5">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen size={18} className="text-indigo-600" />
                  Thể loại
                </h3>
              </div>

              {loadingGenres ? (
                <div className="animate-pulse flex flex-col gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                        <div className="h-2 bg-slate-100 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-y-2 pr-2 pb-2 custom-scrollbar max-h-[340px] overflow-y-auto">
                  {activeGenres.map((genre) => (
                    <Link
                      key={genre.id}
                      to={`/products?genre=${genre.id}`}
                      // Khi click vào item thì đóng cả menu để khôi phục scroll body
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsDesktopMenuOpen(false);
                      }}
                      className="group/item flex items-center gap-3 p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 border border-transparent hover:border-indigo-200 shadow-sm hover:shadow-md"
                    >
                      <div className="hidden lg:flex w-10 h-10 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden flex-shrink-0 border border-slate-200/70 shadow-sm items-center justify-center group-hover/item:shadow-md transition-all">
                        {genre.urlImage ? (
                          <img
                            src={genre.urlImage}
                            alt={genre.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-slate-500 font-bold text-sm">
                            {genre.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-800 group-hover/item:text-indigo-700 transition-colors truncate">
                          {genre.name}
                        </div>
                      </div>
                      {genre.bookCount !== undefined && (
                        <div className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100/50 whitespace-nowrap flex-shrink-0">
                          {genre.bookCount} sách
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* === CỘT 2: TÁC GIẢ === */}
            <div className="lg:col-span-4 flex flex-col lg:border-l lg:border-slate-100 lg:pl-8">
              <div className="flex items-center justify-between border-b-2 border-gradient-to-r from-indigo-200 to-transparent pb-3 mb-5">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Users size={18} className="text-indigo-600" />
                  Tác giả
                </h3>
              </div>

              {loadingAuthors ? (
                <div className="animate-pulse flex flex-col gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-10 h-10 bg-slate-100 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                        <div className="h-2 bg-slate-100 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-y-2 pr-2 pb-2 custom-scrollbar max-h-[340px] overflow-y-auto">
                  {activeAuthors.map((author) => (
                    <Link
                      key={author.id}
                      to={`/products?author=${author.id}`}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsDesktopMenuOpen(false);
                      }}
                      className="group/item flex items-center gap-3 p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 border border-transparent hover:border-indigo-200 shadow-sm hover:shadow-md"
                    >
                      <div className="hidden lg:flex w-10 h-10 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden flex-shrink-0 border border-slate-200/70 shadow-sm items-center justify-center group-hover/item:shadow-md transition-all">
                        {author.urlImage ? (
                          <img
                            src={author.urlImage}
                            alt={author.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-slate-500 font-bold text-sm">
                            {author.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-800 group-hover/item:text-indigo-700 transition-colors truncate">
                          {author.name}
                        </div>
                      </div>
                      {author.bookCount !== undefined && (
                        <div className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100/50 whitespace-nowrap flex-shrink-0">
                          {author.bookCount} sách
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* === CỘT 3: KHÁM PHÁ & BANNER === */}
            <div className="hidden lg:col-span-4 lg:flex lg:border-l lg:border-slate-100 lg:pl-8 flex-col h-full mt-4 lg:mt-0">
              <div className="mb-6">
                <h3 className="font-bold text-slate-900 mb-5 border-b-2 border-gradient-to-r from-indigo-200 to-transparent pb-3 flex items-center gap-2">
                  <Sparkles size={18} className="text-indigo-600" />
                  Khám phá
                </h3>

                <div className="flex flex-col gap-3">
                  <Link
                    to="/products?sort=bestseller"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsDesktopMenuOpen(false);
                    }}
                    className="flex items-start gap-3 group/col p-2.5 rounded-xl hover:bg-amber-50/60 transition-all duration-200"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 shadow-sm group-hover/col:shadow-md transition-all">
                      <Star size={18} className="fill-current" />
                    </div>
                    <div className="mt-0.5 flex-1">
                      <div className="text-sm font-bold text-slate-800 group-hover/col:text-amber-700 transition-colors">
                        Bán chạy nhất
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        ⭐ Được yêu thích nhất
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/products?sort=newest"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsDesktopMenuOpen(false);
                    }}
                    className="flex items-start gap-3 group/col p-2.5 rounded-xl hover:bg-blue-50/60 transition-all duration-200"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm group-hover/col:shadow-md transition-all">
                      <Zap size={18} className="fill-current" />
                    </div>
                    <div className="mt-0.5 flex-1">
                      <div className="text-sm font-bold text-slate-800 group-hover/col:text-blue-700 transition-colors">
                        Sách mới
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        ✨ Cập nhật hàng ngày
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/products?discount=true"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsDesktopMenuOpen(false);
                    }}
                    className="flex items-start gap-3 group/col p-2.5 rounded-xl hover:bg-red-50/60 transition-all duration-200"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-100 to-red-50 text-red-600 flex items-center justify-center flex-shrink-0 shadow-sm group-hover/col:shadow-md transition-all">
                      <Tag size={18} className="fill-current" />
                    </div>
                    <div className="mt-0.5 flex-1">
                      <div className="text-sm font-bold text-slate-800 group-hover/col:text-red-700 transition-colors">
                        Khuyến mãi
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        🔥 Flash sale cực sốc
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="flex-1 relative min-h-[140px]">
                <Link
                  to="/products?discount=true"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsDesktopMenuOpen(false);
                  }}
                  className="block w-full h-full absolute inset-0 rounded-2xl overflow-hidden group/banner shadow-lg hover:shadow-xl transition-shadow"
                >
                  <img
                    src="https://picsum.photos/400/600?random=mega"
                    alt="Promo"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/banner:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black uppercase rounded-md mb-2 tracking-widest shadow-lg">
                      🔥 Hot Deal
                    </span>
                    <h4 className="text-white font-bold text-base mb-1 leading-snug">
                      Giảm giá sốc lên đến 50%
                    </h4>
                    <p className="text-slate-200 text-xs font-medium">
                      Bắt đầu mua ngay →
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </li>

      {/* Other Menu Items */}
      {menuItems.map((item) => (
        <li key={item.id}>
          <Link
            to={item.path}
            className="hover:text-indigo-600 font-medium py-4 block"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
