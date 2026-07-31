import { useState } from "react";
import Modal from "@/components/common/Modal";
import TextAreaField from "@/components/common/TextAreaField";
import { AlertTriangle } from "lucide-react";
import { showWarningToast } from "@/utils/toastUtil";
import { useCancelOrder } from "../hooks/useOrder";
import type { OrderResponse } from "../types/order.type";

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderResponse | null;
  onSuccess?: () => void;
}

const CANCEL_REASON_SUGGESTIONS = [
  "Sản phẩm hết hàng trong kho",
  "Khách hàng yêu cầu hủy đơn qua điện thoại/chat",
  "Không liên lạc được với khách hàng để xác nhận",
  "Sai thông tin địa chỉ / số điện thoại người nhận",
  "Đơn hàng nghi ngờ gian lận / Đặt ảo",
  "Không thể vận chuyển tới khu vực này",
];

export function CancelOrderModal({
  isOpen,
  onClose,
  order,
  onSuccess,
}: CancelOrderModalProps) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState<string>("");

  const cancelOrderMutation = useCancelOrder();

  if (!order) return null;

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
        orderCode: order.orderCode,
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
      title="Xác nhận hủy đơn hàng (Admin)"
      confirmText={cancelOrderMutation.isPending ? "Đang xử lý..." : "Xác nhận hủy đơn"}
      cancelText="Quay lại"
      size="lg"
    >
      <div className="space-y-4">
        {/* Warning Banner */}
        <div className="flex items-start gap-3 p-3.5 bg-rose-50 rounded-xl border border-rose-200/80 text-rose-900">
          <AlertTriangle size={24} className="text-rose-600 shrink-0 mt-0.5" />
          <div className="text-sm space-y-0.5">
            <p className="font-semibold text-rose-900">
              Bạn có chắc chắn muốn hủy đơn hàng #{order.orderCode}?
            </p>
            <p className="text-rose-700 text-xs">
              Hành động này sẽ cập nhật trạng thái đơn hàng thành Hủy và không thể hoàn tác.
            </p>
          </div>
        </div>

        {/* Quick Reason Suggestions */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Gợi ý lý do hủy đơn (Admin):
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
                      ? "bg-rose-50 border-rose-500 text-rose-700 font-semibold shadow-xs"
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
          label="Lý do chi tiết khác (nếu có):"
          rows={3}
          value={customReason}
          onChange={(e) => setCustomReason(e.target.value)}
          placeholder="Nhập chi tiết ghi chú lý do hủy đơn..."
        />
      </div>
    </Modal>
  );
}
