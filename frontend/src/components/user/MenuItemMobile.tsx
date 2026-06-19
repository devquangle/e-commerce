import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import AuthorService from "@/features/admin/author/services/author.service";
import { ChevronDown, BookOpen, Users, Star, Zap, Tag } from "lucide-react";
import { useState } from "react";
import genreService from "@/features/admin/genre/services/genre.service";

const menuItems = [
    { id: 3, label: "Giới thiệu", path: "/about" },
    { id: 4, label: "Liên hệ", path: "/contact" },
    { id: 5, label: "Tin tức", path: "/blogs" },
];

export default function MenuItemMobile() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { data: genres = [], isLoading: loadingGenres } = useQuery({
        queryKey: ["public-genres"],
        queryFn: () => genreService.fetchGenre(),
        staleTime: 5 * 60 * 1000,
    });

    const { data: authors = [], isLoading: loadingAuthors } = useQuery({
        queryKey: ["public-authors"],
        queryFn: () => AuthorService.fetchAuthor(),
        staleTime: 5 * 60 * 1000,
    });

    const activeGenres = genres.filter(g => g.status === 'ACTIVE' || !g.status);
    const activeAuthors = authors.filter(a => a.status === 'ACTIVE' || !a.status);

    return (
        <ul className="md:hidden">
            {/* Mobile Danh mục Dropdown */}
            <li>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-full flex items-center justify-between py-4 px-4 font-medium text-slate-900 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-lg transition-all duration-200 border-b border-slate-100"
                >
                    <span className="flex items-center gap-2">
                        <BookOpen size={20} className="text-indigo-600" />
                        Danh mục
                    </span>
                    <ChevronDown size={18} className={`text-slate-500 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Mobile Dropdown Content (No Banner) */}
                {isMobileMenuOpen && (
                    <div className="bg-gradient-to-b from-indigo-50/40 to-slate-50/40 px-0 py-3 space-y-3 rounded-lg border-t border-slate-100">
                        {/* Genres */}
                        <div className="px-4">
                            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                                <BookOpen size={16} className="text-indigo-600" />
                                Thể loại
                            </h3>
                            {loadingGenres ? (
                                <div className="space-y-2">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="h-8 bg-slate-200 rounded animate-pulse"></div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                                    {activeGenres.map((genre) => (
                                        <Link
                                            key={genre.id}
                                            to={`/products?genre=${genre.id}`}
                                            className="block px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-white hover:text-indigo-700 hover:font-semibold transition-all duration-200 font-medium"
                                        >
                                            📚 {genre.name} {genre.totalProduct && `(${genre.totalProduct})`}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Authors */}
                        <div className="px-4 border-t border-slate-200/60 pt-3">
                            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                                <Users size={16} className="text-indigo-600" />
                                Tác giả
                            </h3>
                            {loadingAuthors ? (
                                <div className="space-y-2">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="h-8 bg-slate-200 rounded animate-pulse"></div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                                    {activeAuthors.map((author) => (
                                        <Link
                                            key={author.id}
                                            to={`/products?author=${author.id}`}
                                            className="block px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-white hover:text-indigo-700 hover:font-semibold transition-all duration-200 font-medium"
                                        >
                                            ✍️ {author.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Links */}
                        <div className="px-4 border-t border-slate-200/60 pt-3">
                            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                                <Zap size={16} className="text-indigo-600" />
                                Khác
                            </h3>
                            <div className="space-y-1">
                                <Link to="/products?sort=bestseller" className="block px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-white hover:text-amber-700 hover:font-semibold transition-all duration-200 font-medium">⭐ Bán chạy nhất</Link>
                                <Link to="/products?sort=newest" className="block px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-white hover:text-blue-700 hover:font-semibold transition-all duration-200 font-medium">✨ Sách mới</Link>
                                <Link to="/products?discount=true" className="block px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-white hover:text-red-700 hover:font-semibold transition-all duration-200 font-medium">🔥 Khuyến mãi</Link>
                            </div>
                        </div>
                    </div>
                )}
            </li>

            {/* Other Menu Items */}
            {menuItems.map((item) => (
                <li key={item.id}>
                    <Link to={item.path} className="block py-4 px-4 font-medium text-slate-900 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 rounded-lg transition-all duration-200">
                        {item.label}
                    </Link>
                </li>
            ))}
        </ul>
    );
}
