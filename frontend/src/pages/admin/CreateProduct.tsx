import { useState } from "react";
import ProductDescriptionEditor from "../../components/admin/ProductDescriptionEditor";

type CreateBookForm = {
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

const initialForm: CreateBookForm = {
  title: "",
  slug: "",
  sku: "",
  author: "",
  publisher: "",
  genre: "",
  language: "Tiếng Việt",
  publishYear: "",
  pages: "",
  price: "",
  compareAtPrice: "",
  stock: "",
  status: "DRAFT",
  shortDescription: "",
  description: "",
  coverImages: [""],
};

export default function CreateProduct() {
  const [form, setForm] = useState<CreateBookForm>(initialForm);

  const handleChange = <K extends keyof CreateBookForm>(key: K, value: CreateBookForm[K]) => {
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
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thêm sách mới</h1>
          <p className="text-sm text-gray-500">Tạo sản phẩm sách để hiển thị trên cửa hàng.</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Lưu nháp
          </button>
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Tạo sản phẩm
          </button>
        </div>
      </div>

      <form className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Thông tin cơ bản</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              type="text"
              value={form.title}
              onChange={(event) => handleChange("title", event.target.value)}
              placeholder="Tên sách"
              className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2 md:col-span-2"
            />
            <input
              type="text"
              value={form.slug}
              onChange={(event) => handleChange("slug", event.target.value)}
              placeholder="Slug URL (vd: dac-nhan-tam)"
              className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
            />
            <input
              type="text"
              value={form.sku}
              onChange={(event) => handleChange("sku", event.target.value)}
              placeholder="Mã SKU"
              className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
            />
            <input
              type="text"
              value={form.author}
              onChange={(event) => handleChange("author", event.target.value)}
              placeholder="Tác giả"
              className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
            />
            <input
              type="text"
              value={form.publisher}
              onChange={(event) => handleChange("publisher", event.target.value)}
              placeholder="Nhà xuất bản"
              className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
            />
            <input
              type="text"
              value={form.genre}
              onChange={(event) => handleChange("genre", event.target.value)}
              placeholder="Thể loại"
              className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
            />
            <input
              type="text"
              value={form.language}
              onChange={(event) => handleChange("language", event.target.value)}
              placeholder="Ngôn ngữ"
              className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
            />
            <input
              type="number"
              value={form.publishYear}
              onChange={(event) => handleChange("publishYear", event.target.value)}
              placeholder="Năm xuất bản"
              className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
            />
            <input
              type="number"
              value={form.pages}
              onChange={(event) => handleChange("pages", event.target.value)}
              placeholder="Số trang"
              className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
            />
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Giá và tồn kho</h2>
          <div className="space-y-3">
            <input
              type="number"
              value={form.price}
              onChange={(event) => handleChange("price", event.target.value)}
              placeholder="Giá bán (VND)"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
            />
            <input
              type="number"
              value={form.compareAtPrice}
              onChange={(event) => handleChange("compareAtPrice", event.target.value)}
              placeholder="Giá gốc (nếu có)"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
            />
            <input
              type="number"
              value={form.stock}
              onChange={(event) => handleChange("stock", event.target.value)}
              placeholder="Số lượng tồn kho"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
            />
            <select
              value={form.status}
              onChange={(event) => handleChange("status", event.target.value as CreateBookForm["status"])}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
            >
              <option value="DRAFT">Bản nháp</option>
              <option value="ACTIVE">Đang bán</option>
              <option value="OUT_OF_STOCK">Hết hàng</option>
            </select>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Mô tả sách</h2>
          <div className="space-y-3">
            <textarea
              rows={3}
              value={form.shortDescription}
              onChange={(event) => handleChange("shortDescription", event.target.value)}
              placeholder="Mô tả ngắn (hiển thị ở danh sách)"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
            />
            <ProductDescriptionEditor
              value={form.description}
              onChange={(value) => handleChange("description", value)}
            />
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Ảnh sản phẩm</h2>
          <div className="space-y-3">
            {form.coverImages.map((image, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={image}
                  onChange={(event) => handleCoverImageChange(index, event.target.value)}
                  placeholder={`Dán URL ảnh ${index + 1}`}
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCoverImage(index)}
                  className="rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Xóa
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddCoverImage}
              className="w-full rounded-lg border border-dashed px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
            >
              + Thêm ảnh
            </button>
            <div className="grid grid-cols-2 gap-3">
              {form.coverImages.filter(Boolean).length > 0 ? (
                form.coverImages
                  .filter(Boolean)
                  .map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="flex h-32 items-center justify-center rounded-lg border border-dashed bg-gray-50 p-2"
                    >
                      <img src={image} alt={`Preview ảnh ${index + 1}`} className="h-full rounded object-contain" />
                    </div>
                  ))
              ) : (
                <p className="col-span-2 text-center text-sm text-gray-500">
                  Chưa có ảnh. Nhập URL để xem preview.
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
