import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Trash2,
  Plus,
  Eye,
  Pencil,
  Image as ImageIcon,
} from "lucide-react";
import { showWarningToast } from "@/utils/toastUtil";
import type { ImageProductRequest } from "@/types/image";

interface MultipleImageUploadProps {
  images: ImageProductRequest[];
  onChange: (images: ImageProductRequest[]) => void;
  maxImages?: number;
  maxFileSizeMB?: number;
  isSubmitted?: boolean;
  label?: string;
}

export default function MultipleImageUpload({
  images = [],
  onChange,
  maxImages = 6,
  maxFileSizeMB = 1,
  isSubmitted = false,
  label = "Ảnh sản phẩm",
}: MultipleImageUploadProps) {
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const [imageUploadMode, setImageUploadMode] = useState<"file" | "url">(
    "file",
  );
  const [imageUrl, setImageUrl] = useState("");
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

  // Clean up Object URL khi unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.url?.startsWith("blob:")) URL.revokeObjectURL(img.url);
      });
    };
  }, [images]);

  // Xử lý khi chọn nhiều file từ máy tính
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    if (images.length >= maxImages) {
      showWarningToast(
        `Bạn chỉ được phép tải lên tối đa ${maxImages} hình ảnh.`,
      );
      return;
    }

    const availableSlots = maxImages - images.length;
    const filesToUpload = Array.from(files).slice(0, availableSlots);

    const validFiles: File[] = [];
    for (const file of filesToUpload) {
      if (file.size > maxFileSizeBytes) {
        showWarningToast(
          `Ảnh "${file.name}" vượt quá ${maxFileSizeMB}MB và đã bị bỏ qua.`,
        );
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) return;

    const newImages: ImageProductRequest[] = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isThumbnail: false,
    }));

    if (!images.some((img) => img.isThumbnail) && newImages.length > 0) {
      newImages[0].isThumbnail = true;
    }

    onChange([...images, ...newImages]);
    e.target.value = "";
  };

  // Xử lý thêm ảnh bằng đường dẫn URL
  const handleAddImageUrl = () => {
    const trimmedUrl = imageUrl.trim();
    if (!trimmedUrl) return;

    try {
      const url = new URL(trimmedUrl);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    } catch {
      showWarningToast("URL ảnh không hợp lệ.");
      return;
    }

    if (images.length >= maxImages) {
      showWarningToast(`Danh sách đã đạt tối đa ${maxImages} hình ảnh.`);
      return;
    }

    const newImage: ImageProductRequest = {
      url: trimmedUrl,
      isThumbnail:
        images.length === 0 || !images.some((img) => img.isThumbnail),
    };

    onChange([...images, newImage]);
    setImageUrl("");
  };

  // Xử lý xóa 1 ảnh
  const handleRemoveImage = (index: number) => {
    const imageToRemove = images[index];
    if (imageToRemove.url?.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    const updatedImages = images.filter((_, i) => i !== index);
    if (imageToRemove.isThumbnail && updatedImages.length > 0) {
      updatedImages[0].isThumbnail = true;
    }

    onChange(updatedImages);
  };

  // Xử lý thay thế file ảnh
  const handleReplaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replaceIndex === null) return;

    if (file.size > maxFileSizeBytes) {
      showWarningToast(
        `Hình ảnh thay thế phải có kích thước dưới ${maxFileSizeMB}MB!`,
      );
      e.target.value = "";
      return;
    }

    const oldImage = images[replaceIndex];
    if (oldImage.url?.startsWith("blob:")) {
      URL.revokeObjectURL(oldImage.url);
    }

    const newImage: ImageProductRequest = {
      file,
      url: URL.createObjectURL(file),
      isThumbnail: oldImage.isThumbnail,
    };

    const updatedImages = [...images];
    updatedImages[replaceIndex] = newImage;

    onChange(updatedImages);
    setReplaceIndex(null);
    e.target.value = "";
  };

  // Chọn ảnh làm thumbnail (đại diện)
  const handleSelectThumbnail = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      isThumbnail: i === index,
    }));
    onChange(updated);
  };

  return (
    <div className="col-span-12 card-custom space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <ImageIcon size={18} className="text-indigo-600" />
        <h2 className="text-base font-bold text-slate-900">{label}</h2>
      </div>

      {/* Tabs điều hướng mode upload */}
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
          Nhập URL
        </button>
      </div>

      {/* Mode Tải file / Mode Nhập URL */}
      {imageUploadMode === "file" ? (
        <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-500 transition">
          <Upload size={28} className="text-slate-400 mb-2" />
          <span className="text-sm text-slate-600">Chọn ảnh từ máy tính</span>
          <span className="text-xs text-slate-400 mt-1">
            PNG, JPG, WEBP (tối đa {maxFileSizeMB}MB)
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddImageUrl();
              }
            }}
            placeholder="https://example.com/image.jpg"
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

      {/* Grid danh sách ảnh */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {images.map((image, index) => (
            <div
              key={index}
              className={`group relative aspect-square rounded-xl overflow-hidden border-2 bg-slate-50 ${
                image.isThumbnail
                  ? "border-indigo-500 ring-2 ring-indigo-100"
                  : "border-slate-200"
              }`}
            >
              <img
                src={image.url || ""}
                alt={`Ảnh ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

              {/* Nút chọn ảnh đại diện */}
              <button
                type="button"
                onClick={() => handleSelectThumbnail(index)}
                className={`absolute top-2 left-2 text-[10px] font-medium px-2 py-1 rounded-md shadow-sm transition ${
                  image.isThumbnail
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-slate-700 hover:bg-indigo-50"
                }`}
              >
                {image.isThumbnail ? "Đại diện" : "Chọn"}
              </button>

              {/* Action buttons (Preview, Replace, Delete) */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition">
                <button
                  type="button"
                  title="Xem ảnh"
                  onClick={() => setPreviewImage(image.url || "")}
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-white hover:bg-slate-700 shadow-sm cursor-pointer"
                >
                  <Eye size={12} />
                </button>
                <button
                  type="button"
                  title="Thay thế ảnh"
                  onClick={() => {
                    setReplaceIndex(index);
                    replaceFileInputRef.current?.click();
                  }}
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
                >
                  <Pencil size={12} />
                </button>
                {!image.isThumbnail && (
                  <button
                    type="button"
                    title="Xóa ảnh"
                    onClick={() => handleRemoveImage(index)}
                    className="flex items-center justify-center w-7 h-7 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {index + 1}/{maxImages}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input thay thế ẩn */}
      <input
        type="file"
        ref={replaceFileInputRef}
        hidden
        accept="image/*"
        onChange={handleReplaceFileChange}
      />

      {/* Validation Message khi đã submit mà chưa chọn ảnh */}
      {isSubmitted && images.length === 0 && (
        <div className="text-center text-sm py-8 border border-dashed rounded-xl border-red-500 text-red-500 bg-red-50">
          Chưa có ảnh nào được thêm
          <p className="mt-2 text-xs font-medium text-red-500">
            Vui lòng thêm ít nhất một ảnh sản phẩm!
          </p>
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-10000 flex items-center justify-center bg-black/85 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setPreviewImage(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-slate-900/50 hover:bg-slate-900/80 p-2.5 rounded-full transition-colors cursor-pointer"
            onClick={() => setPreviewImage(null)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="max-w-[90%] max-h-[90%] flex items-center justify-center p-4">
            <img
              src={previewImage}
              alt="Xem ảnh lớn"
              className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl border border-slate-800"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}