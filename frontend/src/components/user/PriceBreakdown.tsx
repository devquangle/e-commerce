import { useState, type ReactNode } from "react";
import { ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { formatMoney } from './../../utils/number.utils';

interface PriceBreakdownProps {
  selectedCount: number;
  subtotal: number;
  discount: number;       // Giảm giá trực tiếp trên sản phẩm
  voucherDiscount?: number; // Giảm giá theo Voucher
  shippingFee?: number;   // Phí vận chuyển
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
  shippingFee = 0,
  total,
  hasSelected,
  primaryAction,
  backLink,
  isCheckout = false,
  onClick,
}: PriceBreakdownProps) {
  const [showDiscountDetails, setShowDiscountDetails] = useState(false);
  const buttonText = isCheckout ? "Xác nhận đặt hàng" : "Tiến hành thanh toán";
  const totalDiscount = discount + voucherDiscount;

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

          {totalDiscount > 0 && (
            <div className="space-y-1">
              <button 
                type="button"
                onClick={() => setShowDiscountDetails(!showDiscountDetails)}
                className="flex w-full justify-between items-center group cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 group-hover:text-slate-700 transition">Giảm giá</span>
                  {showDiscountDetails ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                </div>
                <span className="font-semibold text-green-600 tabular-nums">
                  -{formatMoney(totalDiscount)}
                </span>
              </button>

              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  showDiscountDetails ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-2 pl-3 border-l-[1.5px] border-slate-100 ml-1 py-1">
                    {discount > 0 && (
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-slate-400">Sản phẩm</span>
                        <span className="font-medium text-green-600 tabular-nums">
                          -{formatMoney(discount)}
                        </span>
                      </div>
                    )}
                    {isCheckout && voucherDiscount > 0 && (
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-slate-400">Voucher</span>
                        <span className="font-medium text-green-600 tabular-nums">
                          -{formatMoney(voucherDiscount)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isCheckout && (
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Phí vận chuyển</span>
              {shippingFee > 0 ? (
                <span className="font-medium text-slate-900 tabular-nums">
                  {formatMoney(shippingFee)}
                </span>
              ) : (
                <span className="font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded text-[11px]">
                  Miễn phí
                </span>
              )}
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
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-red-600 py-2.5 text-sm font-bold text-white shadow-md shadow-red-600/10 transition duration-200 hover:bg-red-700 active:scale-[0.99]"
            >
              {buttonText}
              {!isCheckout && <ChevronRight size={16} />}
            </button>
          ) : (
            <button
              type="button"
              disabled
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