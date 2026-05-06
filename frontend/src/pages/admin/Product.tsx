
export default function Product() {
  const products = [
    { sku: "SP1001", name: "iPhone 15 Pro", price: "28.990.000đ", stock: 12, status: "Đang bán" },
    { sku: "SP1002", name: "MacBook Air M3", price: "31.490.000đ", stock: 8, status: "Đang bán" },
    { sku: "SP1003", name: "Tai nghe Bluetooth X2", price: "790.000đ", stock: 0, status: "Hết hàng" },
    { sku: "SP1004", name: "Sạc nhanh 65W", price: "390.000đ", stock: 35, status: "Đang bán" },
  ];

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-sm text-gray-500">Theo dõi tồn kho, giá bán và trạng thái hiển thị sản phẩm.</p>
        </div>
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          + Thêm sản phẩm
        </button>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-4 grid gap-3 lg:grid-cols-4">
          <input
            type="text"
            placeholder="Tìm theo mã hoặc tên..."
            className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
          />
          <select className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2">
            <option>Tất cả thể loại</option>
            <option>Điện thoại</option>
            <option>Laptop</option>
          </select>
          <select className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2">
            <option>Tất cả trạng thái</option>
            <option>Đang bán</option>
            <option>Hết hàng</option>
          </select>
          <button className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Lọc
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2">SKU</th>
                <th className="py-2">Tên sản phẩm</th>
                <th className="py-2">Giá</th>
                <th className="py-2">Tồn kho</th>
                <th className="py-2">Trạng thái</th>
                <th className="py-2 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.sku} className="border-b last:border-none">
                  <td className="py-3 font-medium text-gray-800">{product.sku}</td>
                  <td className="py-3 text-gray-700">{product.name}</td>
                  <td className="py-3 text-gray-700">{product.price}</td>
                  <td className="py-3 text-gray-700">{product.stock}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {product.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="mr-2 rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50">
                      Chi tiết
                    </button>
                    <button className="rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50">
                      Sửa
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
