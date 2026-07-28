import { useState } from "react";
import Modal from "@/components/common/Modal";
import TextAreaField from "@/components/common/TextAreaField";
import { Frown } from "lucide-react";
import { showWarningToast } from "@/utils/toastUtil";
import { useCancelOrder } from "@/modules/user/order/hooks/useOrder";

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderCode: string | null;
  onSuccess?: () => void;
}

const CANCEL_REASON_SUGGESTIONS = [
  "Muốn áp dụng mã giảm giá khác",
  "Muốn thay đổi phương thức thanh toán",
  "Đã tìm thấy sản phẩm giá tốt hơn",
  "Đổi ý, không muốn mua nữa",
  "Đặt nhầm/Đặt trùng đơn hàng",
  "Thời gian giao hàng quá lâu",
];

export function CancelOrderModal({
  isOpen,
  onClose,
  orderCode,
  onSuccess,
}: CancelOrderModalProps) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState<string>("");

  const cancelOrderMutation = useCancelOrder();

  if (!orderCode) return null;

  const handleToggleReason = (reason: string) => {
    let updated: string[];
    if (selectedReasons.includes(reason)) {
      updated = selectedReasons.filter((r) => r !== reason);
    } else {
      updated = [...selectedReasons, reason];
    }
    setSelectedReasons(updated);
    setCustomReason(updated.join("; "));
  };

  const handleConfirm = () => {
    const finalReason = customReason.trim() || selectedReasons.join("; ");

    if (!finalReason) {
      showWarningToast("Vui lòng chọn hoặc nhập lý do hủy đơn hàng!");
      return;
    }

    cancelOrderMutation.mutate(
      {
        orderCode,
        cancel: finalReason,
      },
      {
        onSuccess: () => {
          onClose();
          setSelectedReasons([]);
          setCustomReason("");
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Xác nhận hủy đơn hàng"
      confirmText="Xác nhận hủy đơn"
      cancelText="Quay lại"
      size="lg"
    >
      <div className="space-y-4">
        {/* Warning Banner */}
        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200/70 text-amber-800">
          <Frown size={50} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-md space-y-0.5">
            <p className="font-semibold text-amber-900">
              Bạn có chắc chắn muốn hủy đơn hàng #{orderCode}?
            </p>
            <p className="text-amber-700">
              Hành động này không thể hoàn tác sau khi xác nhận.
            </p>
          </div>
        </div>

        {/* Quick Reason Suggestions */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-600">
            Gợi ý lý do hủy đơn:
          </label>
          <div className="flex flex-wrap gap-2">
            {CANCEL_REASON_SUGGESTIONS.map((tag) => {
              const isSelected = selectedReasons.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleToggleReason(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-red-50 border-red-500 text-red-700 font-semibold shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Reason Textarea */}
        <TextAreaField
          label="Lý do khác (nếu có):"
          rows={4}
          value={customReason}
          onChange={(e) => setCustomReason(e.target.value)}
          placeholder="Chia sẻ lý do cụ thể của bạn..."
        />
      </div>
    </Modal>
  );
}
