export default function OrderDetailSkeleton() {
  return (
    <div className="flex-1 p-4 flex flex-col min-h-full animate-pulse gap-4">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 card-custom p-4">
        <div className="h-7 w-64 bg-slate-200 rounded-md"></div>
        <div className="h-9 w-28 bg-slate-200 rounded-xl"></div>
      </div>

      {/* ===== INFO CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Khách hàng */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="h-5 w-28 bg-slate-200 rounded"></div>
          <div className="h-4 w-36 bg-slate-200 rounded"></div>
          <div className="h-4 w-28 bg-slate-200 rounded"></div>
          <div className="h-4 w-48 bg-slate-200 rounded"></div>
        </div>

        {/* Card 2: Đơn hàng */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="h-5 w-28 bg-slate-200 rounded"></div>
          <div className="h-4 w-40 bg-slate-200 rounded"></div>
          <div className="h-4 w-36 bg-slate-200 rounded"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>

        {/* Card 3: Trạng thái */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="h-5 w-28 bg-slate-200 rounded"></div>
          <div className="h-7 w-24 bg-slate-200 rounded-full"></div>
          <div className="h-6 w-36 bg-slate-200 rounded"></div>
        </div>
      </div>

      {/* ===== PRODUCTS ===== */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4 my-2">
        <div className="h-6 w-32 bg-slate-200 rounded"></div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 border rounded-lg bg-slate-50/50"
            >
              <div className="w-16 h-20 bg-slate-200 rounded-md shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                <div className="h-3.5 w-1/3 bg-slate-200 rounded"></div>
              </div>
              <div className="h-5 w-24 bg-slate-200 rounded shrink-0"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
