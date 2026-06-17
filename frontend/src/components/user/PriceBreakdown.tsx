import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatMoney } from './../../utils/number.utils';

interface PriceBreakdownProps {
  selectedCount: number;
  subtotal: number;
  discount: number;       // Giảm giá trực tiếp trên sản phẩm
  voucherDiscount?: number; // ✨ Khai báo thêm prop giảm giá theo Voucher
  total: number;
  hasSelected: boolean;
  primaryAction?: ReactNode;
  backLink?: { to: string; label: string };
  isCheckout?: boolean;
  onClick?: () => void;
}

export function PriceBreakdown({
  selectedCount,
  subtotal,
  discount,
  voucherDiscount = 0, // Mặc định bằng 0 nếu không truyền
  total,
  hasSelected,
  primaryAction,
  backLink,
  isCheckout = false,
  onClick,
}: PriceBreakdownProps) {
  
  const buttonText = isCheckout ? `Đặt mua (${selectedCount})` : "Tiến hành thanh toán";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)] space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Tóm tắt đơn hàng</h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Sách đã chọn</span>
            <span className="font-semibold text-slate-900 tabular-nums">
              {selectedCount} cuốn
            </span>
          </div>
          
          {/* Tạm tính (Giá gốc ban đầu) */}
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Tạm tính</span>
            <span className="font-semibold text-slate-900 tabular-nums">
              {formatMoney(subtotal)}
            </span>
          </div>

          {/* Giảm giá trực tiếp của hệ thống sản phẩm */}
          {discount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Giảm giá sản phẩm</span>
              <span className="font-semibold text-green-600 tabular-nums">
                -{formatMoney(discount)}
              </span>
            </div>
          )}

          {/* ✨ Voucher áp dụng thêm: Chỉ hiển thị khi số tiền voucher > 0 */}
          {isCheckout && voucherDiscount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Mã giảm giá (Voucher)</span>
              <span className="font-semibold text-green-600 tabular-nums">
                -{formatMoney(voucherDiscount)}
              </span>
            </div>
          )}

          {/* Phí vận chuyển */}
          {isCheckout && (
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Phí vận chuyển</span>
              <span className="font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-lg text-xs">
                Miễn phí
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-dashed border-slate-200/80 pt-4 flex justify-between items-baseline">
          <span className="text-base font-bold text-slate-900">Tổng cộng</span>
          <div className="text-right">
            <span className="text-2xl font-black text-red-600 tracking-tight tabular-nums block">
              {formatMoney(total)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-1">
        {primaryAction ?? (
          hasSelected ? (
            <button
              type="button"
              onClick={onClick}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-base font-bold text-white shadow-md shadow-red-600/10 transition duration-200 hover:bg-red-700 hover:shadow-lg active:scale-[0.99]"
            >
              {buttonText}
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="w-full rounded-xl bg-slate-100 py-3.5 text-base font-bold text-slate-400 cursor-not-allowed transition duration-200"
            >
              Chọn sản phẩm để đặt mua
            </button>
          )
        )}

        {backLink && (
          <Link
            to={backLink.to}
            className="flex items-center justify-center text-sm text-slate-500 hover:text-slate-800 font-semibold transition duration-200 py-1"
          >
            {backLink.label}
          </Link>
        )}
      </div>
    </div>
  );
}