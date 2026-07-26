import Container from "@/components/common/Container";

export function CartSkeleton() {
  return (
    <Container className="max-w-7xl mx-auto my-6 pb-24 lg:pb-0">
      <div className="flex flex-col lg:flex-row gap-4 items-start w-full animate-pulse">
        {/* Vùng bên trái: Toolbar & Danh sách sản phẩm skeleton */}
        <div className="card-custom flex-1 space-y-4 w-full">
          {/* Toolbar Skeleton - 100% Skeleton không có chữ tĩnh */}
          <div className="grid grid-cols-[40px_1fr_40px] lg:grid-cols-[40px_1fr_120px_140px_120px_40px] items-center border-b border-slate-100 bg-slate-50/50 rounded-t-xl ">
            {/* Cột 1: Checkbox */}
            <div className="flex justify-center items-center h-full">
              <div className="h-5 w-5 rounded bg-slate-200" />
            </div>

            {/* Cột 2: Skeleton đại diện "Chọn tất cả" */}
            <div className="pl-2">
              <div className="h-4 w-36 rounded bg-slate-200" />
            </div>

            {/* Cột 3: Skeleton đại diện "Đơn giá" */}
            <div className="hidden lg:flex justify-end pr-2">
              <div className="h-3.5 w-16 rounded bg-slate-200" />
            </div>

            {/* Cột 4: Skeleton đại diện "Số lượng" */}
            <div className="hidden lg:flex justify-center">
              <div className="h-3.5 w-16 rounded bg-slate-200" />
            </div>

            {/* Cột 5: Skeleton đại diện "Thành tiền" */}
            <div className="hidden lg:flex justify-end pr-2">
              <div className="h-3.5 w-16 rounded bg-slate-200" />
            </div>

            {/* Cột 6: Action */}
            <div className="flex justify-center">
              <div className="h-7 w-7 rounded-lg bg-slate-200" />
            </div>
          </div>

          {/* Danh sách thẻ sản phẩm Skeleton */}
          <div className="my-3 space-y-3">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="group card-custom-v1 py-4 border border-slate-200/60 bg-white rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
              >
                {/* 💻 Giao diện Desktop (lg) */}
                <div className="hidden lg:grid lg:grid-cols-[40px_1fr_120px_140px_120px_40px] lg:items-center">
                  {/* Cột 1: Checkbox */}
                  <div className="flex justify-center items-center h-full">
                    <div className="h-5 w-5 rounded bg-slate-200" />
                  </div>

                  {/* Cột 2: Hình ảnh & Thông tin sản phẩm */}
                  <div className="flex items-center gap-4 min-w-0 pl-2">
                    <div className="h-[100px] w-[72px] rounded-xl bg-slate-200 shrink-0 border border-slate-200/80" />
                    <div className="min-w-0 flex-1 flex flex-col gap-2">
                      <div className="h-4 w-4/5 rounded bg-slate-200" />
                      <div className="h-3 w-1/2 rounded bg-slate-200" />
                      <div className="h-3 w-1/3 rounded bg-slate-200" />
                    </div>
                  </div>

                  {/* Cột 3: Đơn giá */}
                  <div className="text-right pr-2 flex flex-col items-end gap-1">
                    <div className="h-3 w-12 rounded bg-slate-200" />
                    <div className="h-4 w-16 rounded bg-slate-200" />
                  </div>

                  {/* Cột 4: Số lượng */}
                  <div className="flex justify-center">
                    <div className="h-8 w-24 rounded-lg bg-slate-200" />
                  </div>

                  {/* Cột 5: Thành tiền */}
                  <div className="text-right pr-2 flex justify-end">
                    <div className="h-4 w-20 rounded bg-slate-200" />
                  </div>

                  {/* Cột 6: Nút xóa */}
                  <div className="flex justify-center">
                    <div className="h-8 w-8 rounded-lg bg-slate-200" />
                  </div>
                </div>

                {/* 📱 Giao diện Mobile/Tablet */}
                <div className="lg:hidden p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="h-5 w-5 rounded bg-slate-200 shrink-0" />
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
                    <div className="h-7 w-7 rounded-lg bg-slate-200 shrink-0 hidden sm:block" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vùng bên phải: Tóm tắt đơn hàng skeleton - 100% Skeleton không có chữ tĩnh */}
        <div className="w-full lg:w-[350px] lg:shrink-0">
          <div className="card-custom h-full flex flex-col justify-between space-y-3">
            <div className="space-y-3 p-1.5">
              {/* Skeleton tiêu đề "Tóm tắt đơn hàng" */}
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
                  <div className="h-4 w-16 rounded bg-slate-200" />
                  <div className="h-4 w-16 rounded bg-slate-200" />
                </div>
              </div>

              {/* Skeleton "Tổng cộng" */}
              <div className="border-t border-dashed border-slate-200/80 pt-3 flex justify-between items-center">
                <div className="h-4 w-20 rounded bg-slate-200" />
                <div className="h-6 w-28 rounded bg-slate-200" />
              </div>
            </div>

            <div className="space-y-3 pt-3 mt-auto">
              <div className="h-10 w-full rounded-lg bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
