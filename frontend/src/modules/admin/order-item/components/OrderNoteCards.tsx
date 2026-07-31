import { AlertCircle, FileText } from "lucide-react";
import type { OrderResponse } from "../../order/types/order.type";

interface OrderNoteCardsProps {
  orderInfo: OrderResponse;
}

export default function OrderNoteCards({ orderInfo }: OrderNoteCardsProps) {
  const hasCancelReason = Boolean(
    orderInfo.cancel && orderInfo.cancel.trim() !== ""
  );
  const hasNote = Boolean(orderInfo.noted && orderInfo.noted.trim() !== "");

  if (!hasCancelReason && !hasNote) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Card Lý do hủy đơn */}
      {hasCancelReason && (
        <div className="bg-red-50/80 border border-red-200/80 rounded-xl p-4 flex items-start gap-3 text-red-900 shadow-2xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="font-bold text-sm text-red-950 flex items-center gap-2">
              🚫 Lý do hủy đơn hàng
            </h3>
            <p className="text-sm text-red-800 leading-relaxed font-medium">
              {orderInfo.cancel}
            </p>
          </div>
        </div>
      )}

      {/* Card Ghi chú đơn hàng */}
      {hasNote && (
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3 text-amber-900 shadow-2xs">
          <FileText className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="font-bold text-sm text-amber-950 flex items-center gap-2">
              📝 Ghi chú đơn hàng
            </h3>
            <p className="text-sm text-amber-800 leading-relaxed font-medium">
              {orderInfo.noted}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
