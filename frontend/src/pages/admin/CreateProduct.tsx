import { useState, useMemo } from "react";
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
  Loader2,
  Calendar,
  BookMarked,
  Upload,
  Weight,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useGenre } from "@/hooks/useGenre";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtil";
import type { AuthorResponse } from "@/types/author";
import type { GenreResponse } from "@/types/genre";
import { useAuthor } from "@/hooks/useAuthor";
import { usePublisher } from "@/hooks/usePublisher";
import SelectBox from "@/components/common/SelectedBox";

type CreateBookForm = {
  title: string;
  slug: string;
  sku: string;
  author: string[];
  publisher: string;
  genre: string[];
  weight: string;
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

const initialForm: CreateBookForm = {
  title: "",
  slug: "",
  sku: "",
  author: [],
  publisher: "",
  genre: [],
  weight: "",
  publishYear: "",
  pages: "",
  price: "",
  compareAtPrice: "",
  stock: "",
  status: "ACTIVE", // Default to Active
  shortDescription: "",
  description: "",
  coverImages: [""],
};

export default function CreateProduct() {
  const [form, setForm] = useState<CreateBookForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploadMode, setImageUploadMode] = useState<"file" | "url">("file");
  const navigate = useNavigate();

  const { data: genresData } = useGenre({ size: 100 });

  const { data: authorsData = [] } = useAuthor();
  const { data: publishersData = [] } = usePublisher();
  const genresList = genresData?.items || [];

  const fallbackGenres = [
    "Văn học",
    "Kinh tế - Kỹ năng",
    "Tâm lý học",
    "Khoa học - Công nghệ",
    "Lịch sử - Địa lý",
    "Thiếu nhi",
    "Ngoại ngữ",
    "Tiểu thuyết - Truyện ngắn",
  ];

  const activeGenres =
    genresList.length > 0
      ? genresList.map((g: GenreResponse) => g.name)
      : fallbackGenres;

  // Map genres to Options for SelectedMutil
  const genreOptions = useMemo(() => {
    return activeGenres.map((gName) => ({
      label: gName,
      value: gName,
    }));
  }, [activeGenres]);

  // Map authors to Options for SelectedMutil
  const authorOptions = useMemo(() => {
    return authorsData.map((author: AuthorResponse) => ({
      label: author.displayName,
      value: author.name,
    }));
  }, [authorsData]);

  // Map publishers to Options for SelectBox
  const publisherOptions = useMemo(() => {
    return publishersData.map((publisher) => ({
      label: publisher.displayName,
      value: String(publisher.id),
    }));
  }, [publishersData]);

  // Auto-generate clean slug URL from title in background
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

  const handleChange = <K extends keyof CreateBookForm>(
    key: K,
    value: CreateBookForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleTitleChange = (val: string) => {
    handleChange("title", val);
    handleChange("slug", convertToSlug(val));
  };

  // Media Management - URL based
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
      form.coverImages.filter((_, i) => i !== index),
    );
  };

  // Media Management - Local File upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImagePromises = Array.from(files).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImagePromises).then((base64Images) => {
      const currentImages = form.coverImages.filter(Boolean);
      const updatedImages = [...currentImages, ...base64Images];
      handleChange("coverImages", updatedImages.length > 0 ? updatedImages : [""]);
      showSuccessToast(`Đã thêm ${base64Images.length} ảnh thành công!`);
    });
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

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
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
    if (
      !form.price.trim() ||
      isNaN(Number(form.price)) ||
      Number(form.price) <= 0
    ) {
      showErrorToast("Vui lòng nhập giá bán hợp lệ!");
      return;
    }
    if (
      !form.stock.trim() ||
      isNaN(Number(form.stock)) ||
      Number(form.stock) < 0
    ) {
      showErrorToast("Vui lòng nhập số lượng tồn kho hợp lệ!");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      showSuccessToast(
        isDraft
          ? "Đã lưu bản nháp sách thành công!"
          : "Tạo sách mới thành công!",
      );

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
    <section className="space-y-8 p-4 md:p-8 flex-1 max-w-7xl mx-auto w-full">
      {/* HEADER BREADCRUMB - STICKY FROSTED GLASS BAR */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-5 border-b border-slate-200/40 sticky top-0 bg-white/70 backdrop-blur-xl z-30 pt-3 transition-all duration-300">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Link
              to="/admin/products"
              className="hover:text-indigo-600 transition-colors"
            >
              Sách
            </Link>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-indigo-600 font-bold bg-indigo-50/50 px-2 py-0.5 rounded-md">Thêm mới</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide bg-gradient-to-r from-indigo-500/10 to-violet-500/10 text-indigo-600 border border-indigo-100/30">
              <Sparkles size={9} className="animate-spin" /> Premium Suite
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/products"
              className="group rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50 active:scale-95 transition-all duration-200 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:text-slate-800"
              title="Quay lại"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Thêm sách mới
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-md px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            <Save size={16} className="text-slate-500" />
            Lưu nháp
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-650 to-indigo-700 px-6 py-3 text-sm font-bold text-white shadow-[0_10px_20px_-5px_rgba(99,102,241,0.35)] hover:shadow-[0_15px_30px_-5px_rgba(99,102,241,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={18} />
            )}
            {isSubmitting ? "Đang tạo..." : "Tạo sách mới"}
          </button>
        </div>
      </div>

      {/* FORM BODY */}
      <form
        id="create-product-form"
        className="grid gap-8 lg:grid-cols-3 align-start"
        onSubmit={(e) => handleSubmit(e, false)}
      >
        {/* LEFT COLUMN (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-8">
          {/* BASIC INFORMATION */}
          <div className="rounded-3xl border border-slate-200/50 bg-gradient-to-br from-white via-white to-slate-50/20 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.02)] transition-all duration-500 space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100/80">
              <div className="rounded-2xl bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 p-2.5 text-indigo-600 dark:bg-indigo-950/20">
                <BookOpen size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  Thông tin sách cơ bản
                </h2>
                <p className="text-xs text-slate-400">
                  Mô tả đặc điểm, thuộc tính chính của tác phẩm
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Tên sách */}
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    Tên sách <span className="text-rose-500">*</span>
                  </label>
                  <span
                    className={`text-[10px] font-bold ${form.title.length > 100 ? "text-rose-500" : "text-slate-400"}`}
                  >
                    {form.title.length}/120 ký tự
                  </span>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-250 pointer-events-none">
                    <BookMarked size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={form.title}
                    onChange={(event) => handleTitleChange(event.target.value)}
                    placeholder="Nhập tên đầy đủ của tác phẩm sách..."
                    className="w-full rounded-xl border border-slate-200/80 bg-white/50 pl-11 pr-4 py-3 text-sm placeholder-slate-400 outline-none transition-all duration-300 focus:border-indigo-500 focus:bg-white focus:shadow-[0_10px_20px_-10px_rgba(99,102,241,0.06)] focus:ring-4 focus:ring-indigo-100/50"
                  />
                </div>
              </div>

              {/* Tác giả */}
              <div className="space-y-1">
                <SelectedMutil
                  label="Tác giả / Dịch giả *"
                  options={authorOptions}
                  value={form.author}
                  onChange={(val) => handleChange("author", val)}
                  placeholder="Chọn tác giả..."
                />
              </div>

              {/* Thể loại */}
              <div className="space-y-1">
                <SelectedMutil
                  label="Thể loại sách *"
                  options={genreOptions}
                  value={form.genre}
                  onChange={(val) => handleChange("genre", val)}
                  placeholder="Chọn thể loại..."
                />
              </div>

              {/* Nhà xuất bản */}
              <div className="space-y-1 relative">
                <SelectBox<string>
                  label="Nhà xuất bản"
                  options={publisherOptions}
                  value={form.publisher}
                  onChange={(val) => handleChange("publisher", val)}
                  placeholder="Chọn nhà xuất bản..."
                />
              </div>

              {/* Cân nặng */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Cân nặng (gram)
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-250 pointer-events-none">
                    <Weight size={15} />
                  </div>
                  <input
                    type="number"
                    value={form.weight}
                    onChange={(event) =>
                      handleChange("weight", event.target.value)
                    }
                    placeholder="Ví dụ: 350"
                    className="w-full rounded-xl border border-slate-200/80 bg-white/50 pl-11 pr-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all duration-300 focus:border-indigo-500 focus:bg-white focus:shadow-[0_10px_20px_-10px_rgba(99,102,241,0.06)] focus:ring-4 focus:ring-indigo-100/50"
                  />
                </div>
              </div>

              {/* Năm xuất bản */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Năm xuất bản
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-250 pointer-events-none">
                    <Calendar size={15} />
                  </div>
                  <input
                    type="number"
                    value={form.publishYear}
                    onChange={(event) =>
                      handleChange("publishYear", event.target.value)
                    }
                    placeholder="Ví dụ: 2026"
                    className="w-full rounded-xl border border-slate-200/80 bg-white/50 pl-11 pr-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all duration-300 focus:border-indigo-500 focus:bg-white focus:shadow-[0_10px_20px_-10px_rgba(99,102,241,0.06)] focus:ring-4 focus:ring-indigo-100/50"
                  />
                </div>
              </div>

              {/* Số trang */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Số trang
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-250 pointer-events-none">
                    <FileText size={15} />
                  </div>
                  <input
                    type="number"
                    value={form.pages}
                    onChange={(event) =>
                      handleChange("pages", event.target.value)
                    }
                    placeholder="Ví dụ: 350"
                    className="w-full rounded-xl border border-slate-200/80 bg-white/50 pl-11 pr-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all duration-300 focus:border-indigo-500 focus:bg-white focus:shadow-[0_10px_20px_-10px_rgba(99,102,241,0.06)] focus:ring-4 focus:ring-indigo-100/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCT DESCRIPTION */}
          <div className="rounded-3xl border border-slate-200/50 bg-gradient-to-br from-white via-white to-slate-50/20 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.02)] transition-all duration-500 space-y-5">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100/80">
              <div className="rounded-2xl bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 p-2.5 text-indigo-600 dark:bg-indigo-950/20">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  Mô tả chi tiết
                </h2>
                <p className="text-xs text-slate-400">
                  Giới thiệu đầy đủ nội dung cốt lõi của cuốn sách
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Mô tả đầy đủ (Tiptap Rich Text)
                </label>
                <div className="bg-white rounded-2xl overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.01)] border border-slate-200 transition-all duration-300 focus-within:border-indigo-500 focus-within:shadow-[0_10px_25px_-10px_rgba(99,102,241,0.06)] focus-within:ring-4 focus-within:ring-indigo-100/50">
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
        <div className="space-y-8">
          {/* PRICE AND STOCK */}
          <div className="rounded-3xl border border-slate-200/50 bg-gradient-to-br from-white via-white to-slate-50/20 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.02)] transition-all duration-500 space-y-5">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100/80">
              <div className="rounded-2xl bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 p-2.5 text-indigo-600 dark:bg-indigo-950/20">
                <DollarSign size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  Giá bán & Tồn kho
                </h2>
                <p className="text-xs text-slate-400">
                  Thiết lập giá và số lượng trong kho
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Giá bán lẻ */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    Giá bán thực tế (VND){" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  {currentDiscount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-extrabold text-rose-600 border border-rose-100/80 animate-pulse">
                      <Percent size={9} /> Giảm {currentDiscount}%
                    </span>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute right-4 top-3 text-slate-400 text-xs font-extrabold group-focus-within:text-indigo-500 transition-colors duration-200">
                    VND
                  </div>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(event) =>
                      handleChange("price", event.target.value)
                    }
                    placeholder="Ví dụ: 95000"
                    className="w-full rounded-xl border border-slate-200/80 bg-white/50 pl-4 pr-14 py-3 text-sm placeholder-slate-400 outline-none transition-all duration-300 focus:border-indigo-500 focus:bg-white focus:shadow-[0_10px_20px_-10px_rgba(99,102,241,0.06)] focus:ring-4 focus:ring-indigo-100/50 font-bold text-slate-800"
                  />
                </div>
              </div>

              {/* Giá so sánh */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Giá gốc / So sánh (VND)
                </label>
                <div className="relative group">
                  <div className="absolute right-4 top-3 text-slate-400 text-xs font-extrabold group-focus-within:text-indigo-500 transition-colors duration-200">
                    VND
                  </div>
                  <input
                    type="number"
                    value={form.compareAtPrice}
                    onChange={(event) =>
                      handleChange("compareAtPrice", event.target.value)
                    }
                    placeholder="Ví dụ: 120000"
                    className="w-full rounded-xl border border-slate-200/80 bg-white/50 pl-4 pr-14 py-3 text-sm placeholder-slate-400 outline-none transition-all duration-300 focus:border-indigo-500 focus:bg-white focus:shadow-[0_10px_20px_-10px_rgba(99,102,241,0.06)] focus:ring-4 focus:ring-indigo-100/50 text-slate-500 font-medium"
                  />
                </div>
              </div>

              {/* Số lượng tồn kho */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  Số lượng trong kho <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={form.stock}
                  onChange={(event) =>
                    handleChange("stock", event.target.value)
                  }
                  placeholder="Ví dụ: 100"
                  className="w-full rounded-xl border border-slate-200/80 bg-white/50 px-4 py-3 text-sm placeholder-slate-400 outline-none transition-all duration-300 focus:border-indigo-500 focus:bg-white focus:shadow-[0_10px_20px_-10px_rgba(99,102,241,0.06)] focus:ring-4 focus:ring-indigo-100/50"
                />
              </div>

              {/* Trạng thái - Hoạt động và Ngừng hoạt động */}
              <div className="space-y-2.5 pt-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Trạng thái phát hành
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* Hoạt động (ACTIVE) */}
                  <div
                    onClick={() => handleChange("status", "ACTIVE")}
                    className={`flex flex-col gap-2.5 p-4 rounded-2xl border cursor-pointer select-none transition-all duration-300 hover:scale-[1.01] ${
                      form.status === "ACTIVE"
                        ? "border-emerald-500/80 bg-emerald-50/20 shadow-[0_8px_20px_rgba(16,185,129,0.06)]"
                        : "border-slate-200 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-5 w-5 rounded-full border border-slate-350 flex items-center justify-center bg-white shrink-0">
                        {form.status === "ACTIVE" && (
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse" />
                        )}
                      </div>
                      <span className={`h-2 w-2 rounded-full ${form.status === "ACTIVE" ? "bg-emerald-500 animate-ping" : "bg-slate-300"}`} />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-extrabold text-slate-800">
                        Hoạt động
                      </div>
                      <div className="text-[10px] text-slate-400 leading-normal">
                        Hiển thị ngay lên website.
                      </div>
                    </div>
                  </div>

                  {/* Ngừng hoạt động (DRAFT) */}
                  <div
                    onClick={() => handleChange("status", "DRAFT")}
                    className={`flex flex-col gap-2.5 p-4 rounded-2xl border cursor-pointer select-none transition-all duration-300 hover:scale-[1.01] ${
                      form.status === "DRAFT"
                        ? "border-slate-800 bg-slate-50/80 shadow-[0_8px_20px_rgba(30,41,59,0.05)]"
                        : "border-slate-200 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-5 w-5 rounded-full border border-slate-350 flex items-center justify-center bg-white shrink-0">
                        {form.status === "DRAFT" && (
                          <div className="h-2.5 w-2.5 rounded-full bg-slate-800" />
                        )}
                      </div>
                      <span className="h-2 w-2 rounded-full bg-slate-400" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-extrabold text-slate-800">
                        Tạm ẩn
                      </div>
                      <div className="text-[10px] text-slate-400 leading-normal">
                        Lưu nháp, tạm ẩn công khai.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCT IMAGES */}
          <div className="rounded-3xl border border-slate-200/50 bg-gradient-to-br from-white via-white to-slate-50/20 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.02)] transition-all duration-500 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100/80">
              <div className="flex items-center gap-3.5">
                <div className="rounded-2xl bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 p-2.5 text-indigo-600 dark:bg-indigo-950/20">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">
                    Ảnh bìa & Minh họa
                  </h2>
                  <p className="text-xs text-slate-400">
                    Tải ảnh lên hoặc dán liên kết URL từ mạng
                  </p>
                </div>
              </div>
            </div>

            {/* Mode Switcher - Frosted look */}
            <div className="flex rounded-xl bg-slate-100/80 p-1 text-xs font-semibold shadow-inner">
              <button
                type="button"
                onClick={() => setImageUploadMode("file")}
                className={`flex-1 py-2.5 rounded-lg text-center cursor-pointer transition-all duration-200 ${
                  imageUploadMode === "file"
                    ? "bg-white text-indigo-600 shadow-sm font-extrabold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Chọn tệp hình ảnh (File)
              </button>
              <button
                type="button"
                onClick={() => setImageUploadMode("url")}
                className={`flex-1 py-2.5 rounded-lg text-center cursor-pointer transition-all duration-200 ${
                  imageUploadMode === "url"
                    ? "bg-white text-indigo-600 shadow-sm font-extrabold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Nhập liên kết (URL)
              </button>
            </div>

            <div className="space-y-5">
              {imageUploadMode === "file" ? (
                /* FILE UPLOAD ZONE */
                <div className="space-y-4 animate-fade-in">
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload-input"
                    />
                    <label
                      htmlFor="file-upload-input"
                      className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/30 hover:bg-indigo-50/10 rounded-2xl p-7 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 group"
                    >
                      <div className="rounded-full bg-indigo-50/80 p-3 text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-100 group-hover:text-indigo-750 transition-all duration-300 shadow-xs">
                        <Upload size={20} className="animate-bounce" />
                      </div>
                      <div className="text-xs font-bold text-slate-700 text-center">
                        Nhấn để chọn tệp hoặc kéo thả ảnh vào đây
                      </div>
                      <div className="text-[10px] text-slate-400 text-center leading-normal">
                        Chấp nhận PNG, JPG, JPEG, WEBP<br />Hỗ trợ tải lên cùng lúc nhiều tệp
                      </div>
                    </label>
                  </div>
                </div>
              ) : (
                /* URL INPUT MODE */
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-3">
                    {form.coverImages.map((image, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex gap-2 items-center">
                          <div className="relative shrink-0">
                            {image ? (
                              <img
                                src={image}
                                alt=""
                                className="h-10 w-10 rounded-xl object-cover border border-slate-200 bg-slate-50 shadow-sm"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-xl border border-dashed border-slate-200 bg-slate-100/50 flex items-center justify-center text-slate-400">
                                <ImageIcon size={14} />
                              </div>
                            )}
                            {index === 0 && (
                              <span
                                className="absolute -top-1 -left-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-600 text-[8px] font-bold text-white shadow-xs"
                                title="Ảnh đại diện chính"
                              >
                                ★
                              </span>
                            )}
                          </div>
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={image}
                              onChange={(event) =>
                                handleCoverImageChange(index, event.target.value)
                              }
                              placeholder={
                                index === 0
                                  ? "Dán URL Ảnh bìa chính... (Bắt buộc)"
                                  : `Dán URL Ảnh minh họa thứ ${index + 1}...`
                              }
                              className="w-full rounded-xl border border-slate-200 bg-white/50 pl-3 pr-8 py-2 text-xs placeholder-slate-400 outline-none transition-all duration-300 focus:border-indigo-500 focus:bg-white"
                            />
                            {index === 0 && (
                              <span className="absolute right-3 top-2 text-[9px] font-bold text-indigo-500 uppercase tracking-wide bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                                Ảnh chính
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCoverImage(index)}
                            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 shadow-xs"
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
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/10 px-3 py-2.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-all duration-250 cursor-pointer active:scale-98"
                  >
                    <Plus size={14} />
                    Thêm URL ảnh minh họa
                  </button>
                </div>
              )}

              {/* Dynamic Previews Grid for Selected Images */}
              <div className="space-y-2.5 pt-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Danh sách ảnh đã chọn ({form.coverImages.filter(Boolean).length})
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {form.coverImages.filter(Boolean).length > 0 ? (
                    form.coverImages.filter(Boolean).map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="group relative h-24 flex items-center justify-center rounded-2xl border border-slate-200/60 bg-white p-2 overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.03] hover:rotate-1 transition-all duration-300"
                      >
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="h-full w-full object-contain rounded-xl"
                        />
                        {index === 0 ? (
                          <div className="absolute top-1.5 left-1.5 bg-indigo-600 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded shadow-sm">
                            Bìa chính
                          </div>
                        ) : (
                          <div className="absolute top-1.5 left-1.5 bg-slate-800/90 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded shadow-sm">
                            Ảnh {index + 1}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveCoverImage(form.coverImages.indexOf(image))}
                          className="absolute right-1.5 top-1.5 bg-rose-600 text-white p-1.5 rounded-xl opacity-0 group-hover:opacity-100 backdrop-blur-xs transition-all duration-250 hover:bg-rose-500 shadow-sm active:scale-90"
                          title="Xóa ảnh này"
                        >
                          <Trash2 size={10} />
                        </button>
                        <div className="absolute inset-x-0 bottom-0 bg-slate-950/45 py-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-[8px] text-white font-extrabold">
                            Hình {index + 1}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center text-xs text-slate-400 py-8 border border-dashed border-slate-200/80 bg-slate-50/50 rounded-2xl leading-relaxed">
                      Chưa chọn hoặc tải ảnh nào.<br />Hãy chọn tệp ảnh để xem trước.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
