import { useState } from "react";
import ProductDescriptionEditor from "../../components/admin/ProductDescriptionEditor";
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
  X
} from "lucide-react";
import { Link } from "react-router-dom";

type UpdateBookForm = {
  title: string;
  slug: string;
  sku: string;
  author: string;
  publisher: string;
  genre: string;
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

const existingBook: UpdateBookForm = {
  title: "Nhà Giả Kim",
  slug: "nha-gia-kim",
  sku: "BK1024",
  author: "Paulo Coelho",
  publisher: "NXB Hội Nhà Văn",
  genre: "Văn học",
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

  const handleChange = <K extends keyof UpdateBookForm>(key: K, value: UpdateBookForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

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
      form.coverImages.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  return (
    <section className="space-y-6 p-4 md:p-6 flex-1 max-w-7xl mx-auto">
      {/* HEADER BREADCRUMB */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between flex-none">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Link to="/admin/products" className="hover:text-indigo-600 transition">Sách</Link>
            <ChevronRight size={12} />
            <span className="text-slate-600">Chỉnh sửa</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Link 
              to="/admin/products" 
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 active:scale-95 transition cursor-pointer"
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
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition cursor-pointer"
          >
            <X size={16} />
            Hủy bỏ
          </Link>
          <button className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:shadow-lg hover:from-indigo-500 hover:to-violet-500 active:scale-95 transition cursor-pointer">
            <Save size={16} />
            Lưu thay đổi
          </button>
        </div>
      </div>

      {/* FORM BODY */}
      <form className="grid gap-6 lg:grid-cols-3" onSubmit={(e) => e.preventDefault()}>
        
        {/* LEFT COLUMN (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* BASIC INFORMATION */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 md:p-6 shadow-sm shadow-slate-100/50 space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-50">
              <div className="rounded-lg bg-indigo-50 p-1.5 text-indigo-600">
                <BookOpen size={18} />
              </div>
              <h2 className="text-base font-bold text-slate-900">Thông tin cơ bản</h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tên sách</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => handleChange("title", event.target.value)}
                  placeholder="Nhập tên đầy đủ của tác phẩm sách..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Đường dẫn thân thiện (Slug URL)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(event) => handleChange("slug", event.target.value)}
                  placeholder="Ví dụ: dac-nhan-tam-bia-cung"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Mã định danh (SKU)</label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(event) => handleChange("sku", event.target.value)}
                  placeholder="Ví dụ: BK-DACNHANTAM-01"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tác giả</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(event) => handleChange("author", event.target.value)}
                  placeholder="Nhập tên tác giả..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nhà xuất bản</label>
                <input
                  type="text"
                  value={form.publisher}
                  onChange={(event) => handleChange("publisher", event.target.value)}
                  placeholder="Nhập nhà xuất bản..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Thể loại</label>
                <input
                  type="text"
                  value={form.genre}
                  onChange={(event) => handleChange("genre", event.target.value)}
                  placeholder="Chọn hoặc nhập thể loại..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Ngôn ngữ</label>
                <input
                  type="text"
                  value={form.language}
                  onChange={(event) => handleChange("language", event.target.value)}
                  placeholder="Ví dụ: Tiếng Việt, Tiếng Anh..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Năm xuất bản</label>
                <input
                  type="number"
                  value={form.publishYear}
                  onChange={(event) => handleChange("publishYear", event.target.value)}
                  placeholder="Ví dụ: 2026"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Số trang</label>
                <input
                  type="number"
                  value={form.pages}
                  onChange={(event) => handleChange("pages", event.target.value)}
                  placeholder="Ví dụ: 350"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>

          {/* PRODUCT DESCRIPTION */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 md:p-6 shadow-sm shadow-slate-100/50 space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-50">
              <div className="rounded-lg bg-indigo-50 p-1.5 text-indigo-600">
                <FileText size={18} />
              </div>
              <h2 className="text-base font-bold text-slate-900">Mô tả chi tiết</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Mô tả ngắn</label>
                <textarea
                  rows={2}
                  value={form.shortDescription}
                  onChange={(event) => handleChange("shortDescription", event.target.value)}
                  placeholder="Mô tả tóm tắt nội dung sách (hiển thị trên trang danh mục tìm kiếm)..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 resize-none"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Mô tả đầy đủ</label>
                <ProductDescriptionEditor
                  value={form.description}
                  onChange={(value) => handleChange("description", value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (1/3 width on large screens) */}
        <div className="space-y-6">
          
          {/* PRICE AND STOCK */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 md:p-6 shadow-sm shadow-slate-100/50 space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-50">
              <div className="rounded-lg bg-indigo-50 p-1.5 text-indigo-600">
                <DollarSign size={18} />
              </div>
              <h2 className="text-base font-bold text-slate-900">Giá bán & Tồn kho</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Giá bán (VND)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(event) => handleChange("price", event.target.value)}
                  placeholder="Ví dụ: 95000"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Giá so sánh / Giá gốc (VND)</label>
                <input
                  type="number"
                  value={form.compareAtPrice}
                  onChange={(event) => handleChange("compareAtPrice", event.target.value)}
                  placeholder="Ví dụ: 120000"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Số lượng trong kho</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(event) => handleChange("stock", event.target.value)}
                  placeholder="Ví dụ: 100"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Trạng thái hiển thị</label>
                <select
                  value={form.status}
                  onChange={(event) => handleChange("status", event.target.value as UpdateBookForm["status"])}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 cursor-pointer"
                >
                  <option value="DRAFT">Bản nháp</option>
                  <option value="ACTIVE">Đang bán trên web</option>
                  <option value="OUT_OF_STOCK">Tạm hết hàng</option>
                </select>
              </div>
            </div>
          </div>

          {/* PRODUCT IMAGES */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 md:p-6 shadow-sm shadow-slate-100/50 space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-50">
              <div className="rounded-lg bg-indigo-50 p-1.5 text-indigo-600">
                <ImageIcon size={18} />
              </div>
              <h2 className="text-base font-bold text-slate-900">Ảnh bìa & Minh họa</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                {form.coverImages.map((image, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={image}
                      onChange={(event) => handleCoverImageChange(index, event.target.value)}
                      placeholder={`Dán URL hình ảnh ${index + 1}`}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCoverImage(index)}
                      className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 active:scale-95 transition cursor-pointer flex items-center justify-center shrink-0"
                      title="Xóa ảnh này"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddCoverImage}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/20 px-3 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
              >
                <Plus size={16} />
                Thêm liên kết ảnh
              </button>

              {/* Cover previews grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {form.coverImages.filter(Boolean).length > 0 ? (
                  form.coverImages
                    .filter(Boolean)
                    .map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="group relative h-28 flex items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-2 overflow-hidden"
                      >
                        <img 
                          src={image} 
                          alt={`Preview ảnh ${index + 1}`} 
                          className="h-full w-full object-contain rounded transition duration-300 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <span className="text-[10px] bg-slate-900/80 text-white font-semibold px-2 py-0.5 rounded-full">Ảnh {index + 1}</span>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="col-span-2 text-center text-xs text-slate-400 py-6 border border-dashed border-slate-100 bg-slate-50/50 rounded-xl">
                    Chưa có ảnh. Vui lòng nhập URL ảnh ở trên để xem trước.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
