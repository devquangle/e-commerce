import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatMoney } from './../../utils/number.utils';

interface PriceBreakdownProps {
  selectedCount: number;
  subtotal: number;
  discount: number;       // Giảm giá trực tiếp trên sản phẩm
  voucherDiscount?: number; // Giảm giá theo Voucher
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
  voucherDiscount = 0,
  total,
  hasSelected,
  primaryAction,
  backLink,
  isCheckout = false,
  onClick,
}: PriceBreakdownProps) {
  
  const buttonText = isCheckout ? `Đặt mua (${selectedCount})` : "Tiến hành thanh toán";

  return (
    /* 🌟 ĐPÉD TẠI ĐÂY: Sử dụng class card-custom và giảm space-y xuống space-y-4 cho nhỏ gọn */
    <div className="card-custom h-full flex flex-col justify-between space-y-4 ">
      <div className="space-y-4 p-2">
        {/* Thu nhỏ title từ text-lg xuống text-base */}
        <h2 className="text-base font-bold text-slate-900">Tóm tắt đơn hàng</h2>

        {/* Hạ size chữ tổng thể phần chi tiết từ text-sm xuống text-sm  để thanh thoát hơn */}
        <div className="space-y-3 text-sm ">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Sách đã chọn</span>
            <span className="font-semibold text-slate-900 tabular-nums">
              {selectedCount} cuốn
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Tạm tính</span>
            <span className="font-semibold text-slate-900 tabular-nums">
              {formatMoney(subtotal)}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Giảm giá sản phẩm</span>
              <span className="font-semibold text-green-600 tabular-nums">
                -{formatMoney(discount)}
              </span>
            </div>
          )}

          {isCheckout && voucherDiscount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Mã giảm giá (Voucher)</span>
              <span className="font-semibold text-green-600 tabular-nums">
                -{formatMoney(voucherDiscount)}
              </span>
            </div>
          )}

          {isCheckout && (
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Phí vận chuyển</span>
              <span className="font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded text-[11px]">
                Miễn phí
              </span>
            </div>
          )}
        </div>

        {/* Giảm bớt padding-top (pt-3) */}
        <div className="border-t border-dashed border-slate-200/80 pt-3 flex justify-between items-baseline">
          {/* text-base -> text-sm */}
          <span className="text-sm font-bold text-slate-900">Tổng cộng</span>
          <div className="text-right">
            {/* text-xl -> text-lg, block -> inline */}
            <span className="text-lg font-black text-red-600 tracking-tight tabular-nums block">
              {formatMoney(total)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4 mt-auto">
        {primaryAction ?? (
          hasSelected ? (
            <button
              type="button"
              onClick={onClick}
              /* 🌟 ĐPÉD: Hạ py-3.5 xuống py-2.5, text-base xuống text-sm, rounded-xl xuống rounded-lg cho đồng bộ */
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-red-600 py-2.5 text-sm font-bold text-white shadow-md shadow-red-600/10 transition duration-200 hover:bg-red-700 active:scale-[0.99]"
            >
              {buttonText}
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              disabled
              /* 🌟 ĐPÉD: Đồng bộ tương tự nút bên trên */
              className="w-full rounded-lg bg-slate-100 py-2.5 text-sm font-bold text-slate-400 cursor-not-allowed transition duration-200"
            >
              Chọn sản phẩm để đặt mua
            </button>
          )
        )}

        {backLink && (
          <Link
            to={backLink.to}
            /* text-sm -> text-sm  */
            className="flex items-center justify-center text-sm  text-slate-500 hover:text-slate-800 font-semibold transition duration-200 py-0.5"
          >
            {backLink.label}
          </Link>
        )}
      </div>
    </div>
  );
}