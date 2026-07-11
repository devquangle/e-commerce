import React, { useState } from "react";
import { Calendar, Edit, Trash2, ChevronDown } from "lucide-react";
import { BaseStatus, getBaseStatusLabel } from "@/types/status";
import type { VoucherResponse } from "../types/voucher.type";
import { formatMoney } from "@/utils/number.utils";
import { formatToMMDDYYYY } from "@/utils/formatDate.utils";

interface VoucherMobileCardProps {
  vouchers: VoucherResponse[];
  onEdit: (voucher: VoucherResponse) => void;
  onDelete: (voucher: VoucherResponse) => void;
}

const statusClass = (status: BaseStatus) => {
  switch (status) {
    case BaseStatus.ACTIVE:
      return "bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold";
    case BaseStatus.INACTIVE:
      return "bg-amber-50 text-amber-700 border border-amber-200/60 font-semibold";
    case BaseStatus.DELETED:
      return "bg-rose-50 text-rose-700 border border-rose-200/60 font-semibold";
    default:
      return "bg-slate-100 text-slate-600 border border-slate-200 font-semibold";
  }
};

const DiscountExample: React.FC<{ voucher: VoucherResponse }> = ({ voucher }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (voucher.discountValue > 100) return null; // Chỉ hiển thị ví dụ cho voucher %

  const percentDiscount = (voucher.minOrderValue * voucher.discountValue) / 100;
  const maxDiscount = voucher.maxDiscountValue || percentDiscount;
  
  const appliedDiscount = Math.min(percentDiscount, maxDiscount);
  const isMaxApplied = maxDiscount < percentDiscount && voucher.maxDiscountValue > 0;

  return (
    <div className="mt-2 flex flex-col items-start border-t border-slate-50 pt-2">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center gap-1 text-[11px] text-indigo-600 font-medium cursor-pointer hover:text-indigo-800 transition-colors select-none"
      >
        <span>{isExpanded ? 'Thu gọn' : 'Xem ví dụ'}</span>
        <ChevronDown size={13} className={`transition-transform duration-300 ease-in-out ${isExpanded ? 'rotate-180' : ''}`} />
      </div>
      
      <div 
        className={`grid transition-all duration-300 ease-in-out w-full ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="p-2 bg-indigo-50/40 border border-indigo-100/50 rounded-lg text-xs text-indigo-700">
            <p className="font-semibold mb-1">VD đơn {formatMoney(voucher.minOrderValue)}:</p>
            <ul className="list-disc list-inside space-y-0.5 text-indigo-500">
              <li>{voucher.discountValue}% là: {formatMoney(percentDiscount)}</li>
              {voucher.maxDiscountValue > 0 && <li>Tối đa là: {formatMoney(voucher.maxDiscountValue)}</li>}
              <li className="font-medium text-indigo-700 mt-1">
                =&gt; Giảm: {formatMoney(appliedDiscount)} 
                <span className="font-normal italic text-indigo-500 ml-1">
                  ({isMaxApplied ? 'Áp dụng tối đa' : 'Áp dụng theo %'})
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const VoucherMobileCard: React.FC<VoucherMobileCardProps> = ({
  vouchers,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-4 md:hidden">
      {vouchers.length === 0 ? (
        <div className="text-center py-8 text-slate-400 bg-white rounded-xl border border-slate-100">
          Không tìm thấy mã giảm giá nào.
        </div>
      ) : (
        vouchers.map((voucher) => (
          <div
            key={voucher.code}
            className="rounded-xl border border-slate-150 bg-white p-4 shadow-sm space-y-3"
          >
            {/* CODE & STATUS */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="inline-block self-start px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-mono font-bold">
                  {voucher.code}
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {voucher.name}
                </span>
              </div>

              <span
                className={`text-xs px-2.5 py-0.5 rounded-full ${statusClass(
                  voucher.status
                )}`}
              >
                {getBaseStatusLabel(voucher.status)}
              </span>
            </div>

            {/* DETAILS */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Trị giá giảm:</span>
                <span className="text-slate-800 font-bold">
                  {voucher.discountValue <= 100
                    ? `Giảm ${voucher.discountValue}%`
                    : `Giảm ${formatMoney(voucher.discountValue)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Đơn tối thiểu:</span>
                <span className="text-slate-700 font-semibold">
                  {formatMoney(voucher.minOrderValue)}
                </span>
              </div>
              <DiscountExample voucher={voucher} />
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Thời gian:</span>
                <span className="text-slate-700 font-medium text-xs flex items-center gap-1">
                  <Calendar size={13} className="text-slate-400" />
                  {formatToMMDDYYYY(voucher.startDate)} - {formatToMMDDYYYY(voucher.endDate)}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-50 pt-2 items-start">
                <span className="text-slate-500 font-medium mt-0.5">Lượt sử dụng:</span>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-slate-800 font-bold">
                    {voucher.usedCount}/{voucher.usageLimit} lượt
                  </span>
                  {voucher.usageLimitPerUser > 0 && (
                    <span className="text-[11px] text-slate-500 font-medium">
                      (Tối đa {voucher.usageLimitPerUser} lượt/user)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onEdit(voucher)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <Edit size={13} />
                Sửa
              </button>
              <button
                onClick={() => onDelete(voucher)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-100 bg-rose-50/50 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer"
              >
                <Trash2 size={13} />
                Xóa
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default VoucherMobileCard;
