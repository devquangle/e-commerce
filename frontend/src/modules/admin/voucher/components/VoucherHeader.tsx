import { Ticket, Plus } from "lucide-react";
import Button from "@/components/common/Button";

interface VoucherHeaderProps {
  onCreate: () => void;
}

export default function VoucherHeader({
  onCreate,
}: VoucherHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between card-custom">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
            <Ticket size={22} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Quản lý mã giảm giá
          </h1>
        </div>
        <p className="text-sm text-slate-500">
          Thiết lập mã giảm giá, khấu trừ cho đơn hàng và quản lý tổng số lượng phát hành.
        </p>
      </div>

      <Button
        type="button"
        color="primary"
        className="w-full sm:w-auto cursor-pointer"
        onClick={onCreate}
      >
        <Plus size={18} />
        Thêm Voucher
      </Button>
    </div>
  );
}
