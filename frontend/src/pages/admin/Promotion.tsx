
export default function Promotion() {
  const promotions = [
    { code: "SUMMER10", discount: "10%", period: "01/05 - 31/05", status: "Đang chạy" },
    { code: "FREESHIP50", discount: "Miễn phí ship", period: "05/05 - 20/05", status: "Sắp chạy" },
    { code: "VIP20", discount: "20%", period: "01/04 - 30/04", status: "Đã kết thúc" },
  ];

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý khuyến mãi</h1>
          <p className="text-sm text-gray-500">Thiết lập mã giảm giá và theo dõi chiến dịch đang hoạt động.</p>
        </div>
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          + Tạo khuyến mãi
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Mã đang chạy</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">12</p>
        </article>
        <article className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Lượt sử dụng hôm nay</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">327</p>
        </article>
        <article className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Doanh thu từ ưu đãi</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">54.200.000đ</p>
        </article>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            placeholder="Tìm theo mã khuyến mãi..."
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
          />
          <select className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2">
            <option>Tất cả trạng thái</option>
            <option>Đang chạy</option>
            <option>Sắp chạy</option>
            <option>Đã kết thúc</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2">Mã</th>
                <th className="py-2">Ưu đãi</th>
                <th className="py-2">Thời gian áp dụng</th>
                <th className="py-2">Trạng thái</th>
                <th className="py-2 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promo) => (
                <tr key={promo.code} className="border-b last:border-none">
                  <td className="py-3 font-medium text-gray-800">{promo.code}</td>
                  <td className="py-3 text-gray-700">{promo.discount}</td>
                  <td className="py-3 text-gray-700">{promo.period}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {promo.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="mr-2 rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50">
                      Sửa
                    </button>
                    <button className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
                      Dừng
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
