import { ArrowLeft, Save, Tag } from "lucide-react";
import Button from "@/components/common/Button";
interface VoucherHeaderUpdateProps {
  id?: number | string;
  onBack?: () => void;
  onSave?: () => void;
}

export default function VoucherHeaderUpdate({
  id,
  onBack,
  onSave,
}: VoucherHeaderUpdateProps) {

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between card-custom">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
            <Tag size={22} />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Cập nhật khuyến mãi {id ? `#${id}` : ""}
          </h1>
        </div>

        <p className="text-sm text-slate-500">
          Hiệu chỉnh thông số và thông tin cho chương trình khuyến mãi.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          type="button"
          color="secondary"
          className="w-full sm:w-auto cursor-pointer"
          onClick={onBack}
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
          Cập nhật
        </Button>
      </div>
    </div>
  );
}
