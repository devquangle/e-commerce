import { useState, useRef, useEffect, useMemo } from "react";
import ProductDescriptionEditor from "../../components/admin/ProductDescriptionEditor";
import SelectedMutil from "@/components/common/SelectedMutil";
import { 
  BookOpen, 
  Save, 
  Plus, 
  Trash2, 
  DollarSign, 
  FileText, 
  Image as ImageIcon,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Percent,
  Loader2,
  Building2,
  Globe,
  Calendar,
  Hash,
  Check,
  ChevronDown,
  BookMarked,
  X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useGenre } from "@/hooks/useGenre";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtil";
import type { GenreResponse } from "@/types/genre";

type UpdateBookForm = {
  title: string;
  slug: string;
  sku: string;
  author: string[];
  publisher: string;
  genre: string[];
  language: string;
  publishYear: string;
  pages: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  status: "DRAFT" | "ACTIVE" | "OUT_OF_STOCK";
  shortDescription: string;
  description: string;
  coverImages: string[];
};

const POPULAR_PUBLISHERS = [
  "NXB Trẻ",
  "NXB Kim Đồng",
  "Nhã Nam",
  "NXB Hội Nhà Văn",
  "NXB Phụ Nữ Việt Nam",
  "NXB Tổng hợp TP.HCM",
  "NXB Chính trị Quốc gia Sự thật",
  "NXB Giáo Dục Việt Nam",
  "NXB Lao Động",
  "NXB Mỹ Thuật"
];

const POPULAR_AUTHORS = [
  "Paulo Coelho",
  "Dale Carnegie",
  "Nguyễn Nhật Ánh",
  "Haruki Murakami",
  "Tony Buổi Sáng",
  "Stephen Hawking",
  "Napoleon Hill",
  "J.K. Rowling",
  "Nguyễn Du",
  "Tô Hoài",
  "Victor Hugo",
  "Hồ Chí Minh",
  "Nam Cao",
  "Xuân Diệu",
  "Trần Đăng Khoa"
];

const existingBook: UpdateBookForm = {
  title: "Nhà Giả Kim",
  slug: "nha-gia-kim",
  sku: "BK1024",
  author: ["Paulo Coelho"],
  publisher: "NXB Hội Nhà Văn",
  genre: ["Văn học"],
  language: "Tiếng Việt",
  publishYear: "2024",
  pages: "228",
  price: "92000",
  compareAtPrice: "120000",
  stock: "120",
  status: "ACTIVE",
  shortDescription: "Hành trình theo đuổi giấc mơ và kho báu của mỗi người.",
  description:
    "Nhà Giả Kim kể về chàng chăn cừu Santiago trên hành trình tìm kiếm kho báu và khám phá ý nghĩa cuộc đời.",
  coverImages: [
    "https://salt.tikicdn.com/cache/750x750/ts/product/2f/c9/09/cf3c47f3352ef6b09f0cde9e07f77f0e.jpg",
    "https://salt.tikicdn.com/cache/750x750/ts/product/7f/26/c7/ef2c585f6a65443d0556bd20e709d898.jpg",
  ],
};

export default function UpdateProduct() {
  const [form, setForm] = useState<UpdateBookForm>(existingBook);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublisherDropdownOpen, setIsPublisherDropdownOpen] = useState(false);
  const [publisherSearch, setPublisherSearch] = useState("");
  const publisherDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch active genres from DB using hook
  const { data: genresData } = useGenre({ size: 100 });
  const genresList = genresData?.items || [];

  const fallbackGenres = [
    "Văn học",
    "Kinh tế - Kỹ năng",
    "Tâm lý học",
    "Khoa học - Công nghệ",
    "Lịch sử - Địa lý",
    "Thiếu nhi",
    "Ngoại ngữ",
    "Tiểu thuyết - Truyện ngắn"
  ];

  const activeGenres = genresList.length > 0 ? genresList.map((g: GenreResponse) => g.name) : fallbackGenres;

  // Map genres to Options for SelectedMutil
  const genreOptions = useMemo(() => {
    return activeGenres.map((gName) => ({
      label: gName,
      value: gName,
    }));
  }, [activeGenres]);

  // Map authors to Options for SelectedMutil
  const authorOptions = useMemo(() => {
    return POPULAR_AUTHORS.map((authName) => ({
      label: authName,
      value: authName,
    }));
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (publisherDropdownRef.current && !publisherDropdownRef.current.contains(event.target as Node)) {
        setIsPublisherDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auto-generate clean slug URL from title
  const convertToSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .trim()
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .replace(/-+/g, "-"); // remove double hyphens
  };

  const handleChange = <K extends keyof UpdateBookForm>(key: K, value: UpdateBookForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleTitleChange = (val: string) => {
    handleChange("title", val);
    handleChange("slug", convertToSlug(val));
  };

  // Media Management
  const handleCoverImageChange = (index: number, value: string) => {
    const nextImages = [...form.coverImages];
    nextImages[index] = value;
    handleChange("coverImages", nextImages);
  };

  const handleAddCoverImage = () => {
    handleChange("coverImages", [...form.coverImages, ""]);
  };

  const handleRemoveCoverImage = (index: number) => {
    if (form.coverImages.length === 1) {
      handleChange("coverImages", [""]);
      return;
    }
    handleChange(
      "coverImages",
      form.coverImages.filter((_, i) => i !== index)
    );
  };

  // Discount calculator
  const getDiscountPercentage = () => {
    const p = parseFloat(form.price);
    const cp = parseFloat(form.compareAtPrice);
    if (p && cp && cp > p) {
      return Math.round(((cp - p) / cp) * 100);
    }
    return 0;
  };

  // Filter publishers based on search
  const filteredPublishers = POPULAR_PUBLISHERS.filter((pub) =>
    pub.toLowerCase().includes(publisherSearch.toLowerCase())
  );

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.title.trim()) {
      showErrorToast("Vui lòng nhập tên sách!");
      return;
    }
    if (form.author.length === 0) {
      showErrorToast("Vui lòng nhập hoặc chọn ít nhất một tác giả!");
      return;
    }
    if (form.genre.length === 0) {
      showErrorToast("Vui lòng chọn ít nhất một thể loại sách!");
      return;
    }
    if (!form.price.trim() || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      showErrorToast("Vui lòng nhập giá bán hợp lệ!");
      return;
    }
    if (!form.stock.trim() || isNaN(Number(form.stock)) || Number(form.stock) < 0) {
      showErrorToast("Vui lòng nhập số lượng tồn kho hợp lệ!");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call for updating product
      await new Promise((resolve) => setTimeout(resolve, 1200));
      showSuccessToast("Cập nhật thông tin sách thành công!");
      
      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch {
      showErrorToast("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDiscount = getDiscountPercentage();

  return (
    <section className="space-y-6 p-4 md:p-6 flex-1 max-w-7xl mx-auto w-full">
      {/* HEADER BREADCRUMB - STICKY FOR PREMIUM CONTROLS */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-4 border-b border-slate-200/60">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Link to="/admin/products" className="hover:text-indigo-600 transition">Sách</Link>
            <ChevronRight size={12} />
            <span className="text-slate-600">Chỉnh sửa</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Link 
              to="/admin/products" 
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 active:scale-95 transition cursor-pointer shadow-sm hover:text-slate-800"
              title="Quay lại"
            >
              <ArrowLeft size={16} />
            </Link>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Cập nhật sách</h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Link 
            to="/admin/products" 
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <X size={16} />
            Hủy bỏ
          </Link>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/15 hover:shadow-lg hover:shadow-indigo-600/25 hover:from-indigo-500 hover:to-violet-500 active:scale-95 transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      {/* FORM BODY */}
      <form id="update-product-form" className="grid gap-6 lg:grid-cols-3 align-start" onSubmit={handleSubmit}>
        
        {/* LEFT COLUMN (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* BASIC INFORMATION */}
          <div className="rounded-2xl border border-slate-200/60 bg-gradient-to-tr from-slate-50 to-white p-5 md:p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                <BookOpen size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Thông tin sách cơ bản</h2>
                <p className="text-xs text-slate-500">Mô tả đặc điểm, thuộc tính chính của tác phẩm</p>
              </div>
            </div>
            
            <div className="grid gap-5 md:grid-cols-2">
              
              {/* Tên sách */}
              <div className="md:col-span-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                    Tên sách <span className="text-rose-500">*</span>
                  </label>
                  <span className={`text-[10px] font-semibold ${form.title.length > 100 ? "text-rose-500" : "text-slate-400"}`}>
                    {form.title.length}/120 ký tự
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-3.5 text-slate-400 pointer-events-none">
                    <BookMarked size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={form.title}
                    onChange={(event) => handleTitleChange(event.target.value)}
                    placeholder="Nhập tên đầy đủ của tác phẩm sách..."
                    className="w-full rounded-xl border border-slate-200 bg-white/70 pl-10 pr-4 py-3 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Slug URL */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                    Đường dẫn thân thiện (Slug URL)
                  </label>
                  <span className="text-[10px] text-indigo-500 font-semibold flex items-center gap-0.5"><Sparkles size={10} /> Tự động</span>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-3 text-[11px] text-slate-400 font-semibold bg-slate-100/80 px-2 py-0.5 rounded border border-slate-200 pointer-events-none">
                    /books/
                  </div>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(event) => handleChange("slug", event.target.value)}
                    placeholder="nha-gia-kim"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-20 pr-4 py-2.5 text-xs placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 font-mono text-slate-600"
                  />
                </div>
              </div>

              {/* SKU Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                  Mã định danh (SKU)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-3 text-slate-400 pointer-events-none">
                    <Hash size={15} />
                  </div>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(event) => handleChange("sku", event.target.value)}
                    placeholder="Ví dụ: BK-DACNHANTAM-01"
                    className="w-full rounded-xl border border-slate-200 bg-white/70 pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Tác giả (Chọn nhiều dùng component SelectedMutil với Filter) */}
              <div className="md:col-span-2">
                <SelectedMutil
                  label="Tác giả / Dịch giả *"
                  options={authorOptions}
                  value={form.author}
                  onChange={(val) => handleChange("author", val)}
                  placeholder="Chọn hoặc gõ tìm kiếm tác giả (chọn nhiều)..."
                />
              </div>

              {/* Thể loại (Chọn nhiều dùng component SelectedMutil với Filter) */}
              <div>
                <SelectedMutil
                  label="Thể loại sách *"
                  options={genreOptions}
                  value={form.genre}
                  onChange={(val) => handleChange("genre", val)}
                  placeholder="Chọn thể loại (chọn nhiều)..."
                />
              </div>

              {/* Nhà xuất bản (Chọn duy nhất 1) */}
              <div className="space-y-1.5 relative" ref={publisherDropdownRef}>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                  Nhà xuất bản
                </label>
                
                <div 
                  onClick={() => setIsPublisherDropdownOpen(!isPublisherDropdownOpen)}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm cursor-pointer hover:border-slate-300 transition min-h-[44px]"
                >
                  <div className="flex items-center gap-2 text-slate-700">
                    <Building2 size={15} className="text-slate-400" />
                    <span>{form.publisher || "Chọn Nhà xuất bản..."}</span>
                  </div>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isPublisherDropdownOpen ? "rotate-180" : ""}`} />
                </div>

                {isPublisherDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-2 space-y-2">
                    <input
                      type="text"
                      placeholder="Tìm nhà xuất bản..."
                      value={publisherSearch}
                      onChange={(e) => setPublisherSearch(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 outline-none focus:border-indigo-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="max-h-48 overflow-y-auto space-y-0.5">
                      {filteredPublishers.length > 0 ? (
                        filteredPublishers.map((pub) => (
                          <div 
                            key={pub}
                            onClick={() => {
                              handleChange("publisher", pub);
                              setIsPublisherDropdownOpen(false);
                            }}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer select-none transition ${
                              form.publisher === pub ? "bg-indigo-50 text-indigo-900 font-semibold" : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <span>{pub}</span>
                            {form.publisher === pub && <Check size={14} className="text-indigo-600" />}
                          </div>
                        ))
                      ) : (
                        <div 
                          onClick={() => {
                            handleChange("publisher", publisherSearch);
                            setIsPublisherDropdownOpen(false);
                          }}
                          className="px-3 py-2 rounded-lg text-xs text-indigo-600 hover:bg-slate-50 cursor-pointer italic text-center"
                        >
                          Dùng nhà xuất bản tùy chỉnh: "{publisherSearch}"
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Ngôn ngữ */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Ngôn ngữ</label>
                <div className="relative">
                  <div className="absolute left-4 top-3 text-slate-400 pointer-events-none">
                    <Globe size={15} />
                  </div>
                  <input
                    type="text"
                    value={form.language}
                    onChange={(event) => handleChange("language", event.target.value)}
                    placeholder="Ví dụ: Tiếng Việt, Tiếng Anh..."
                    className="w-full rounded-xl border border-slate-200 bg-white/70 pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Năm xuất bản */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Năm xuất bản</label>
                <div className="relative">
                  <div className="absolute left-4 top-3 text-slate-400 pointer-events-none">
                    <Calendar size={15} />
                  </div>
                  <input
                    type="number"
                    value={form.publishYear}
                    onChange={(event) => handleChange("publishYear", event.target.value)}
                    placeholder="Ví dụ: 2026"
                    className="w-full rounded-xl border border-slate-200 bg-white/70 pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Số trang */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Số trang</label>
                <div className="relative">
                  <div className="absolute left-4 top-3 text-slate-400 pointer-events-none">
                    <FileText size={15} />
                  </div>
                  <input
                    type="number"
                    value={form.pages}
                    onChange={(event) => handleChange("pages", event.target.value)}
                    placeholder="Ví dụ: 350"
                    className="w-full rounded-xl border border-slate-200 bg-white/70 pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCT DESCRIPTION */}
          <div className="rounded-2xl border border-slate-200/60 bg-gradient-to-tr from-slate-50 to-white p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Mô tả chi tiết</h2>
                <p className="text-xs text-slate-500">Giới thiệu ngắn gọn và tóm tắt nội dung cốt lõi của sách</p>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Mô tả ngắn</label>
                  <span className={`text-[10px] font-semibold ${form.shortDescription.length > 220 ? "text-rose-500" : "text-slate-400"}`}>
                    {form.shortDescription.length}/250 ký tự
                  </span>
                </div>
                <textarea
                  rows={2}
                  maxLength={250}
                  value={form.shortDescription}
                  onChange={(event) => handleChange("shortDescription", event.target.value)}
                  placeholder="Mô tả tóm tắt nội dung sách hiển thị ở trang kết quả tìm kiếm..."
                  className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 resize-none"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Mô tả đầy đủ (Tiptap Rich Text)</label>
                <div className="bg-white rounded-xl overflow-hidden shadow-xs border border-slate-100">
                  <ProductDescriptionEditor
                    value={form.description}
                    onChange={(value) => handleChange("description", value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (1/3 width on large screens) */}
        <div className="space-y-6">
          
          {/* PRICE AND STOCK */}
          <div className="rounded-2xl border border-slate-200/60 bg-gradient-to-tr from-slate-50 to-white p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                <DollarSign size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Giá bán & Tồn kho</h2>
                <p className="text-xs text-slate-500">Thiết lập giá và số lượng trong kho</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Giá bán lẻ */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                    Giá bán thực tế (VND) <span className="text-rose-500">*</span>
                  </label>
                  {currentDiscount > 0 && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-100 animate-pulse">
                      <Percent size={10} /> Giảm {currentDiscount}%
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute right-4 top-2.5 text-slate-400 text-xs font-bold">VND</div>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(event) => handleChange("price", event.target.value)}
                    placeholder="Ví dụ: 95000"
                    className="w-full rounded-xl border border-slate-200 bg-white/70 pl-4 pr-12 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Giá so sánh */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Giá gốc / So sánh (VND)</label>
                <div className="relative">
                  <div className="absolute right-4 top-2.5 text-slate-400 text-xs font-bold">VND</div>
                  <input
                    type="number"
                    value={form.compareAtPrice}
                    onChange={(event) => handleChange("compareAtPrice", event.target.value)}
                    placeholder="Ví dụ: 120000"
                    className="w-full rounded-xl border border-slate-200 bg-white/70 pl-4 pr-12 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 text-slate-500 font-medium"
                  />
                </div>
              </div>

              {/* Số lượng tồn kho */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                  Số lượng trong kho <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={form.stock}
                  onChange={(event) => handleChange("stock", event.target.value)}
                  placeholder="Ví dụ: 100"
                  className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              {/* Trạng thái - Bằng Radio Cards cao cấp */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Trạng thái phát hành</label>
                
                <div className="space-y-2">
                  {/* Bản nháp (DRAFT) */}
                  <div 
                    onClick={() => handleChange("status", "DRAFT")}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                      form.status === "DRAFT" 
                        ? "border-slate-800 bg-slate-50 shadow-sm" 
                        : "border-slate-200 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="h-4.5 w-4.5 rounded-full border border-slate-300 flex items-center justify-center bg-white shrink-0">
                      {form.status === "DRAFT" && <div className="h-2 w-2 rounded-full bg-slate-800" />}
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        Bản nháp (Draft)
                      </div>
                      <div className="text-[10px] text-slate-500">Chỉ quản trị viên mới thấy sách này.</div>
                    </div>
                  </div>

                  {/* Đang bán (ACTIVE) */}
                  <div 
                    onClick={() => handleChange("status", "ACTIVE")}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                      form.status === "ACTIVE" 
                        ? "border-emerald-500 bg-emerald-50/40 shadow-sm" 
                        : "border-slate-200 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="h-4.5 w-4.5 rounded-full border border-slate-300 flex items-center justify-center bg-white shrink-0">
                      {form.status === "ACTIVE" && <div className="h-2 w-2 rounded-full bg-emerald-600" />}
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Đang bán lẻ (Active)
                      </div>
                      <div className="text-[10px] text-emerald-600/80">Hiển thị công khai lên cửa hàng ngay.</div>
                    </div>
                  </div>

                  {/* Hết hàng (OUT_OF_STOCK) */}
                  <div 
                    onClick={() => handleChange("status", "OUT_OF_STOCK")}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                      form.status === "OUT_OF_STOCK" 
                        ? "border-rose-500 bg-rose-50/40 shadow-sm" 
                        : "border-slate-200 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="h-4.5 w-4.5 rounded-full border border-slate-300 flex items-center justify-center bg-white shrink-0">
                      {form.status === "OUT_OF_STOCK" && <div className="h-2 w-2 rounded-full bg-rose-600" />}
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                        Tạm hết hàng
                      </div>
                      <div className="text-[10px] text-rose-600/80">Khóa đặt hàng trên website.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCT IMAGES (Hỗ trợ nhiều ảnh) */}
          <div className="rounded-2xl border border-slate-200/60 bg-gradient-to-tr from-slate-50 to-white p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                <ImageIcon size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Ảnh bìa & Minh họa</h2>
                <p className="text-xs text-slate-500">Thêm nhiều ảnh để hiển thị chi tiết (Dán URL)</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                {form.coverImages.map((image, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex gap-2 items-center">
                      <div className="relative shrink-0">
                        {image ? (
                          <img 
                            src={image} 
                            alt="" 
                            className="h-10 w-10 rounded-xl object-cover border border-slate-200 bg-slate-50 shadow-xs" 
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-xl border border-dashed border-slate-200 bg-slate-100/50 flex items-center justify-center text-slate-400">
                            <ImageIcon size={14} />
                          </div>
                        )}
                        {index === 0 && (
                          <span className="absolute -top-1 -left-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-600 text-[8px] font-bold text-white shadow-xs" title="Ảnh đại diện chính">
                            ★
                          </span>
                        )}
                      </div>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={image}
                          onChange={(event) => handleCoverImageChange(index, event.target.value)}
                          placeholder={index === 0 ? "Dán URL Ảnh bìa chính... (Bắt buộc)" : `Dán URL Ảnh minh họa thứ ${index + 1}...`}
                          className="w-full rounded-xl border border-slate-200 bg-white/70 pl-3 pr-8 py-2 text-xs placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white"
                        />
                        {index === 0 && (
                          <span className="absolute right-3 top-2 text-[9px] font-bold text-indigo-500 uppercase tracking-wide bg-indigo-50 px-1 rounded border border-indigo-100">Ảnh chính</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCoverImage(index)}
                        className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 active:scale-95 transition cursor-pointer flex items-center justify-center shrink-0 shadow-xs"
                        title="Xóa liên kết này"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddCoverImage}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/20 px-3 py-2.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition cursor-pointer active:scale-98"
              >
                <Plus size={14} />
                Thêm URL ảnh minh họa
              </button>

              {/* Cover previews grid with dynamic responsive cards */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                {form.coverImages.filter(Boolean).length > 0 ? (
                  form.coverImages
                    .filter(Boolean)
                    .map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="group relative h-20 flex items-center justify-center rounded-xl border border-slate-100 bg-white p-1.5 overflow-hidden shadow-xs"
                      >
                        <img 
                          src={image} 
                          alt={`Preview ${index + 1}`} 
                          className="h-full w-full object-contain rounded-lg transition duration-300 group-hover:scale-105" 
                        />
                        {index === 0 && (
                          <div className="absolute top-1 left-1 bg-indigo-600 text-white font-extrabold text-[8px] px-1 py-0.5 rounded shadow-xs">
                            Bìa chính
                          </div>
                        )}
                        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <span className="text-[8px] bg-slate-900/80 text-white font-semibold px-1.5 py-0.5 rounded-full">Ảnh {index + 1}</span>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="col-span-3 text-center text-xs text-slate-400 py-6 border border-dashed border-slate-100 bg-slate-50/50 rounded-xl">
                    Chưa có ảnh xem trước.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DYNAMIC LIVE STOREFRONT PREVIEW (WOW FACTOR) */}
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-tr from-indigo-50/20 to-purple-50/20 p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-100/50">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-indigo-600 p-2 text-white shadow-sm shadow-indigo-600/20">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">Xem trước hiển thị (Live Preview)</h2>
                  <p className="text-[10px] text-slate-500">Mô phỏng thực tế thẻ sách khách hàng sẽ thấy</p>
                </div>
              </div>
              <span className="bg-indigo-600/10 text-indigo-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-indigo-200/50 uppercase tracking-wide">
                Live Storefront
              </span>
            </div>

            {/* Simulated Bookstore Card */}
            <div className="flex justify-center py-2">
              <div className="w-56 bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                {/* Book Cover Image Slot */}
                <div className="relative h-64 bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100">
                  {form.coverImages[0] ? (
                    <img 
                      src={form.coverImages[0]} 
                      alt="" 
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" 
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-300 p-4">
                      <div className="h-12 w-12 rounded-full bg-slate-100/80 flex items-center justify-center border border-dashed border-slate-200">
                        <BookMarked size={20} className="text-slate-400" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 italic">Chưa nhập ảnh bìa</span>
                    </div>
                  )}
                  {/* Discount Badge */}
                  {currentDiscount > 0 && (
                    <div className="absolute top-3 right-3 bg-rose-600 text-white font-extrabold text-xs px-2 py-0.5 rounded-lg shadow-sm shadow-rose-600/20">
                      -{currentDiscount}%
                    </div>
                  )}
                  {/* Status Pill on Preview */}
                  <div className="absolute bottom-2.5 left-2.5">
                    {form.status === "ACTIVE" && (
                      <span className="bg-emerald-500/90 text-white font-extrabold text-[8px] px-2 py-0.5 rounded shadow-sm border border-emerald-400/20 flex items-center gap-0.5">
                        <span className="h-1 w-1 rounded-full bg-white animate-pulse" /> ĐANG BÁN
                      </span>
                    )}
                    {form.status === "DRAFT" && (
                      <span className="bg-slate-700/90 text-white font-extrabold text-[8px] px-2 py-0.5 rounded shadow-sm flex items-center gap-0.5">
                        BẢN NHÁP
                      </span>
                    )}
                    {form.status === "OUT_OF_STOCK" && (
                      <span className="bg-rose-600/90 text-white font-extrabold text-[8px] px-2 py-0.5 rounded shadow-sm flex items-center gap-0.5">
                        HẾT HÀNG
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-4 space-y-2">
                  {/* Genres Row */}
                  <div className="flex flex-wrap gap-1 max-h-5 overflow-hidden">
                    {form.genre.length > 0 ? (
                      form.genre.slice(0, 2).map((g) => (
                        <span key={g} className="bg-slate-100 text-slate-600 text-[8px] font-bold px-1.5 py-0.5 rounded">
                          {g}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-300 text-[8px] italic">Chưa chọn thể loại</span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-800 text-xs leading-tight line-clamp-2 h-8" title={form.title}>
                    {form.title.trim() || <span className="text-slate-400 font-medium italic">Chưa nhập tên tác phẩm...</span>}
                  </h3>

                  {/* Authors */}
                  <p className="text-[10px] text-slate-500 truncate">
                    {form.author.length > 0 ? (
                      `Bởi ${form.author.join(", ")}`
                    ) : (
                      <span className="text-slate-300 italic">Khuyết danh</span>
                    )}
                  </p>

                  {/* Pricing */}
                  <div className="pt-1 flex items-baseline gap-1.5">
                    {form.price ? (
                      <span className="text-indigo-600 font-extrabold text-sm">
                        {Number(form.price).toLocaleString("vi-VN")}đ
                      </span>
                    ) : (
                      <span className="text-slate-400 font-bold text-xs italic">Liên hệ</span>
                    )}
                    {form.price && form.compareAtPrice && Number(form.compareAtPrice) > Number(form.price) && (
                      <span className="text-slate-400 text-[10px] line-through">
                        {Number(form.compareAtPrice).toLocaleString("vi-VN")}đ
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
