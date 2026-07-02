import React from "react";
import { Receipt, ArrowUpRight } from "lucide-react";

const transactions = [
  { id: "#GD4501", customer: "Nguyễn Minh Tuấn", product: "Combo 5 cuốn Kỹ Năng Sống", amount: "1.250.000đ", date: "02/07/2026", status: "Hoàn thành" },
  { id: "#GD4500", customer: "Lê Hoàng Yến", product: "Bộ Harry Potter (7 tập)", amount: "2.100.000đ", date: "02/07/2026", status: "Hoàn thành" },
  { id: "#GD4499", customer: "Trần Quốc Bảo", product: "Sapiens + Homo Deus", amount: "480.000đ", date: "01/07/2026", status: "Đang xử lý" },
  { id: "#GD4498", customer: "Phạm Thu Hà", product: "Đắc Nhân Tâm (Bìa cứng)", amount: "189.000đ", date: "01/07/2026", status: "Hoàn thành" },
];

const RevenueTransactions: React.FC = () => {
  return (
    <div className="card-custom">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Receipt className="text-indigo-600" size={20} />
          <h2 className="text-lg font-bold text-slate-900">Giao dịch gần đây</h2>
        </div>
        <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer">
          Xem tất cả
        </button>
      </div>

      {/* Transaction List */}
      <div className="flex flex-col gap-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="group flex items-center gap-4 rounded-xl p-3 transition-all duration-200 hover:bg-slate-50 cursor-pointer"
          >
            {/* Transaction Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">
                  {tx.id}
                </span>
                <span className="text-sm font-semibold text-slate-800 truncate">
                  {tx.customer}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">{tx.product}</p>
            </div>

            {/* Amount + Date + Status */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-600">{tx.amount}</p>
                <p className="text-[11px] text-slate-400">{tx.date}</p>
              </div>

              {/* Status Badge */}
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${
                  tx.status === "Hoàn thành"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {tx.status}
              </span>

              {/* Detail Link */}
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all duration-200">
                <ArrowUpRight size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueTransactions;
