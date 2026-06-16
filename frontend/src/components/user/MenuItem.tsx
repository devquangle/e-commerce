import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import genreService from "@/services/genreService";
import AuthorService from "@/services/authorService";
import { ChevronDown, Star, Zap, Tag } from "lucide-react";
import { useState } from "react";

const menuItems = [
    { id: 3, label: "Giới thiệu", path: "/about" },
    { id: 4, label: "Liên hệ", path: "/contact" },
    { id: 5, label: "Tin tức", path: "/blogs" },
];

export default function MenuItem({ className = "" }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { data: genres = [], isLoading: loadingGenres } = useQuery({
        queryKey: ["public-genres"],
        queryFn: () => genreService.fetchGenre(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const { data: authors = [], isLoading: loadingAuthors } = useQuery({
        queryKey: ["public-authors"],
        queryFn: () => AuthorService.fetchAuthor(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const activeGenres = genres.filter(g => g.status === 'ACTIVE' || !g.status);
    const activeAuthors = authors.filter(a => a.status === 'ACTIVE' || !a.status);

    return (
        <ul className={className}>
            {/* Mega Menu Dropdown */}
            <li className="group">
                <div className="flex items-center justify-between py-4">
                    <Link to="/products" className="flex items-center gap-1 hover:text-indigo-600 font-medium">
                        Danh mục 
                        <ChevronDown size={16} className="hidden lg:block group-hover:rotate-180 transition-transform duration-300 ml-0.5" />
                    </Link>
                    <button 
                        onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(!isMobileMenuOpen); }}
                        className="lg:hidden p-2 -mr-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ChevronDown size={18} className={`transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Dropdown Container */}
                <div className={`lg:absolute lg:top-full lg:left-0 lg:w-full bg-white lg:rounded-3xl lg:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] lg:border border-slate-100/50 ${isMobileMenuOpen ? 'block' : 'hidden'} lg:hidden lg:group-hover:block transition-all duration-300 z-50`}>
                    <div className="flex flex-col lg:grid lg:grid-cols-12 p-4 lg:p-8 gap-6 lg:gap-8">
                        
                        {/* Left: Dynamic Content (Genres & Authors) */}
                        <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-8">
                            
                            {/* --- GENRES SECTION --- */}
                            <div>
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">Thể loại</h3>
                                </div>
                                
                                {loadingGenres ? (
                                    <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[1,2,3,4,5,6].map(i => (
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 pr-2 custom-scrollbar max-h-[216px] overflow-y-auto">
                                        {activeGenres.map((genre) => (
                                            <Link 
                                                key={genre.id} 
                                                to={`/products?genre=${genre.id}`}
                                                className="group/item flex items-center gap-3 p-2 rounded-2xl hover:bg-indigo-50/80 transition-all border border-transparent hover:border-indigo-100"
                                            >
                                                <div className="hidden lg:flex w-11 h-11 rounded-xl bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-200/60 shadow-sm items-center justify-center">
                                                    {genre.urlImage ? (
                                                        <img src={genre.urlImage} alt={genre.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="text-slate-400 font-bold text-lg">
                                                            {genre.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-semibold text-slate-700 group-hover/item:text-indigo-700 transition-colors truncate">{genre.name}</div>
                                                    {genre.totalProduct !== undefined && (
                                                        <div className="text-xs text-slate-500 font-medium whitespace-nowrap">{genre.totalProduct} sản phẩm</div>
                                                    )}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* --- AUTHORS SECTION --- */}
                            <div>
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">Tác giả</h3>
                                </div>
                                
                                {loadingAuthors ? (
                                    <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[1,2,3].map(i => (
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 pr-2 custom-scrollbar max-h-[216px] overflow-y-auto">
                                        {activeAuthors.map((author) => (
                                            <Link 
                                                key={author.id} 
                                                to={`/products?author=${author.id}`}
                                                className="group/item flex items-center gap-3 p-2 rounded-2xl hover:bg-indigo-50/80 transition-all border border-transparent hover:border-indigo-100"
                                            >
                                                <div className="hidden lg:flex w-11 h-11 rounded-full bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-200/60 shadow-sm items-center justify-center">
                                                    {author.urlImage ? (
                                                        <img src={author.urlImage} alt={author.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="text-slate-400 font-bold text-lg">
                                                            {author.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-semibold text-slate-700 group-hover/item:text-indigo-700 transition-colors truncate">{author.name}</div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Collections & Banner */}
                        <div className="lg:col-span-4 lg:border-l lg:border-slate-100 lg:pl-8 flex flex-col h-full mt-4 lg:mt-0">
                            {/* Khám phá */}
                            <div className="mb-6">
                                <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Khám phá</h3>
                                
                                <div className="flex flex-col gap-5">
                                    <Link to="/products?sort=bestseller" className="flex items-start gap-3 group/col">
                                        <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0 group-hover/col:bg-amber-100 group-hover/col:text-amber-600 transition-colors shadow-sm">
                                            <Star size={18} className="fill-current" />
                                        </div>
                                        <div className="mt-0.5">
                                            <div className="text-sm font-bold text-slate-700 group-hover/col:text-amber-600 transition-colors">Bán chạy nhất</div>
                                            <div className="text-[11px] text-slate-500 mt-0.5">Được yêu thích nhất</div>
                                        </div>
                                    </Link>

                                    <Link to="/products?sort=newest" className="flex items-start gap-3 group/col">
                                        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 group-hover/col:bg-blue-100 group-hover/col:text-blue-600 transition-colors shadow-sm">
                                            <Zap size={18} className="fill-current" />
                                        </div>
                                        <div className="mt-0.5">
                                            <div className="text-sm font-bold text-slate-700 group-hover/col:text-blue-600 transition-colors">Sách mới</div>
                                            <div className="text-[11px] text-slate-500 mt-0.5">Cập nhật hàng ngày</div>
                                        </div>
                                    </Link>

                                    <Link to="/products?discount=true" className="flex items-start gap-3 group/col">
                                        <div className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 group-hover/col:bg-red-100 group-hover/col:text-red-600 transition-colors shadow-sm">
                                            <Tag size={18} className="fill-current" />
                                        </div>
                                        <div className="mt-0.5">
                                            <div className="text-sm font-bold text-slate-700 group-hover/col:text-red-600 transition-colors">Khuyến mãi</div>
                                            <div className="text-[11px] text-slate-500 mt-0.5">Flash sale cực sốc</div>
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            {/* Banner */}
                            <div className="flex-1 relative mt-2 min-h-[250px]">
                                <Link to="/products?discount=true" className="block w-full h-full absolute inset-0 rounded-2xl overflow-hidden group/banner shadow-sm">
                                    <img src="https://picsum.photos/400/600?random=mega" alt="Promo" className="w-full h-full object-cover transition-transform duration-700 group-hover/banner:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-5">
                                        <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-black uppercase rounded-md mb-3 tracking-widest shadow-sm">Hot Deal</span>
                                        <h4 className="text-white font-bold text-base mb-1.5 leading-snug">Sale sập sàn<br/>lên đến 50%</h4>
                                        <p className="text-slate-300 text-xs font-medium">Bắt đầu mua ngay →</p>
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
                    <Link to={item.path} className="hover:text-indigo-600 font-medium py-4 block">
                        {item.label}
                    </Link>
                </li>
            ))}
        </ul>
    );
}
