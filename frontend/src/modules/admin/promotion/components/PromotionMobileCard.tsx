import React from "react";
import { Calendar, Edit, Trash2, Tag } from "lucide-react";
import { campaignTypeLabels, type PromotionResponse } from "../types/promotion.type";
import { BaseStatus, getBaseStatusLabel } from "@/types/status";
import { formatToMMDDYYYY } from "@/utils/formatDate.utils";

interface PromotionMobileCardProps {
  promotions: PromotionResponse[];
  onEdit: (promo: PromotionResponse) => void;
  onDelete: (id: number) => void;
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

const PromotionMobileCard: React.FC<PromotionMobileCardProps> = ({
  promotions,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-4 md:hidden">
      {promotions.length === 0 ? (
        <div className="text-center py-8 text-slate-400 bg-white rounded-xl border border-slate-100">
          Không tìm thấy chương trình khuyến mãi nào.
        </div>
      ) : (
        promotions.map((promo) => (
          <div
            key={promo.id}
            className="rounded-xl border border-slate-150 bg-white p-4 shadow-sm space-y-3"
          >
            {/* ID & STATUS */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1.5 flex-1 min-w-0 pr-2">
                <span className="inline-block self-start px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-mono font-bold">
                  #{promo.id}
                </span>
                <span className="text-sm font-bold text-slate-900 leading-tight">
                  {promo.name}
                </span>
                <span className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                  <Tag size={12} className="text-slate-500" />
                  {campaignTypeLabels[promo.promotionCampaignType] || promo.promotionCampaignType}
                </span>
              </div>

              <span
                className={`text-xs px-2.5 py-0.5 rounded-full shrink-0 ${statusClass(
                  promo.status
                )}`}
              >
                {getBaseStatusLabel(promo.status)}
              </span>
            </div>

            {/* DETAILS */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Thời gian:</span>
                <span className="text-slate-700 font-medium text-xs flex items-center gap-1">
                  <Calendar size={13} className="text-slate-400" />
                  {formatToMMDDYYYY(promo.startDate)} - {formatToMMDDYYYY(promo.endDate)}
                </span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onEdit(promo)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <Edit size={13} />
                Sửa
              </button>
              <button
                onClick={() => onDelete(promo.id)}
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

export default PromotionMobileCard;
