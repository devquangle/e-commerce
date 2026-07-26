import Container from "@/components/common/Container";
import { useCartCount } from "@/modules/user/cart/hooks/useCart";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/useAuth";
import type { CartResponse } from "@/modules/user/cart/types/cart.type";

export function CartSkeleton() {
  const { data: cartCountData } = useCartCount();
  const queryClient = useQueryClient();
  const { userInfo } = useAuth();

  // Đọc danh sách giỏ hàng từ React Query Cache (nếu có sẵn)
  const cartCache = queryClient.getQueryData<CartResponse[]>([
    "cart",
    userInfo?.code,
  ]);

  const countFromCache = cartCache ? cartCache.length : 0;
  const countFromQuery = cartCountData?.count ?? 0;

  // Lấy số lượng giỏ hàng thực tế từ useCartCount hoặc Cache
  const totalCount = countFromCache > 0 ? countFromCache : countFromQuery;
  const skeletonCount = totalCount > 0 ? totalCount : 3;

  const items = Array.from({ length: skeletonCount });

  return (
    <Container className="max-w-7xl p-2 my-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start w-full animate-pulse">
        {/* Vùng bên trái: Toolbar & Danh sách sản phẩm skeleton */}
        <section className="lg:col-span-8">
          <div className="card-custom space-y-4 w-full">
            {/* Toolbar Skeleton */}
            <div className="grid grid-cols-[40px_1fr_40px] lg:grid-cols-[40px_1fr_120px_140px_120px_40px] items-center border-b border-slate-100 bg-slate-50/50 rounded-t-xl ">
              {/* Cột 1: Checkbox */}
              <div className="flex justify-center items-center h-full">
                <div className="h-5 w-5 rounded bg-slate-200" />
              </div>

              {/* Cột 2: Skeleton "Chọn tất cả" */}
              <div className="pl-2">
                <div className="h-4 w-36 rounded bg-slate-200" />
              </div>

              {/* Cột 3: Skeleton "Đơn giá" */}
              <div className="hidden lg:flex justify-end pr-2">
                <div className="h-3.5 w-16 rounded bg-slate-200" />
              </div>

              {/* Cột 4: Skeleton "Số lượng" */}
              <div className="hidden lg:flex justify-center">
                <div className="h-3.5 w-16 rounded bg-slate-200" />
              </div>

              {/* Cột 5: Skeleton "Thành tiền" */}
              <div className="hidden lg:flex justify-end pr-2">
                <div className="h-3.5 w-16 rounded bg-slate-200" />
              </div>

              {/* Cột 6: Action */}
              <div className="flex justify-center">
                <div className="h-7 w-7 rounded-lg bg-slate-200" />
              </div>
            </div>

            {/* Danh sách thẻ sản phẩm Skeleton động theo số lượng từ useCartCount */}
            <div className="my-3 space-y-3">
              {items.map((_, index) => (
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
                      <div className="h-[90px] w-16 rounded-xl bg-slate-200 shrink-0" />
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
        </section>

        {/* Vùng bên phải: Tóm tắt đơn hàng skeleton */}
        <section className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card-custom h-full flex flex-col justify-between space-y-3">
            <div className="space-y-3 p-1.5">
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

              <div className="border-t border-dashed border-slate-200/80 pt-3 flex justify-between items-center">
                <div className="h-4 w-20 rounded bg-slate-200" />
                <div className="h-6 w-28 rounded bg-slate-200" />
              </div>
            </div>

            <div className="space-y-3 pt-3 mt-auto">
              <div className="h-10 w-full rounded-lg bg-slate-200" />
            </div>
          </div>
        </section>
      </div>
    </Container>
  );
}
