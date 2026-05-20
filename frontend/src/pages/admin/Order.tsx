import { 
  Search, 
  Eye, 
  Edit3, 
  SlidersHorizontal,
  Download,
  Calendar,
  User
} from "lucide-react";

export default function Order() {
  const orders = [
    { id: "#DH1029", customer: "Nguyen Van A", createdAt: "05/05/2026", total: "1.250.000đ", status: "Chờ xác nhận" },
    { id: "#DH1028", customer: "Tran Thi B", createdAt: "05/05/2026", total: "890.000đ", status: "Đang xử lý" },
    { id: "#DH1027", customer: "Le Van C", createdAt: "04/05/2026", total: "2.490.000đ", status: "Đã giao" },
    { id: "#DH1026", customer: "Pham Thi D", createdAt: "04/05/2026", total: "340.000đ", status: "Đã hủy" },
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Quản lý đơn hàng</h1>
          <p className="mt-1 text-sm text-slate-500">Theo dõi trạng thái xử lý và lịch sử đơn hàng gần đây.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200 cursor-pointer active:scale-95">
          <Download size={16} />
          Xuất danh sách
        </button>
      </div>

      {/* FILTER & ORDERS CONTAINER */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
        {/* FILTERS */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo mã đơn hoặc khách hàng..."
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          
          <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-600 bg-white cursor-pointer">
            <option>Tất cả trạng thái</option>
            <option>Chờ xác nhận</option>
            <option>Đang xử lý</option>
            <option>Đã giao</option>
            <option>Đã hủy</option>
          </select>
          
          <button className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition active:scale-95 cursor-pointer">
            <SlidersHorizontal size={14} />
            Lọc đơn hàng
          </button>
        </div>

        {/* ===================== DESKTOP TABLE ===================== */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="pb-3 font-semibold w-28">Mã đơn</th>
                <th className="pb-3 font-semibold">Khách hàng</th>
                <th className="pb-3 font-semibold w-36">Ngày tạo</th>
                <th className="pb-3 font-semibold w-36">Tổng tiền</th>
                <th className="pb-3 font-semibold w-36">Trạng thái</th>
                <th className="pb-3 font-semibold text-right w-36">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 font-bold text-indigo-600">{order.id}</td>
                  <td className="py-4 text-slate-900 font-semibold">{order.customer}</td>
                  <td className="py-4 text-slate-500 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-400" />
                      {order.createdAt}
                    </span>
                  </td>
                  <td className="py-4 text-slate-900 font-bold">{order.total}</td>
                  <td className="py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-right space-x-1 whitespace-nowrap">
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition active:scale-90 cursor-pointer" title="Chi tiết đơn">
                      <Eye size={14} />
                    </button>
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition active:scale-90 cursor-pointer" title="Cập nhật trạng thái">
                      <Edit3 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===================== MOBILE CARDS ===================== */}
        <div className="block md:hidden space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-600 text-sm">{order.id}</span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusBadgeClass(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium flex items-center gap-1"><User size={12} /> Khách hàng:</span>
                  <span className="text-slate-900 font-semibold">{order.customer}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium flex items-center gap-1"><Calendar size={12} /> Ngày tạo:</span>
                  <span className="text-slate-700 font-medium">{order.createdAt}</span>
                </div>
                <div className="flex justify-between items-center pt-1.5 border-t border-slate-200/50">
                  <span className="text-slate-500 font-medium">Tổng thanh toán:</span>
                  <span className="text-slate-900 font-bold text-sm">{order.total}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1.5">
                <button className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer">
                  <Eye size={12} /> Chi tiết
                </button>
                <button className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer">
                  <Edit3 size={12} /> Cập nhật
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
