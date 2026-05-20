import { useState, useMemo } from "react";
import { 
  Tag, 
  Activity, 
  Plus, 
  Search, 
  RotateCcw, 
  Edit, 
  Trash2, 
  Calendar, 
  ShoppingBag,
  Coins
} from "lucide-react";

type PromotionItem = {
  code: string;
  discount: string;
  period: string;
  status: "Đang chạy" | "Sắp chạy" | "Đã kết thúc";
  usageCount: number;
};

const initialPromotions: PromotionItem[] = [
  { code: "SUMMER10", discount: "Giảm 10%", period: "01/05/2026 - 31/05/2026", status: "Đang chạy", usageCount: 145 },
  { code: "FREESHIP50", discount: "Miễn phí ship", period: "05/05/2026 - 20/05/2026", status: "Sắp chạy", usageCount: 0 },
  { code: "VIP20", discount: "Giảm 20%", period: "01/04/2026 - 30/04/2026", status: "Đã kết thúc", usageCount: 389 },
];

export default function Promotion() {
  const [promotions] = useState<PromotionItem[]>(initialPromotions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredPromotions = useMemo(() => {
    return promotions.filter((promo) => {
      const matchSearch = promo.code.toLowerCase().includes(search.toLowerCase().trim());
      const matchStatus = statusFilter === "ALL" ? true : promo.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [promotions, search, statusFilter]);

  const handleResetFilter = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  const statusClass = (status: PromotionItem["status"]) => {
    switch (status) {
      case "Đang chạy":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold";
      case "Sắp chạy":
        return "bg-amber-50 text-amber-700 border border-amber-200/60 font-semibold";
      case "Đã kết thúc":
        return "bg-slate-100 text-slate-600 border border-slate-200 font-semibold";
      default:
        return "bg-slate-100 text-slate-600 border border-slate-200 font-semibold";
    }
  };

  return (
    <section className="space-y-6 p-4 md:p-6 flex-1">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <Tag size={22} />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Quản lý khuyến mãi</h1>
          </div>
          <p className="text-sm text-slate-500">Thiết lập mã giảm giá, chiết khấu và theo dõi hiệu suất các chiến dịch.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 transform active:scale-95 cursor-pointer">
          <Plus size={18} />
          Tạo khuyến mãi
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100/50 flex items-center justify-between hover:scale-[1.02] transition-all duration-300">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-500">Chiến dịch đang chạy</p>
            <p className="text-3xl font-extrabold text-slate-900">12</p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <Activity size={24} />
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100/50 flex items-center justify-between hover:scale-[1.02] transition-all duration-300">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-500">Lượt dùng hôm nay</p>
            <p className="text-3xl font-extrabold text-slate-900">327</p>
          </div>
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <ShoppingBag size={24} />
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100/50 flex items-center justify-between hover:scale-[1.02] transition-all duration-300 sm:col-span-2 lg:col-span-1">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-500">Doanh thu từ ưu đãi</p>
            <p className="text-3xl font-extrabold text-slate-900">54.200.000đ</p>
          </div>
          <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
            <Coins size={24} />
          </div>
        </article>
      </div>

      {/* FILTER & DATA */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100/50">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo mã khuyến mãi..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* Status dropdown */}
          <div className="w-full md:w-56">
            <select 
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 cursor-pointer"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="Đang chạy">Đang chạy</option>
              <option value="Sắp chạy">Sắp chạy</option>
              <option value="Đã kết thúc">Đã kết thúc</option>
            </select>
          </div>

          {/* Reset button */}
          <button
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
            onClick={handleResetFilter}
          >
            <RotateCcw size={16} />
            Làm mới
          </button>
        </div>

        {/* ===================== DESKTOP TABLE ===================== */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50 first:rounded-l-lg last:rounded-r-lg">Mã Code</th>
                <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50">Ưu đãi / Chiết khấu</th>
                <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50">Thời gian áp dụng</th>
                <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50">Lượt đã dùng</th>
                <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50">Trạng thái</th>
                <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPromotions.map((promo) => (
                <tr key={promo.code} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="inline-block px-2 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-mono">
                      {promo.code}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-700 font-semibold">{promo.discount}</td>
                  <td className="py-4 px-4 text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={14} className="text-slate-400" />
                      {promo.period}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-700 font-medium">{promo.usageCount} lượt</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full ${statusClass(promo.status)}`}>
                      {promo.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="inline-flex gap-2">
                      <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer">
                        <Edit size={13} />
                        Sửa
                      </button>
                      <button className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer">
                        <Trash2 size={13} />
                        Dừng
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===================== MOBILE CARD ===================== */}
        <div className="space-y-4 md:hidden">
          {filteredPromotions.map((promo) => (
            <div
              key={promo.code}
              className="rounded-xl border border-slate-150 bg-white p-4 shadow-sm space-y-3"
            >
              {/* CODE & STATUS */}
              <div className="flex justify-between items-center">
                <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-mono font-bold">
                  {promo.code}
                </span>

                <span className={`text-xs px-2.5 py-0.5 rounded-full ${statusClass(promo.status)}`}>
                  {promo.status}
                </span>
              </div>

              {/* DETAILS */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Ưu đãi:</span>
                  <span className="text-slate-800 font-bold">{promo.discount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Thời gian:</span>
                  <span className="text-slate-700 font-medium text-xs flex items-center gap-1">
                    <Calendar size={13} className="text-slate-400" />
                    {promo.period}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-50 pt-2">
                  <span className="text-slate-500 font-medium">Lượt sử dụng:</span>
                  <span className="text-slate-800 font-bold">{promo.usageCount} lượt</span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-3 flex gap-2">
                <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer">
                  <Edit size={13} />
                  Sửa
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-100 bg-rose-50/50 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer">
                  <Trash2 size={13} />
                  Dừng
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
