import React from "react";
import { Calendar, Edit, Trash2, Tag } from "lucide-react";
import { campaignTypeLabels, type PromotionResponse } from "../types/promotion.type";
import { BaseStatus, getBaseStatusLabel } from "@/types/status";

interface PromotionTableProps {
  promotions: PromotionResponse[];
  onEdit: (promo: PromotionResponse) => void;
  onDelete: (id: number) => void;
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

const PromotionTable: React.FC<PromotionTableProps> = ({
  promotions,
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
              Chương trình khuyến mãi
            </th>
            <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50">
              Mức giảm giá
            </th>
            <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50">
              Thời gian áp dụng
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
          {promotions.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-8 text-center text-slate-400">
                Không tìm thấy chương trình khuyến mãi nào.
              </td>
            </tr>
          ) : (
            promotions.map((promo, index) => (
              <tr
                key={promo.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="py-4 px-4 font-medium text-slate-600">
                  {(page - 1) * pageSize + index + 1}
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-slate-900">{promo.name}</span>
                    <span className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                      <Tag size={12} className="text-slate-500" />
                      {campaignTypeLabels[promo.promotionCampaignType] || promo.promotionCampaignType}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-700 font-semibold">
                  Giảm {promo.discountValue}%
                </td>
                <td className="py-4 px-4 text-slate-500">
                  <span className="inline-flex items-center gap-1.5 text-xs">
                    <Calendar size={14} className="text-slate-400" />
                    {promo.startDate} - {promo.endDate}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2.5 py-1 text-xs rounded-full ${statusClass(
                      promo.status
                    )}`}
                  >
                    {getBaseStatusLabel(promo.status)}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => onEdit(promo)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer"
                    >
                      <Edit size={13} />
                      Sửa
                    </button>
                    <button
                      onClick={() => onDelete(promo.id)}
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

export default PromotionTable;
