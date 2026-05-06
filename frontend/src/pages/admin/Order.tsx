
export default function Order() {
  const orders = [
    { id: "#DH1029", customer: "Nguyen Van A", createdAt: "05/05/2026", total: "1.250.000đ", status: "Chờ xác nhận" },
    { id: "#DH1028", customer: "Tran Thi B", createdAt: "05/05/2026", total: "890.000đ", status: "Đang xử lý" },
    { id: "#DH1027", customer: "Le Van C", createdAt: "04/05/2026", total: "2.490.000đ", status: "Đã giao" },
    { id: "#DH1026", customer: "Pham Thi D", createdAt: "04/05/2026", total: "340.000đ", status: "Đã hủy" },
  ];

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-sm text-gray-500">Theo dõi trạng thái xử lý và lịch sử đơn hàng gần đây.</p>
        </div>
        <button className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Xuất danh sách
        </button>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <input
            type="text"
            placeholder="Tìm theo mã đơn hoặc khách hàng..."
            className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2 md:col-span-2"
          />
          <select className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2">
            <option>Tất cả trạng thái</option>
            <option>Chờ xác nhận</option>
            <option>Đang xử lý</option>
            <option>Đã giao</option>
            <option>Đã hủy</option>
          </select>
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Lọc đơn
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2">Mã đơn</th>
                <th className="py-2">Khách hàng</th>
                <th className="py-2">Ngày tạo</th>
                <th className="py-2">Tổng tiền</th>
                <th className="py-2">Trạng thái</th>
                <th className="py-2 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b last:border-none">
                  <td className="py-3 font-medium text-gray-800">{order.id}</td>
                  <td className="py-3 text-gray-700">{order.customer}</td>
                  <td className="py-3 text-gray-700">{order.createdAt}</td>
                  <td className="py-3 text-gray-700">{order.total}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="mr-2 rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50">
                      Xem
                    </button>
                    <button className="rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50">
                      Cập nhật
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
