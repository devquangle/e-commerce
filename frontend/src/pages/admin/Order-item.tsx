export default function OrderItem() {
  const orderItems = [
    { id: "ITEM001", product: "iPhone 15 Pro", quantity: 1, unitPrice: "28.990.000đ", total: "28.990.000đ" },
    { id: "ITEM002", product: "Ốp lưng Silicon", quantity: 2, unitPrice: "250.000đ", total: "500.000đ" },
    { id: "ITEM003", product: "Cáp sạc Type-C", quantity: 1, unitPrice: "190.000đ", total: "190.000đ" },
  ];

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
          <p className="text-sm text-gray-500">Theo dõi từng sản phẩm trong đơn và giá trị thanh toán.</p>
        </div>
        <button className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Quay lại danh sách đơn
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Mã đơn</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">#DH1024</p>
        </article>
        <article className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Khách hàng</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">Nguyen Van A</p>
        </article>
        <article className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Trạng thái</p>
          <p className="mt-1 inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
            Đang xử lý
          </p>
        </article>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Danh sách sản phẩm</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2">Mã item</th>
                <th className="py-2">Sản phẩm</th>
                <th className="py-2">Số lượng</th>
                <th className="py-2">Đơn giá</th>
                <th className="py-2">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item) => (
                <tr key={item.id} className="border-b last:border-none">
                  <td className="py-3 font-medium text-gray-800">{item.id}</td>
                  <td className="py-3 text-gray-700">{item.product}</td>
                  <td className="py-3 text-gray-700">{item.quantity}</td>
                  <td className="py-3 text-gray-700">{item.unitPrice}</td>
                  <td className="py-3 font-medium text-gray-900">{item.total}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="pt-4 text-right font-medium text-gray-700">
                  Tổng cộng:
                </td>
                <td className="pt-4 text-base font-semibold text-indigo-700">29.680.000đ</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
}
