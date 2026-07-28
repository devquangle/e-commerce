import { BookOpen, Save, ArrowLeft, Eye, RotateCcw } from "lucide-react";
import Button from "@/components/common/Button";

interface ProductHeaderAddProps {
  title?: string;
  subtitle?: string;
  onBack: () => void;
  onReset: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

export default function ProductHeaderAdd({
  title = "Thêm sách mới",
  subtitle = "Điền đầy đủ thông tin bên dưới và tải ảnh để khởi tạo sản phẩm sách mới trong hệ thống.",
  onBack,
  onReset,
  onSubmit,
  isSubmitting = false,
  submitButtonText = "Lưu sản phẩm",
}: ProductHeaderAddProps) {
  return (
    <div className="col-span-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between card-custom">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
            <BookOpen size={22} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h1>
        </div>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          type="button"
          color="secondary"
          className="w-full sm:w-auto cursor-pointer"
          onClick={onBack}
        >
          <ArrowLeft size={18} /> Quay lại
        </Button>
        <Button
          type="button"
          color="secondary"
          className="w-full sm:w-auto cursor-pointer"
        >
          <Eye size={18} /> Xem nháp
        </Button>
        <Button
          type="button"
          onClick={onReset}
          color="warning"
          className="w-full sm:w-auto cursor-pointer"
        >
          <RotateCcw size={18} /> Đặt lại
        </Button>
        <Button
          type={onSubmit ? "button" : "submit"}
          onClick={onSubmit}
          color="primary"
          className="w-full sm:w-auto cursor-pointer"
          disabled={isSubmitting}
        >
          <Save size={18} /> {isSubmitting ? "Đang lưu..." : submitButtonText}
        </Button>
      </div>
    </div>
  );
}
