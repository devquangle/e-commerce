import { 
  Download, 
  DollarSign, 
  ShoppingBag, 
  RefreshCw, 
  BarChart3, 
  TrendingUp,
  Percent
} from "lucide-react";

export default function Revenue() {
  const monthlyRevenue = [
    { month: "Tháng 1", revenue: 220, growth: "+6%", isGrowth: true },
    { month: "Tháng 2", revenue: 245, growth: "+11%", isGrowth: true },
    { month: "Tháng 3", revenue: 278, growth: "+13%", isGrowth: true },
    { month: "Tháng 4", revenue: 260, growth: "-6%", isGrowth: false },
    { month: "Tháng 5", revenue: 302, growth: "+16%", isGrowth: true },
    { month: "Tháng 6", revenue: 335, growth: "+11%", isGrowth: true },
  ];

  const maxRevenue = Math.max(...monthlyRevenue.map((item) => item.revenue));

  return (
    <section className="space-y-6 p-2 sm:p-4">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Báo cáo doanh thu</h1>
          <p className="mt-1 text-sm text-slate-500">
            Tổng hợp doanh thu nhà sách theo tháng từ website và đơn hàng trực tiếp.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all duration-200 cursor-pointer active:scale-95">
          <Download size={16} />
          Tải báo cáo PDF
        </button>
      </div>

      {/* METRIC CARDS */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* DOANH THU THÁNG NÀY */}
        <article className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="absolute top-0 inset-x-0 h-1 bg-indigo-500" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Doanh thu tháng này</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-slate-900">335.000.000đ</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              <TrendingUp size={12} />
              +11%
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">so với tháng trước</p>
        </article>

        {/* GIÁ TRỊ ĐƠN TRUNG BÌNH */}
        <article className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Giá trị đơn trung bình</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-slate-900">215.000đ</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              <TrendingUp size={12} />
              +4.2%
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">so với tháng trước</p>
        </article>

        {/* TỶ LỆ HOÀN ĐƠN */}
        <article className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="absolute top-0 inset-x-0 h-1 bg-rose-500" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Tỷ lệ hoàn đơn</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Percent size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-slate-900">1.6%</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
              <RefreshCw size={12} className="animate-spin-slow" />
              -0.3%
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">so với tháng trước</p>
        </article>
      </div>

      {/* CHART SECTION */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-2">
            <BarChart3 className="text-indigo-600" size={20} />
            <h2 className="text-lg font-bold text-slate-900">Biểu đồ cột doanh thu theo tháng</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Đơn vị tính: Triệu VNĐ (tr)</span>
        </div>

        {/* CHART GRID */}
        <div className="grid grid-cols-6 items-end gap-2 sm:gap-4 border-b border-slate-100 pb-4 h-64">
          {monthlyRevenue.map((row) => {
            const height = Math.round((row.revenue / maxRevenue) * 100);

            return (
              <div key={row.month} className="flex flex-col items-center gap-3 group h-full justify-end">
                {/* Bar Value Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-lg shadow-sm mb-1 z-10 translate-y-1 group-hover:translate-y-0 transform transition-transform">
                  {row.revenue}tr
                </div>

                {/* Column */}
                <div className="w-full flex h-48 items-end justify-center">
                  <div
                    className="w-8 sm:w-16 rounded-t-xl bg-gradient-to-t from-indigo-500 via-indigo-600 to-violet-600 transition-all duration-300 hover:scale-x-105 hover:from-indigo-600 hover:to-violet-700 shadow-sm hover:shadow-md cursor-pointer origin-bottom"
                    style={{ height: `${height}%` }}
                    title={`${row.month}: ${row.revenue} triệu (${row.growth})`}
                  />
                </div>

                {/* Month Name */}
                <span className="text-[11px] sm:text-sm font-semibold text-slate-700 truncate max-w-full">
                  {row.month}
                </span>

                {/* Growth Pill */}
                <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] sm:text-xs font-bold ${
                  row.isGrowth ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                }`}>
                  {row.growth}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
