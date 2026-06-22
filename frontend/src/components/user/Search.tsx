import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon, BookOpen, TrendingUp, Camera, X, Upload, Image as ImageIcon } from "lucide-react";
import { formatMoney } from "@/utils/number.utils";
import { baseProducts } from "@/modules/user/home/data/mockData";

export default function Search() {
  const [keyword, setKeyword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [imageResults, setImageResults] = useState<typeof baseProducts>([]);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        if (!showImageSearch) setPreviewImage(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showImageSearch]);

  // Lọc sản phẩm gợi ý dựa trên từ khóa (tối đa 5 kết quả)
  const filteredProducts = keyword.trim().length > 0
    ? baseProducts
        .filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()))
        .slice(0, 5)
    : [];

  // Giả lập tìm kiếm bằng hình ảnh
  const handleImageSearch = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
      setIsSearching(true);
      setImageResults([]);

      // Giả lập thời gian xử lý AI
      setTimeout(() => {
        // Trả về kết quả ngẫu nhiên (mock) 
        const shuffled = [...baseProducts].sort(() => 0.5 - Math.random());
        setImageResults(shuffled.slice(0, 4));
        setIsSearching(false);
      }, 1500);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSearch(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageSearch(file);
  }, [handleImageSearch]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const closeImageSearch = () => {
    setShowImageSearch(false);
    setPreviewImage(null);
    setImageResults([]);
    setIsSearching(false);
  };

  return (
    <div className="flex items-center gap-2 flex-1 justify-end relative" ref={containerRef}>
      <div className="hidden lg:flex relative w-full max-w-md">
        <input
          type="text"
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); setShowImageSearch(false); }}
          onFocus={() => { setIsFocused(true); setShowImageSearch(false); }}
          placeholder="Tìm kiếm sách..."
          className="
            w-full
            rounded-full border border-slate-300
            pl-5 pr-20 py-2.5 text-sm
            outline-none
            transition-all
            focus:border-indigo-500
            focus:ring-2 focus:ring-indigo-100
          "
        />
        <div className="absolute right-1 top-1 flex items-center gap-1">
          {/* Nút tìm bằng ảnh */}
          <button
            onClick={() => { setShowImageSearch(true); setIsFocused(true); setKeyword(""); }}
            className="h-8 w-8 shrink-0 rounded-full text-slate-400 flex items-center justify-center cursor-pointer hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            aria-label="Tìm bằng hình ảnh"
            title="Tìm kiếm bằng hình ảnh"
          >
            <Camera size={16} />
          </button>
          {/* Nút tìm kiếm text */}
          <button
            className="h-8 w-8 shrink-0 rounded-full bg-indigo-600 text-white flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors"
            aria-label="Tìm kiếm"
          >
            <SearchIcon size={16} />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* ===== DROPDOWN: Tìm bằng text ===== */}
        {isFocused && !showImageSearch && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
            {keyword.trim().length === 0 ? (
              <div className="p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Từ khóa phổ biến</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setKeyword('Đắc Nhân Tâm')} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-700 cursor-pointer transition-colors">
                    <TrendingUp size={14} className="text-rose-500" /> Đắc Nhân Tâm
                  </button>
                  <button onClick={() => setKeyword('Harry Potter')} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-700 cursor-pointer transition-colors">
                    <BookOpen size={14} className="text-indigo-500" /> Harry Potter
                  </button>
                  <button onClick={() => setKeyword('Clean Code')} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-700 cursor-pointer transition-colors">
                    Clean Code
                  </button>
                  <button onClick={() => setKeyword('Sapiens')} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-700 cursor-pointer transition-colors">
                    Sapiens
                  </button>
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div>
                <p className="text-xs font-semibold text-slate-500 px-4 py-2 bg-slate-50">Kết quả cho "{keyword}"</p>
                <ul className="max-h-[300px] overflow-y-auto">
                  {filteredProducts.map(item => (
                    <li key={item.id}>
                      <Link
                        to={`/product/${item.slug || item.id}`}
                        className="flex items-center gap-3 p-3 hover:bg-indigo-50/50 transition-colors border-b border-slate-50 last:border-0"
                        onClick={() => setIsFocused(false)}
                      >
                        <img src={item.urlImage} alt={item.name} className="w-10 h-14 object-cover rounded-md shadow-sm bg-slate-100" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 line-clamp-1">{item.name}</p>
                          <p className="text-sm font-bold text-rose-600 mt-0.5">{formatMoney(item.price)}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-slate-500">
                Không tìm thấy sản phẩm nào cho "{keyword}"
              </div>
            )}
          </div>
        )}

        {/* ===== DROPDOWN: Tìm bằng ảnh ===== */}
        {isFocused && showImageSearch && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 w-[420px]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Camera size={18} className="text-indigo-600" />
                <span className="text-sm font-semibold text-slate-800">Tìm kiếm bằng hình ảnh</span>
              </div>
              <button onClick={closeImageSearch} className="p-1 rounded-full hover:bg-slate-200 transition-colors cursor-pointer">
                <X size={16} className="text-slate-500" />
              </button>
            </div>

            {/* Upload area */}
            {!previewImage && (
              <div
                className={`m-4 border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                  ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Upload size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Tải ảnh lên hoặc kéo thả vào đây</p>
                    <p className="text-xs text-slate-400 mt-1">Hỗ trợ JPG, PNG, WEBP</p>
                  </div>
                </div>
              </div>
            )}

            {/* Preview + results */}
            {previewImage && (
              <div className="p-4">
                <div className="flex gap-4">
                  {/* Ảnh đã upload */}
                  <div className="relative shrink-0">
                    <img src={previewImage} alt="Ảnh tìm kiếm" className="w-24 h-32 object-cover rounded-lg shadow-sm border border-slate-100" />
                    <button
                      onClick={() => { setPreviewImage(null); setImageResults([]); }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-sm hover:bg-rose-600 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>

                  {/* Kết quả */}
                  <div className="flex-1 min-w-0">
                    {isSearching ? (
                      <div className="flex flex-col items-center justify-center py-6 gap-3">
                        <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                        <p className="text-sm text-slate-500">Đang nhận diện sách...</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <ImageIcon size={12} />
                          Sách tương tự
                        </p>
                        <ul className="space-y-2 max-h-[200px] overflow-y-auto">
                          {imageResults.map(item => (
                            <li key={item.id}>
                              <Link
                                to={`/product/${item.slug || item.id}`}
                                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-indigo-50/60 transition-colors"
                                onClick={closeImageSearch}
                              >
                                <img src={item.urlImage} alt={item.name} className="w-8 h-10 object-cover rounded bg-slate-100" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-slate-800 line-clamp-1">{item.name}</p>
                                  <p className="text-xs font-bold text-rose-600">{formatMoney(item.price)}</p>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Nút tải ảnh khác */}
                {!isSearching && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 w-full py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Thử ảnh khác
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <button
        className="flex lg:hidden h-9 w-9 shrink-0 rounded-full border items-center justify-center cursor-pointer hover:bg-slate-100"
        aria-label="Tìm kiếm"
      >
        <SearchIcon size={18} className="text-slate-700" />
      </button>
    </div>
  );
}