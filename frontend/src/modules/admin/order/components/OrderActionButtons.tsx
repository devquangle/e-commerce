import { useState, useRef, useEffect } from "react";
import { MoreVertical, Check, Eye, Trash2 } from "lucide-react";
import type { OrderResponse } from "../types/order.type";

type Props = {
  item: OrderResponse;
  onApprove?: (item: OrderResponse) => void;
  onCancel?: (item: OrderResponse) => void;
  onViewDetail?: (item: OrderResponse) => void;
  mobile?: boolean;
};

export default function OrderActionButtons({
  item,
  onApprove,
  onCancel,
  onViewDetail,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isPending = item.status === "PENDING";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* 3-DOTS BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center justify-center p-1 lg:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all cursor-pointer active:scale-95 bg-white"
        title="Thao tác"
      >
        <MoreVertical className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-1 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-150">
          {onViewDetail && (
            <button
              type="button"
              onClick={() => {
                onViewDetail(item);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer text-left"
            >
              <Eye size={14} className="text-slate-500 shrink-0" />
              Chi tiết
            </button>
          )}

          {onApprove && isPending && (
            <button
              type="button"
              onClick={() => {
                onApprove(item);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer text-left"
            >
              <Check size={14} className="shrink-0" />
              Duyệt đơn
            </button>
          )}

          {onCancel && isPending && (
            <button
              type="button"
              onClick={() => {
                onCancel(item);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-left"
            >
              <Trash2 size={14} className="shrink-0" />
              Hủy đơn
            </button>
          )}
        </div>
      )}
    </div>
  );
}
