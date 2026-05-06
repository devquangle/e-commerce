export default function Dashboard() {
  const stats = [
    { label: "Doanh thu hôm nay", value: "24.500.000đ", trend: "+12%" },
    { label: "Đơn hàng mới", value: "86", trend: "+9%" },
    { label: "Sản phẩm sắp hết", value: "14", trend: "-3%" },
    { label: "Khách hàng mới", value: "32", trend: "+5%" },
  ];

  const recentOrders = [
    { id: "#DH1024", customer: "Nguyen Van A", total: "1.200.000đ", status: "Đã giao" },
    { id: "#DH1023", customer: "Tran Thi B", total: "860.000đ", status: "Đang xử lý" },
    { id: "#DH1022", customer: "Le Van C", total: "430.000đ", status: "Chờ xác nhận" },
    { id: "#DH1021", customer: "Pham Thi D", total: "2.100.000đ", status: "Đã hủy" },
  ];

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard quản trị</h1>
          <p className="text-sm text-gray-500">Tổng quan nhanh hoạt động cửa hàng hôm nay.</p>
        </div>
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          Xuất báo cáo
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <article key={item.label} className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{item.value}</p>
            <p className="mt-1 text-sm text-emerald-600">{item.trend} so với hôm qua</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Đơn hàng gần đây</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-2">Mã đơn</th>
                  <th className="py-2">Khách hàng</th>
                  <th className="py-2">Tổng tiền</th>
                  <th className="py-2">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-none">
                    <td className="py-3 font-medium text-gray-800">{order.id}</td>
                    <td className="py-3 text-gray-700">{order.customer}</td>
                    <td className="py-3 text-gray-700">{order.total}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Mục tiêu tháng</h2>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm text-gray-600">
                <span>Doanh thu</span>
                <span>72%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div className="h-2 w-[72%] rounded-full bg-indigo-600" />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm text-gray-600">
                <span>Đơn hàng</span>
                <span>58%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div className="h-2 w-[58%] rounded-full bg-emerald-500" />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm text-gray-600">
                <span>Khách hàng mới</span>
                <span>80%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div className="h-2 w-[80%] rounded-full bg-amber-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
