import React, { useState } from "react";
import { Calendar, Edit, Trash2, ChevronDown } from "lucide-react";
import type { VoucherResponse } from "../types/voucher.type";
import { BaseStatus, getBaseStatusLabel } from "@/types/status";
import { formatMoney } from "@/utils/number.utils";
import { formatToMMDDYYYY } from "@/utils/formatDate.utils";

interface VoucherTableProps {
  vouchers: VoucherResponse[];
  onEdit: (voucher: VoucherResponse) => void;
  onDelete: (voucher: VoucherResponse) => void;
  page: number;
  pageSize: number;
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
    <div className="mt-1.5 flex flex-col items-start">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center gap-1 text-[11px] text-indigo-600 font-medium cursor-pointer hover:text-indigo-800 transition-colors select-none"
      >
        <span>{isExpanded ? 'Thu gọn' : 'Xem ví dụ'}</span>
        <ChevronDown size={13} className={`transition-transform duration-300 ease-in-out ${isExpanded ? 'rotate-180' : ''}`} />
      </div>
      
      <div 
        className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-1.5' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="p-2 bg-indigo-50/40 border border-indigo-100/50 rounded-lg text-[11px] text-indigo-700">
            <p className="font-semibold mb-0.5">VD đơn {formatMoney(voucher.minOrderValue)}:</p>
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

const VoucherTable: React.FC<VoucherTableProps> = ({
  vouchers,
  onEdit,
  onDelete,
  page,
  pageSize,
}) => {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-slate-500">
            <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50 first:rounded-l-lg">
              STT
            </th>
            <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50">
              Mã Voucher / Tên
            </th>
            <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50">
              Trị giá giảm / Điều kiện
            </th>
            <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50">
              Thời hạn
            </th>
            <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50">
              Số lượng đã dùng
            </th>
            <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50">
              Trạng thái
            </th>
            <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50 text-right last:rounded-r-lg">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {vouchers.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-8 text-center text-slate-400">
                Không tìm thấy mã giảm giá nào.
              </td>
            </tr>
          ) : (
            vouchers.map((voucher, index) => (
              <tr
                key={voucher.code}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="py-4 px-4 font-medium text-slate-600">
                  {(page - 1) * pageSize + index + 1}
                </td>
                <td className="py-4 px-4 font-bold text-slate-900">
                  <div className="flex flex-col gap-0.5">
                    <span className="inline-block self-start px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold">
                      {voucher.code}
                    </span>
                    <span className="text-xs text-slate-600 font-medium">
                      {voucher.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-700 font-bold">
                      {voucher.discountValue <= 100
                        ? `Giảm ${voucher.discountValue}%`
                        : `Giảm ${formatMoney(voucher.discountValue)}`}
                      {voucher.maxDiscountValue && voucher.maxDiscountValue > 0 && voucher.discountValue <= 100 ? (
                        <span className="ml-1 text-[10px] text-slate-500 font-normal">
                          (Tối đa: {formatMoney(voucher.maxDiscountValue)})
                        </span>
                      ) : null}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Đơn từ: <span className="text-slate-700">{formatMoney(voucher.minOrderValue)}</span>
                    </span>
                    <DiscountExample voucher={voucher} />
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-500">
                  <span className="inline-flex items-center gap-1.5 text-xs">
                    <Calendar size={14} className="text-slate-400" />
                    {formatToMMDDYYYY(voucher.startDate)} - {formatToMMDDYYYY(voucher.endDate)}
                  </span>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-slate-700 font-medium">
                      {voucher.usedCount}/{voucher.usageLimit} lượt
                    </span>
                    {voucher.usageLimitPerUser > 0 && (
                      <span className="text-[11px] text-slate-500">
                        (Tối đa {voucher.usageLimitPerUser} lượt/user)
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2.5 py-1 text-xs rounded-full ${statusClass(
                      voucher.status
                    )}`}
                  >
                    {getBaseStatusLabel(voucher.status)}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => onEdit(voucher)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer"
                    >
                      <Edit size={13} />
                      Sửa
                    </button>
                    <button
                      onClick={() => onDelete(voucher)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer"
                    >
                      <Trash2 size={13} />
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VoucherTable;
