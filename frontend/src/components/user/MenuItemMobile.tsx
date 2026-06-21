import { Link } from "react-router-dom";
import { ChevronDown, BookOpen, Users, Star, Zap, Tag, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { useBookFormData } from "@/hooks/useBookFormData";

const menuItems = [
    { id: 3, label: "Giới thiệu", path: "/about" },
    { id: 4, label: "Liên hệ", path: "/contact" },
    { id: 5, label: "Tin tức", path: "/blogs" },
];

export default function MenuItemMobile() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { genresData: genres = [], authorsData: authors = [], isLoading } = useBookFormData();
    const loadingGenres = isLoading;
    const loadingAuthors = isLoading;


    return (
        <ul className="md:hidden space-y-1">
            {/* Mobile Danh mục Dropdown */}
            <li>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-full flex items-center justify-between py-3 px-4 font-bold text-slate-800 hover:bg-slate-50 rounded-xl transition-all duration-200"
                >
                    <span className="flex items-center gap-2.5">
                        <LayoutGrid size={20} className="text-indigo-600" />
                        Danh mục
                    </span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Mobile Dropdown Content */}
                <div 
                    className={`overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-[2000px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
                >
                    <div className="bg-slate-50/70 p-4 space-y-6 rounded-2xl border border-slate-100 mx-2">
                        {/* Genres */}
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
                                <BookOpen size={16} className="text-indigo-600" />
                                Thể loại
                            </h3>
                            {loadingGenres ? (
                                <div className="space-y-2">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="h-10 bg-slate-200/50 rounded-lg animate-pulse"></div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-1.5 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                                    {genres.map((genre) => (
                                        <Link
                                            key={genre.id}
                                            to={`/products?genre=${genre.id}`}
                                            className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200 group"
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0 shadow-inner">
                                                    {genre.urlImage ? (
                                                        <img src={genre.urlImage} alt="" className="w-full h-full object-cover rounded-lg" />
                                                    ) : (
                                                        <span className="text-xs font-black text-slate-400">{genre.name.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors truncate">{genre.name}</span>
                                            </div>
                                            {genre.bookCount !== undefined && (
                                                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100/50 flex-shrink-0 ml-2">
                                                    {genre.bookCount} sách
                                                </span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Authors */}
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
                                <Users size={16} className="text-indigo-600" />
                                Tác giả
                            </h3>
                            {loadingAuthors ? (
                                <div className="space-y-2">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="h-10 bg-slate-200/50 rounded-lg animate-pulse"></div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-1.5 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                                    {authors.map((author) => (
                                        <Link
                                            key={author.id}
                                            to={`/products?author=${author.id}`}
                                            className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200 group"
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden">
                                                    {author.urlImage ? (
                                                        <img src={author.urlImage} alt="" className="w-full h-full object-cover rounded-full" />
                                                    ) : (
                                                        <span className="text-xs font-black text-slate-400">{author.name.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors truncate">{author.name}</span>
                                            </div>
                                            {author.bookCount !== undefined && (
                                                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100/50 flex-shrink-0 ml-2">
                                                    {author.bookCount} sách
                                                </span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
                                <Zap size={16} className="text-indigo-600" />
                                Khám phá
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                <Link to="/products?sort=bestseller" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white hover:bg-amber-50 hover:text-amber-700 transition-all shadow-sm border border-slate-100 group">
                                    <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                        <Star size={14} className="fill-current" />
                                    </div>
                                    <span className="font-bold text-sm text-slate-700 group-hover:text-amber-700">Bán chạy nhất</span>
                                </Link>
                                <Link to="/products?sort=newest" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white hover:bg-blue-50 hover:text-blue-700 transition-all shadow-sm border border-slate-100 group">
                                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                        <Zap size={14} className="fill-current" />
                                    </div>
                                    <span className="font-bold text-sm text-slate-700 group-hover:text-blue-700">Sách mới</span>
                                </Link>
                                <Link to="/products?discount=true" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white hover:bg-red-50 hover:text-red-700 transition-all shadow-sm border border-slate-100 group">
                                    <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                        <Tag size={14} className="fill-current" />
                                    </div>
                                    <span className="font-bold text-sm text-slate-700 group-hover:text-red-700">Khuyến mãi</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </li>

            {/* Other Menu Items */}
            {menuItems.map((item) => (
                <li key={item.id}>
                    <Link to={item.path} className="flex items-center py-3 px-4 font-bold text-slate-800 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all duration-200">
                        {item.label}
                    </Link>
                </li>
            ))}
        </ul>
    );
}
