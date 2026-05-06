const topProducts = [
  {
    rank: 1,
    name: "Nhà giả kim",
    category: "Tiểu thuyết",
    sold: 528,
    revenue: "47.520.000đ",
    growth: "+15.2%",
    stock: 96,
  },
  {
    rank: 2,
    name: "Muon kiep nhan sinh",
    category: "Ky nang song",
    sold: 476,
    revenue: "57.120.000đ",
    growth: "+12.7%",
    stock: 88,
  },
  {
    rank: 3,
    name: "Dac nhan tam",
    category: "Ky nang song",
    sold: 441,
    revenue: "52.920.000đ",
    growth: "+10.8%",
    stock: 74,
  },
  {
    rank: 4,
    name: "Tu duy nhanh va cham",
    category: "Tam ly",
    sold: 319,
    revenue: "44.660.000đ",
    growth: "+8.1%",
    stock: 61,
  },
  {
    rank: 5,
    name: "Cay cam ngot cua toi",
    category: "Van hoc Viet",
    sold: 286,
    revenue: "31.460.000đ",
    growth: "+7.4%",
    stock: 47,
  },
];

const categoryDistribution = [
  { name: "Tiểu thuyết", percent: 31 },
  { name: "Kỹ năng sống", percent: 29 },
  { name: "Tâm lý", percent: 22 },
  { name: "Văn học Việt", percent: 18 },
];

export default function TopProduct() {
  const maxSold = Math.max(...topProducts.map((product) => product.sold));

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Top sách bán chạy</h1>
          <p className="text-sm text-gray-500">
            Theo dõi đầu sách có hiệu suất cao nhất theo doanh thu và số lượng bán.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select className="rounded-lg border bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-indigo-500 focus:ring-2">
            <option>30 ngày gần nhất</option>
            <option>Quý này</option>
            <option>Năm nay</option>
          </select>
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Xuất báo cáo
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Tổng sách bán ra</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">2.050</p>
          <p className="mt-2 text-xs font-medium text-emerald-600">+14.8% so với kỳ trước</p>
        </article>
        <article className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Doanh thu từ top 5</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">233.680.000đ</p>
          <p className="mt-2 text-xs font-medium text-emerald-600">+11.2% so với kỳ trước</p>
        </article>
        <article className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Đầu sách dẫn đầu</p>
          <p className="mt-1 text-base font-semibold text-gray-900">Nhà giả kim</p>
          <p className="mt-2 text-xs text-gray-500">528 bản đã bán</p>
        </article>
        <article className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Danh mục nổi bật</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">Tiểu thuyết</p>
          <p className="mt-2 text-xs text-gray-500">Chiếm 31% tổng doanh thu</p>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 shadow-sm xl:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Biểu đồ cột số lượng sách bán ra</h2>
          <div className="grid grid-cols-5 items-end gap-4">
            {topProducts.map((product) => (
              <div key={product.rank} className="flex flex-col items-center gap-2">
                <p className="text-xs font-semibold text-gray-500">{product.sold}</p>
                <div className="flex h-56 items-end">
                  <div
                    className="w-12 rounded-t-md bg-indigo-600 transition-all hover:bg-indigo-700"
                    style={{ height: `${Math.round((product.sold / maxSold) * 100)}%` }}
                    title={`${product.name}: ${product.sold} bản`}
                  />
                </div>
                <p className="line-clamp-2 text-center text-xs font-medium text-gray-700">{product.name}</p>
                <p className="text-xs text-emerald-600">{product.growth}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Tỷ trọng danh mục</h2>
          <p className="mt-1 text-sm text-gray-500">Phân bổ doanh thu theo danh mục sách.</p>

          <div className="mt-6 space-y-4">
            {categoryDistribution.map((item) => (
              <div key={item.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{item.name}</span>
                  <span className="text-gray-500">{item.percent}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-indigo-600"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button className="mt-6 w-full rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Xem phân tích chi tiết
          </button>
        </aside>
      </div>
    </section>
  );
}
