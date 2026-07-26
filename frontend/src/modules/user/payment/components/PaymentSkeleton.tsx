import Container from "@/components/common/Container";

export function PaymentSkeleton() {
  return (
    <Container className="max-w-7xl p-2 my-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-pulse">
        {/* Cột trái (Xác nhận đơn hàng & sản phẩm) */}
        <section className="lg:col-span-8">
          <div className="card-custom space-y-6">
            {/* Skeleton tiêu đề trang "Xác nhận đơn hàng" */}
            <div className="h-7 w-48 rounded bg-slate-200" />

            {/* Danh sách thẻ sản phẩm Skeleton (Readonly mode) */}
            <div className="space-y-4">
              {[1, 2].map((index) => (
                <div
                  key={index}
                  className="group card-custom-v1 py-4 border border-slate-200/60 bg-white rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
                >
                  {/* 💻 Desktop Grid (Readonly: lg:grid-cols-[1fr_120px_120px_120px] px-4) */}
                  <div className="hidden lg:grid lg:grid-cols-[1fr_120px_120px_120px] lg:items-center px-4">
                    {/* Cột 1: Ảnh & Tên sản phẩm */}
                    <div className="flex items-center gap-4 min-w-0 pl-2">
                      <div className="h-[100px] w-[72px] rounded-xl bg-slate-200 shrink-0 border border-slate-200/80" />
                      <div className="min-w-0 flex-1 flex flex-col gap-2">
                        <div className="h-4 w-4/5 rounded bg-slate-200" />
                        <div className="h-3 w-1/2 rounded bg-slate-200" />
                        <div className="h-3 w-1/3 rounded bg-slate-200" />
                      </div>
                    </div>

                    {/* Cột 2: Đơn giá */}
                    <div className="text-right pr-2 flex flex-col items-end gap-1">
                      <div className="h-3 w-12 rounded bg-slate-200" />
                      <div className="h-4 w-16 rounded bg-slate-200" />
                    </div>

                    {/* Cột 3: Số lượng */}
                    <div className="flex justify-center">
                      <div className="h-8 w-24 rounded-lg bg-slate-200" />
                    </div>

                    {/* Cột 4: Thành tiền */}
                    <div className="text-right pr-2 flex justify-end">
                      <div className="h-4 w-20 rounded bg-slate-200" />
                    </div>
                  </div>

                  {/* 📱 Mobile/Tablet */}
                  <div className="lg:hidden p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="h-[90px] w-[64px] rounded-xl bg-slate-200 shrink-0" />
                      <div className="flex-1 space-y-2 sm:hidden">
                        <div className="h-4 w-4/5 rounded bg-slate-200" />
                        <div className="h-3 w-1/2 rounded bg-slate-200" />
                      </div>
                    </div>
                    <div className="hidden sm:block flex-1 space-y-2 w-full">
                      <div className="h-4 w-3/4 rounded bg-slate-200" />
                      <div className="h-3 w-1/2 rounded bg-slate-200" />
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className="h-8 w-24 rounded-lg bg-slate-200 shrink-0" />
                      <div className="h-5 w-20 rounded bg-slate-200 shrink-0" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ghi chú đơn hàng Skeleton */}
            <div className="pt-5 mt-2 border-t border-slate-100 space-y-3">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="w-full rounded-xl bg-slate-200 h-20" />
              <div className="h-3 w-64 rounded bg-slate-200" />
            </div>
          </div>
        </section>

        {/* Cột phải Sidebar: Địa chỉ, Voucher, Phương thức thanh toán, Tóm tắt đơn hàng */}
        <section className="lg:col-span-4 space-y-3">
          {/* 1. Địa chỉ giao hàng Skeleton */}
          <div className="card-custom p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="h-4 w-16 rounded bg-slate-200" />
            </div>
            <div className="h-4 w-3/4 rounded bg-slate-200" />
            <div className="h-3.5 w-1/2 rounded bg-slate-200" />
          </div>

          {/* 2. Áp dụng mã giảm giá Skeleton */}
          <div className="card-custom p-4 space-y-3">
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="flex gap-2">
              <div className="h-10 flex-1 rounded-xl bg-slate-200" />
              <div className="h-10 w-20 rounded-xl bg-slate-200 shrink-0" />
            </div>
          </div>

          {/* 3. Phương thức thanh toán Skeleton */}
          <div className="card-custom p-4 space-y-3">
            <div className="h-4 w-40 rounded bg-slate-200" />
            <div className="space-y-2 pt-1">
              <div className="h-12 w-full rounded-xl bg-slate-200" />
              <div className="h-12 w-full rounded-xl bg-slate-200" />
            </div>
          </div>

          {/* 4. Tóm tắt chi phí & Nút Đặt hàng Skeleton */}
          <div className="card-custom space-y-4 p-4">
            <div className="h-5 w-36 rounded bg-slate-200" />

            <div className="space-y-3 text-sm pt-1">
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 rounded bg-slate-200" />
                <div className="h-4 w-12 rounded bg-slate-200" />
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 w-20 rounded bg-slate-200" />
                <div className="h-4 w-20 rounded bg-slate-200" />
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 rounded bg-slate-200" />
                <div className="h-4 w-16 rounded bg-slate-200" />
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200/80 pt-3 flex justify-between items-center">
              <div className="h-4 w-20 rounded bg-slate-200" />
              <div className="h-6 w-28 rounded bg-slate-200" />
            </div>

            <div className="pt-2">
              <div className="h-11 w-full rounded-lg bg-slate-200" />
            </div>
          </div>
        </section>
      </div>
    </Container>
  );
}
