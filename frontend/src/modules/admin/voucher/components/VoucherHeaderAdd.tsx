import { ArrowLeft, Save, Ticket, RefreshCw } from "lucide-react";
import Button from "@/components/common/Button";

interface VoucherHeaderAddProps {
  onSave?: () => void;
  onBack?: () => void;
  onReset?: () => void;
}


export default function VoucherHeaderAdd({
  onSave,
  onBack,
  onReset,
}: VoucherHeaderAddProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between card-custom">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
            <Ticket size={22} />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Tạo Voucher giảm giá
          </h1>
        </div>

        <p className="text-sm text-slate-500">
          Điền đầy đủ thông tin bên dưới để thiết lập mã giảm giá mới.
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
          type="button"
          color="secondary"
          className="w-full sm:w-auto cursor-pointer"
          onClick={onReset}
        >
          <RefreshCw size={18} />
          Làm mới
        </Button>
        <Button
          type="button"
          color="primary"
          className="w-full sm:w-auto cursor-pointer"
          onClick={onSave}
        >
          <Save size={18} />
          Lưu Voucher
        </Button>
      </div>
    </div>
  );
}
