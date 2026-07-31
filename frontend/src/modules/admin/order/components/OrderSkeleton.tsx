export default function OrderSkeleton() {
  return (
    <div className="w-full">
      {/* DESKTOP TABLE SKELETON */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr className="text-slate-500">
              <th className="py-3 px-4 font-semibold text-sm uppercase tracking-wider">
                STT
              </th>
              <th className="py-3 px-4 font-semibold text-sm uppercase tracking-wider">
                Mã đơn hàng
              </th>
              <th className="py-3 px-4 font-semibold text-sm uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="py-3 px-4 font-semibold text-sm uppercase tracking-wider">
                Thanh toán
              </th>
              <th className="py-3 px-4 font-semibold text-sm uppercase tracking-wider text-right">
                Tổng tiền
              </th>
              <th className="py-3 px-4 font-semibold text-sm uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="py-3 px-4 font-semibold text-sm uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="py-3 px-4 font-semibold text-sm uppercase tracking-wider text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: 6 }).map((_, index) => (
              <tr key={index}>
                {/* STT */}
                <td className="py-4 px-4">
                  <div className="h-4 w-4 bg-slate-200 rounded animate-pulse" />
                </td>
                {/* Order Code */}
                <td className="py-4 px-4">
                  <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                </td>
                {/* Customer Info */}
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="h-4 w-36 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                    <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
                  </div>
                </td>
                {/* Payment */}
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="h-3.5 w-16 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                  </div>
                </td>
                {/* Total */}
                <td className="py-4 px-4 text-right">
                  <div className="h-4 w-24 bg-slate-200 rounded ml-auto animate-pulse" />
                </td>
                {/* Status Badge */}
                <td className="py-4 px-4">
                  <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
                </td>
                {/* Created At */}
                <td className="py-4 px-4">
                  <div className="h-3.5 w-20 bg-slate-200 rounded animate-pulse" />
                </td>
                {/* Actions */}
                <td className="py-4 px-4 text-right">
                  <div className="h-6 w-6 bg-slate-200 rounded ml-auto animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD SKELETON */}
      <div className="md:hidden flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
              <div className="h-5 w-20 bg-slate-200 rounded-full animate-pulse" />
            </div>

            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1.5">
                <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <div className="h-3.5 w-36 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
