import { useState, useEffect, useRef } from "react";
import Modal from "@/components/common/Modal";
import TextAreaField from "@/components/common/TextAreaField";
import { Star, Camera, X, Eye, Pencil, Trash2 } from "lucide-react";
import type { OrderItemResponse } from "../types/order.type";
import { toast } from "react-toastify";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: OrderItemResponse | null;
}

interface ReviewImage {
  file: File;
  url: string;
}

const RATING_LABELS: Record<number, string> = {
  1: "Rất tệ",
  2: "Chưa hài lòng",
  3: "Bình thường",
  4: "Rất tốt",
  5: "Tuyệt vời",
};

const QUICK_SUGGESTIONS = [
  "Sách đóng gói cẩn thận",
  "Giao hàng siêu nhanh",
  "Chất lượng sách tuyệt vời",
  "Đúng mô tả sản phẩm",
  "Giá cả rất hợp lý",
  "Bìa sách đẹp, in sắc nét",
];

export function ReviewModal({ isOpen, onClose, item }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [images, setImages] = useState<ReviewImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xem lại ảnh lớn & Sửa/Thay thế ảnh
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Clean up Object URL khi unmount hoặc đổi danh sách ảnh
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.url?.startsWith("blob:")) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [images]);

  if (!item) return null;

  const product = item.productInfo;

  const handleTagToggle = (tag: string) => {
    let updatedTags: string[];
    if (selectedTags.includes(tag)) {
      updatedTags = selectedTags.filter((t) => t !== tag);
    } else {
      updatedTags = [...selectedTags, tag];
    }
    setSelectedTags(updatedTags);

    // Ghép các gợi ý chọn thành văn bản đánh giá
    setComment(updatedTags.join(". "));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const maxImages = 5;
    if (images.length >= maxImages) {
      toast.warning(`Bạn chỉ được tải lên tối đa ${maxImages} hình ảnh!`);
      return;
    }

    const availableSlots = maxImages - images.length;
    const selectedFiles = Array.from(files).slice(0, availableSlots);

    const newImages: ReviewImage[] = selectedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
    e.target.value = "";
  };

  const handleReplaceImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replaceIndex === null) return;

    setImages((prev) => {
      const target = prev[replaceIndex];
      if (target?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(target.url);
      }
      const updated = [...prev];
      updated[replaceIndex] = {
        file,
        url: URL.createObjectURL(file),
      };
      return updated;
    });

    setReplaceIndex(null);
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const target = prev[index];
      if (target?.url.startsWith("blob:")) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = () => {
    if (!comment.trim() && selectedTags.length === 0 && images.length === 0) {
      toast.warning("Vui lòng nhập nhận xét hoặc tải ảnh đánh giá!");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Cảm ơn bạn đã gửi đánh giá sản phẩm!");
      onClose();
      // Reset form
      setRating(5);
      setComment("");
      setSelectedTags([]);
      setImages([]);
    }, 600);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleSubmit}
        title="Đánh giá sản phẩm"
        confirmText={isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
        cancelText="Hủy"
        size="lg"
      >
        <div className="space-y-4">
          {/* Xem trước thông tin sản phẩm */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <img
              src={product?.urlImage}
              alt={product?.name}
              className="w-16 h-20 object-cover rounded-xl border border-slate-200 shrink-0 shadow-xs"
            />
            <div className="min-w-0 flex-1 space-y-1">
              <h4 className="font-bold text-base text-slate-900 line-clamp-2 leading-snug">
                {product?.name}
              </h4>
              <p className="text-sm font-medium text-slate-600">
                Số lượng: <span className="font-semibold text-slate-900">x{item.quantity}</span>
              </p>
            </div>
          </div>

          {/* Chọn 1-5 Sao */}
          <div className="text-center py-1 space-y-1">
            <p className="text-xs font-medium text-slate-600">
              Đánh giá chất lượng sản phẩm
            </p>
            <div className="flex justify-center items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => setRating(star)}
                  className="p-0.5 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                >
                  <Star
                    size={24}
                    className={`${
                      star <= (hoverRating ?? rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200 fill-slate-100"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-[11px] font-semibold text-amber-600 h-3.5">
              {RATING_LABELS[hoverRating ?? rating]}
            </p>
          </div>

          {/* Các gợi ý đánh giá nhanh */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-600">
              Gợi ý đánh giá nhanh:
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_SUGGESTIONS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload nhiều hình ảnh kèm Xem lại & Sửa ảnh */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-medium text-slate-600">
                Hình ảnh thực tế (tối đa 5 ảnh):
              </label>
              <span className="text-xs text-slate-400">
                {images.length}/5 hình ảnh
              </span>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              {/* Danh sách ảnh đã chọn */}
              {images.map((img, index) => (
                <div
                  key={index}
                  className="group relative w-20 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shrink-0 shadow-xs"
                >
                  <img
                    src={img.url}
                    alt={`Review ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                    {/* Nút Xem lại (Eye) */}
                    <button
                      type="button"
                      title="Xem lại ảnh"
                      onClick={() => setPreviewImage(img.url)}
                      className="w-7 h-7 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900 transition cursor-pointer"
                    >
                      <Eye size={14} />
                    </button>

                    {/* Nút Sửa/Thay thế (Pencil) */}
                    <button
                      type="button"
                      title="Sửa/Thay ảnh"
                      onClick={() => {
                        setReplaceIndex(index);
                        replaceFileInputRef.current?.click();
                      }}
                      className="w-7 h-7 rounded-full bg-blue-600/90 text-white flex items-center justify-center hover:bg-blue-700 transition cursor-pointer"
                    >
                      <Pencil size={13} />
                    </button>

                    {/* Nút Xóa (Trash) */}
                    <button
                      type="button"
                      title="Xóa ảnh"
                      onClick={() => handleRemoveImage(index)}
                      className="w-7 h-7 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-700 transition cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Nút Thêm ảnh */}
              {images.length < 5 && (
                <label className="w-20 h-20 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/30 text-slate-400 hover:text-indigo-600 transition cursor-pointer shrink-0">
                  <Camera size={22} />
                  <span className="text-xs mt-1 font-medium">Thêm ảnh</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Hidden input file để thay thế ảnh */}
          <input
            type="file"
            ref={replaceFileInputRef}
            hidden
            accept="image/*"
            onChange={handleReplaceImage}
          />

          {/* Nội dung nhận xét */}
          <TextAreaField
            label="Nhận xét chi tiết:"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Hãy chia sẻ nhận xét của bạn về sản phẩm nhé..."
          />
        </div>
      </Modal>

      {/* Lightbox Xem lại ảnh lớn */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-xl max-h-[85vh] flex items-center justify-center">
            <img
              src={previewImage}
              alt="Xem lại ảnh"
              className="max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-700 transition cursor-pointer shadow-md"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
