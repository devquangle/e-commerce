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
  Loader2,
  Upload,
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
  const [imageUploadMode, setImageUploadMode] = useState<"file" | "url">(
    "file",
  );
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
      handleChange(
        "coverImages",
        updatedImages.length > 0 ? updatedImages : [""],
      );
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
    <section className="max-w-7xl mx-auto w-full">
      {/* HEADER - STATIC & SIMPLIFIED */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
            <Link
              to="/admin/products"
              className="hover:text-indigo-600 transition-colors"
            >
              Sách
            </Link>
            <span>/</span>
            <span className="text-slate-600 font-semibold">Thêm mới</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/products"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Quay lại"
            >
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Thêm sách mới
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Save size={15} />
            Lưu nháp
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            {isSubmitting ? "Đang tạo..." : "Tạo sách mới"}
          </button>
        </div>
      </div>

      {/* FORM BODY */}
      <form
        id="create-product-form"
        className="grid gap-6 lg:grid-cols-3 items-start"
        onSubmit={(e) => handleSubmit(e, false)}
      >
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* BASIC INFORMATION */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <BookOpen size={18} className="text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Thông tin sách cơ bản
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Tên sách */}
              <div className="md:col-span-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Tên sách <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {form.title.length}/120
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={120}
                  value={form.title}
                  onChange={(event) => handleTitleChange(event.target.value)}
                  placeholder="Nhập tên đầy đủ của tác phẩm sách..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm placeholder-slate-400 outline-none transition-colors focus:border-indigo-500"
                />
              </div>

              {/* Tác giả, thể loại, nhà xuất bản — 1 cột */}
              <div className="md:col-span-2 space-y-4">
                <SelectedMutil
                  label="Tác giả / Dịch giả *"
                  options={authorOptions}
                  value={form.author}
                  onChange={(val) => handleChange("author", val)}
                  placeholder="Chọn tác giả..."
                />
                <SelectedMutil
                  label="Thể loại sách *"
                  options={genreOptions}
                  value={form.genre}
                  onChange={(val) => handleChange("genre", val)}
                  placeholder="Chọn thể loại..."
                />
                <SelectBox<string>
                  label="Nhà xuất bản"
                  options={publisherOptions}
                  value={form.publisher}
                  onChange={(val) => handleChange("publisher", val)}
                  placeholder="Chọn nhà xuất bản..."
                />
              </div>

              {/* Cân nặng */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Cân nặng (gram)
                </label>
                <input
                  type="number"
                  value={form.weight}
                  onChange={(event) =>
                    handleChange("weight", event.target.value)
                  }
                  placeholder="Ví dụ: 350"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm placeholder-slate-400 outline-none transition-colors focus:border-indigo-500"
                />
              </div>

              {/* Năm xuất bản */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Năm xuất bản
                </label>
                <input
                  type="number"
                  value={form.publishYear}
                  onChange={(event) =>
                    handleChange("publishYear", event.target.value)
                  }
                  placeholder="Ví dụ: 2026"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm placeholder-slate-400 outline-none transition-colors focus:border-indigo-500"
                />
              </div>

              {/* Số trang */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Số trang
                </label>
                <input
                  type="number"
                  value={form.pages}
                  onChange={(event) =>
                    handleChange("pages", event.target.value)
                  }
                  placeholder="Ví dụ: 350"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm placeholder-slate-400 outline-none transition-colors focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* PRODUCT DESCRIPTION */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <FileText size={18} className="text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Mô tả chi tiết
              </h2>
            </div>
            <div className="space-y-1.5">
              <ProductDescriptionEditor
                value={form.description}
                onChange={(value) => handleChange("description", value)}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* PRICE AND STOCK */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <DollarSign size={18} className="text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Giá bán & Tồn kho
              </h2>
            </div>

            <div className="space-y-4">
              {/* Giá bán */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Giá bán lẻ (VND) <span className="text-rose-500">*</span>
                  </label>
                  {currentDiscount > 0 && (
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      -{currentDiscount}%
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(event) =>
                      handleChange("price", event.target.value)
                    }
                    placeholder="Ví dụ: 95000"
                    className="w-full rounded-xl border border-slate-200 bg-white pl-3 pr-12 py-2 text-sm outline-none focus:border-indigo-500 font-semibold"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">
                    VND
                  </span>
                </div>
              </div>

              {/* Giá so sánh */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Giá gốc / So sánh (VND)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.compareAtPrice}
                    onChange={(event) =>
                      handleChange("compareAtPrice", event.target.value)
                    }
                    placeholder="Ví dụ: 120000"
                    className="w-full rounded-xl border border-slate-200 bg-white pl-3 pr-12 py-2 text-sm outline-none focus:border-indigo-500 text-slate-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">
                    VND
                  </span>
                </div>
              </div>

              {/* Số lượng tồn */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              {/* Trạng thái */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Trạng thái phát hành
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    onClick={() => handleChange("status", "ACTIVE")}
                    className={`p-3 rounded-xl border text-center cursor-pointer select-none transition-colors ${
                      form.status === "ACTIVE"
                        ? "border-emerald-500 bg-emerald-50/30 font-bold text-emerald-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-xs">Hoạt động</div>
                  </div>

                  <div
                    onClick={() => handleChange("status", "DRAFT")}
                    className={`p-3 rounded-xl border text-center cursor-pointer select-none transition-colors ${
                      form.status === "DRAFT"
                        ? "border-slate-700 bg-slate-50 text-slate-800 font-bold"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-xs">Tạm ẩn</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCT IMAGES */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <ImageIcon size={18} className="text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Ảnh sản phẩm
              </h2>
            </div>

            {/* Mode Switcher */}
            <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setImageUploadMode("file")}
                className={`flex-1 py-1.5 rounded-md text-center cursor-pointer transition-colors ${
                  imageUploadMode === "file"
                    ? "bg-white text-indigo-600 shadow-sm font-bold"
                    : "text-slate-500"
                }`}
              >
                Tải tệp ảnh
              </button>
              <button
                type="button"
                onClick={() => setImageUploadMode("url")}
                className={`flex-1 py-1.5 rounded-md text-center cursor-pointer transition-colors ${
                  imageUploadMode === "url"
                    ? "bg-white text-indigo-600 shadow-sm font-bold"
                    : "text-slate-500"
                }`}
              >
                Nhập link URL
              </button>
            </div>

            <div className="space-y-4">
              {imageUploadMode === "file" ? (
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
                    className="border border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 rounded-xl p-5 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Upload size={18} className="text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-700">
                      Nhấp để chọn tệp ảnh
                    </span>
                    <span className="text-[10px] text-slate-400">
                      PNG, JPG, WEBP
                    </span>
                  </label>
                </div>
              ) : (
                <div className="space-y-2">
                  {form.coverImages.map((image, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={image}
                        onChange={(event) =>
                          handleCoverImageChange(index, event.target.value)
                        }
                        placeholder={
                          index === 0
                            ? "URL Ảnh bìa chính..."
                            : `URL Ảnh phụ ${index + 1}...`
                        }
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCoverImage(index)}
                        className="p-2 text-slate-400 hover:text-rose-600 border border-slate-200 rounded-xl bg-white hover:bg-rose-50 transition-colors shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddCoverImage}
                    className="w-full text-center py-2 border border-dashed border-indigo-200 rounded-xl text-xs font-medium text-indigo-600 hover:bg-indigo-50/50 transition-colors cursor-pointer"
                  >
                    + Thêm liên kết ảnh
                  </button>
                </div>
              )}

              {/* Previews Grid (An toàn với logic Index) */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Xem trước ({form.coverImages.filter(Boolean).length})
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {form.coverImages.some(Boolean) ? (
                    form.coverImages.map((image, index) => {
                      if (!image) return null;
                      return (
                        <div
                          key={`${image}-${index}`}
                          className="group relative h-20 border border-slate-200 bg-slate-50 p-1 rounded-xl overflow-hidden flex items-center justify-center"
                        >
                          <img
                            src={image}
                            alt=""
                            className="h-full w-full object-contain rounded-lg"
                          />
                          <div className="absolute top-1 left-1 bg-slate-900/70 text-white text-[8px] px-1 rounded">
                            {index === 0 ? "Chính" : `#${index + 1}`}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCoverImage(index)}
                            className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-700"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-3 text-center text-xs text-slate-400 py-4 border border-dashed border-slate-200 bg-slate-50 rounded-xl">
                      Chưa có ảnh nào.
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
