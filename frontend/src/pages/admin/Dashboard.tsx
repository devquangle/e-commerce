import { 
  Banknote, 
  ShoppingBag, 
  AlertCircle, 
  UserPlus, 
  TrendingUp, 
  TrendingDown, 
  FileSpreadsheet,
  ArrowUpRight
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    { 
      label: "Doanh thu hôm nay", 
      value: "24.500.000đ", 
      trend: "+12%", 
      isPositive: true,
      icon: Banknote,
      accentClass: "bg-indigo-500",
      iconColor: "text-indigo-600 bg-indigo-50"
    },
    { 
      label: "Đơn hàng mới", 
      value: "86", 
      trend: "+9%", 
      isPositive: true,
      icon: ShoppingBag,
      accentClass: "bg-emerald-500",
      iconColor: "text-emerald-600 bg-emerald-50"
    },
    { 
      label: "Sản phẩm sắp hết", 
      value: "14", 
      trend: "-3%", 
      isPositive: false,
      icon: AlertCircle,
      accentClass: "bg-rose-500",
      iconColor: "text-rose-600 bg-rose-50"
    },
    { 
      label: "Khách hàng mới", 
      value: "32", 
      trend: "+5%", 
      isPositive: true,
      icon: UserPlus,
      accentClass: "bg-amber-500",
      iconColor: "text-amber-600 bg-amber-50"
    },
  ];

  const recentOrders = [
    { id: "#DH1024", customer: "Nguyen Van A", total: "1.200.000đ", status: "Đã giao" },
    { id: "#DH1023", customer: "Tran Thi B", total: "860.000đ", status: "Đang xử lý" },
    { id: "#DH1022", customer: "Le Van C", total: "430.000đ", status: "Chờ xác nhận" },
    { id: "#DH1021", customer: "Pham Thi D", total: "2.100.000đ", status: "Đã hủy" },
  ];

  const statusBadgeClass = (status: string) => {
    switch (status) {
      case "Đã giao":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Đang xử lý":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Chờ xác nhận":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Đã hủy":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  return (
    <section className="space-y-6 p-2 sm:p-4">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Dashboard quản trị</h1>
          <p className="mt-1 text-sm text-slate-500">Tổng quan nhanh hoạt động cửa hàng hôm nay.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all duration-200 cursor-pointer active:scale-95">
          <FileSpreadsheet size={16} />
          Xuất báo cáo
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <article 
              key={item.label} 
              className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-slate-200"
            >
              {/* Top Accent Line */}
              <div className={`absolute top-0 inset-x-0 h-1 ${item.accentClass}`} />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">{item.label}</span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconColor} transition-transform`}>
                  <Icon size={20} />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <p className="text-2xl font-bold tracking-tight text-slate-900">{item.value}</p>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  item.isPositive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                }`}>
                  {item.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {item.trend}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400">so với hôm qua</p>
            </article>
          );
        })}
      </div>

      {/* RECENT ORDERS & GOALS */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* RECENT ORDERS */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Đơn hàng gần đây</h2>
            <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 flex items-center gap-1 group">
              Xem chi tiết <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
          
          {/* ===================== DESKTOP TABLE ===================== */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="pb-3 font-semibold">Mã đơn</th>
                  <th className="pb-3 font-semibold">Khách hàng</th>
                  <th className="pb-3 font-semibold">Tổng tiền</th>
                  <th className="pb-3 font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 font-semibold text-indigo-600">{order.id}</td>
                    <td className="py-3.5 text-slate-700 font-medium">{order.customer}</td>
                    <td className="py-3.5 text-slate-900 font-semibold">{order.total}</td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===================== MOBILE CARDS ===================== */}
          <div className="block sm:hidden space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-600 text-sm">{order.id}</span>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold border ${statusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Khách hàng:</span>
                  <span className="text-slate-900 font-semibold">{order.customer}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Tổng tiền:</span>
                  <span className="text-slate-900 font-bold">{order.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MONTH GOALS */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="mb-6 text-lg font-bold text-slate-900">Mục tiêu tháng 5</h2>
            <div className="space-y-5">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold text-slate-600">Doanh thu đạt được</span>
                  <span className="font-bold text-indigo-600">72%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600" style={{ width: "72%" }} />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold text-slate-600">Đơn hàng hoàn thành</span>
                  <span className="font-bold text-emerald-600">58%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600" style={{ width: "58%" }} />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold text-slate-600">Khách hàng mới</span>
                  <span className="font-bold text-amber-600">80%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600" style={{ width: "80%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/50 text-xs text-indigo-700 leading-relaxed">
            💡 <b>Gợi ý:</b> Doanh thu đang tăng trưởng tốt (+12%). Bạn nên chạy chiến dịch quảng cáo cho nhóm 14 sản phẩm sắp hết hàng để tối ưu hóa lượng tồn kho!
          </div>
        </div>
      </div>
    </section>
  );
}
