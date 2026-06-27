import React from "react";
import { Ticket, Plus, ArrowLeft } from "lucide-react";
import Button from "@/components/common/Button";

interface VoucherHeaderProps {
  viewState: "LIST" | "CREATE" | "EDIT";
  onBackToList: () => void;
  onCreateClick: () => void;
}

const VoucherHeader: React.FC<VoucherHeaderProps> = ({
  viewState,
  onBackToList,
  onCreateClick,
}) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between card-custom">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {viewState !== "LIST" ? (
            <button
              onClick={onBackToList}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all active:scale-90 mr-1 cursor-pointer"
              title="Quay lại danh sách"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <Ticket size={22} />
            </div>
          )}
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {viewState === "LIST"
              ? "Quản lý mã giảm giá (Voucher)"
              : viewState === "CREATE"
              ? "Tạo mã giảm giá mới"
              : "Cập nhật mã giảm giá"}
          </h1>
        </div>
        <p className="text-sm text-slate-500">
          {viewState === "LIST"
            ? "Thiết lập mã giảm giá, khấu trừ cho đơn hàng và quản lý tổng số lượng phát hành."
            : "Điền đầy đủ thông tin bên dưới để phát hành mã giảm giá cho đơn hàng."}
        </p>
      </div>

      {viewState === "LIST" && (
        <Button
          type="button"
          color="primary"
          className="w-full sm:w-auto cursor-pointer"
          onClick={onCreateClick}
        >
          <Plus size={18} />
          Thêm Voucher
        </Button>
      )}
    </div>
  );
};

export default VoucherHeader;
