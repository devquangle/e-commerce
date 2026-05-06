
export default function Genre() {
  const genres = [
    { id: "GR001", name: "Điện thoại", products: 48, status: "Hiển thị" },
    { id: "GR002", name: "Laptop", products: 36, status: "Hiển thị" },
    { id: "GR003", name: "Phụ kiện", products: 92, status: "Ẩn" },
    { id: "GR004", name: "Gia dụng", products: 25, status: "Hiển thị" },
  ];

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý thể loại</h1>
          <p className="text-sm text-gray-500">Tạo và quản lý danh mục sản phẩm theo nhóm.</p>
        </div>
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          + Thêm thể loại
        </button>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <input
            type="text"
            placeholder="Tìm theo tên thể loại..."
            className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
          />
          <select className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2">
            <option>Tất cả trạng thái</option>
            <option>Hiển thị</option>
            <option>Ẩn</option>
          </select>
          <button className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Làm mới
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2">Mã</th>
                <th className="py-2">Tên thể loại</th>
                <th className="py-2">Số sản phẩm</th>
                <th className="py-2">Trạng thái</th>
                <th className="py-2 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {genres.map((genre) => (
                <tr key={genre.id} className="border-b last:border-none">
                  <td className="py-3 font-medium text-gray-800">{genre.id}</td>
                  <td className="py-3 text-gray-700">{genre.name}</td>
                  <td className="py-3 text-gray-700">{genre.products}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {genre.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="mr-2 rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50">
                      Sửa
                    </button>
                    <button className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
                      Xóa
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
