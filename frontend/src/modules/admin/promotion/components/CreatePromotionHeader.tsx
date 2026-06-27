import { ArrowLeft, Save, Tag } from "lucide-react";
import Button from "@/components/common/Button";
import { useNavigate } from "react-router-dom";

interface CreatePromotionHeaderProps {
  onSave?: () => void;
}

export default function CreatePromotionHeader({
  onSave,
}: CreatePromotionHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/admin/promotions");
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between card-custom">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
            <Tag size={22} />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Tạo chương trình khuyến mãi
          </h1>
        </div>

        <p className="text-sm text-slate-500">
          Điền đầy đủ thông tin bên dưới để thiết lập chương trình khuyến mãi
          mới cho sản phẩm.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          type="button"
          color="secondary"
          className="w-full sm:w-auto cursor-pointer"
          onClick={handleBack}
        >
          <ArrowLeft size={18} />
          Quay lại
        </Button>
        <Button
          type="submit"
          form="promotion-form"
          color="primary"
          className="w-full sm:w-auto cursor-pointer"
          onClick={onSave}
        >
          <Save size={18} />
          Lưu khuyến mãi
        </Button>
      </div>
    </div>
  );
}
