import React from "react";
import { Ticket, CheckCircle2, DollarSign } from "lucide-react";

interface VoucherStatsProps {
  totalIssued: number;
  totalRedeemed: number;
  totalSavedAmount: string;
}

const VoucherStats: React.FC<VoucherStatsProps> = ({
  totalIssued,
  totalRedeemed,
  totalSavedAmount,
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100/50 flex items-center justify-between hover:scale-[1.02] transition-all duration-300">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-500">Mã đang phát hành</p>
          <p className="text-3xl font-extrabold text-slate-900">{totalIssued}</p>
        </div>
        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <Ticket size={24} />
        </div>
      </article>

      <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100/50 flex items-center justify-between hover:scale-[1.02] transition-all duration-300">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-500">Đã áp dụng cho đơn</p>
          <p className="text-3xl font-extrabold text-slate-900">{totalRedeemed} lượt</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
          <CheckCircle2 size={24} />
        </div>
      </article>

      <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100/50 flex items-center justify-between hover:scale-[1.02] transition-all duration-300 sm:col-span-2 lg:col-span-1">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-500">Tổng giá trị trợ giá</p>
          <p className="text-3xl font-extrabold text-slate-900">{totalSavedAmount}</p>
        </div>
        <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
          <DollarSign size={24} />
        </div>
      </article>
    </div>
  );
};

export default VoucherStats;
