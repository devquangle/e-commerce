export default function Revenue() {
  const monthlyRevenue = [
    { month: "T1", revenue: 220, growth: "+6%" },
    { month: "T2", revenue: 245, growth: "+11%" },
    { month: "T3", revenue: 278, growth: "+13%" },
    { month: "T4", revenue: 260, growth: "-6%" },
    { month: "T5", revenue: 302, growth: "+16%" },
    { month: "T6", revenue: 335, growth: "+11%" },
  ];

  const maxRevenue = Math.max(...monthlyRevenue.map((item) => item.revenue));

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo doanh thu</h1>
          <p className="text-sm text-gray-500">
            Tổng hợp doanh thu nhà sách theo tháng từ website và đơn hàng trực tiếp.
          </p>
        </div>
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          Tải báo cáo PDF
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Doanh thu tháng này</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">335.000.000đ</p>
        </article>
        <article className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Giá trị đơn sách trung bình</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">215.000đ</p>
        </article>
        <article className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Tỷ lệ hoàn đơn</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">1.6%</p>
        </article>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Biểu đồ cột doanh thu theo tháng</h2>
        <div className="grid grid-cols-6 items-end gap-3">
          {monthlyRevenue.map((row) => {
            const height = Math.round((row.revenue / maxRevenue) * 100);

            return (
              <div key={row.month} className="flex flex-col items-center gap-2">
                <p className="text-xs font-medium text-gray-500">{row.revenue}tr</p>
                <div className="flex h-52 items-end">
                  <div
                    className="w-10 rounded-t-md bg-indigo-600 transition-all hover:bg-indigo-700"
                    style={{ height: `${height}%` }}
                    title={`${row.month}: ${row.revenue} triệu (${row.growth})`}
                  />
                </div>
                <p className="text-sm font-medium text-gray-700">{row.month}</p>
                <p className={`text-xs ${row.growth.startsWith("-") ? "text-red-500" : "text-emerald-600"}`}>
                  {row.growth}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
