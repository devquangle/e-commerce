import React, { useState } from "react";
import { Upload, Trash2, Plus } from "lucide-react";

// Khai báo kiểu dữ liệu cho từng item trong danh sách
type ImageItem = {
  id: string;            // ID ngẫu nhiên để render danh sách
  file: File | null;     // Chứa file nếu nạp từ máy tính
  url: string;           // Chứa chuỗi URL nếu nạp từ link web hoặc link preview blob
};

type MultipleImageUploadProps = {
  images: ImageItem[];
  setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
};

export default function MultipleImageUpload({ images, setImages }: MultipleImageUploadProps) {
  const [imageUploadMode, setImageUploadMode] = useState<"file" | "url">("file");
  const [tempImageUrl, setTempImageUrl] = useState("");

  // Hàm xử lý khi người dùng chọn nhiều file từ máy tính
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newItems: ImageItem[] = newFiles.map((file) => ({
        id: crypto.randomUUID(),
        file: file,
        url: URL.createObjectURL(file), // Tạo link blob tạm thời hiển thị UI
      }));
      setImages((prev) => [...prev, ...newItems]);
    }
    e.target.value = ""; // Reset để có thể chọn lại chính file đó
  };

  // Hàm xử lý thêm ảnh bằng đường dẫn URL
  const handleAddImageUrl = () => {
    if (tempImageUrl.trim()) {
      const newItem: ImageItem = {
        id: crypto.randomUUID(),
        file: null,
        url: tempImageUrl.trim(),
      };
      setImages((prev) => [...prev, newItem]);
      setTempImageUrl("");
    }
  };

  // Xóa một ảnh bất kỳ trong mảng
  const handleRemoveImage = (id: string, file: File | null, url: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    // Nếu là link blob tự tạo thì thu hồi để giải phóng ram
    if (file && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-slate-700">Bộ sưu tập hình ảnh</label>

      {/* Tabs điều hướng */}
      <div className="flex rounded-lg bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setImageUploadMode("file")}
          className={`flex-1 py-2 rounded-md text-sm transition ${
            imageUploadMode === "file"
              ? "bg-white shadow text-indigo-600 font-semibold"
              : "text-slate-500"
          }`}
        >
          Tải tệp ảnh
        </button>
        <button
          type="button"
          onClick={() => setImageUploadMode("url")}
          className={`flex-1 py-2 rounded-md text-sm transition ${
            imageUploadMode === "url"
              ? "bg-white shadow text-indigo-600 font-semibold"
              : "text-slate-500"
          }`}
        >
          Nhập URL ảnh
        </button>
      </div>

      {/* Khung tương tác đẩy dữ liệu đầu vào */}
      {imageUploadMode === "file" ? (
        <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-500 transition bg-slate-50/50">
          <Upload size={24} className="text-slate-400 mb-1" />
          <span className="text-sm text-slate-600">Thêm nhiều tệp ảnh</span>
          <input
            type="file"
            multiple // Cho phép chọn nhiều file cùng lúc
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={tempImageUrl}
            onChange={(e) => setTempImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddImageUrl();
              }
            }}
            placeholder="Dán link ảnh sản phẩm..."
            className="flex-1 h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={handleAddImageUrl}
            className="px-4 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 flex items-center gap-1"
          >
            <Plus size={16} /> Thêm
          </button>
        </div>
      )}

      {/* KHU VỰC HIỂN THỊ THƯ VIỆN ẢNH (GRID SYSTEM) */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group aspect-square rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shadow-sm"
            >
              <img
                src={img.url}
                alt="gallery-item"
                className="w-full h-full object-cover"
              />
              {/* Lớp Overlay nút xóa xuất hiện khi hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center">
                <button
                  type="button"
                  title="Xóa ảnh này"
                  onClick={() => handleRemoveImage(img.id, img.file, img.url)}
                  className="bg-rose-500 text-white p-2 rounded-xl hover:bg-rose-600 transition shadow-lg opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}