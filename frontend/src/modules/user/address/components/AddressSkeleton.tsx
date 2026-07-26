import { useCountAddress } from "@/modules/user/address/hooks/useAddress";

export default function AddressSkeleton() {
  const addressCount = useCountAddress(1);

  return (
    <div className="flex-1 p-2 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center gap-3 mb-4">
        <div className="h-7 w-44 bg-slate-200 rounded-md"></div>
        <div className="h-9 w-36 bg-slate-200 rounded-md"></div>
      </div>

      {/* Address Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: addressCount }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col justify-between card-custom min-h-[140px]"
          >
            <div className="space-y-2.5">
              <div className="h-5 w-36 bg-slate-200 rounded"></div>
              <div className="h-4 w-28 bg-slate-200 rounded"></div>
              <div className="h-4 w-4/5 bg-slate-200 rounded"></div>
            </div>

            <div className="flex items-center flex-wrap gap-2 mt-4">
              <div className="h-6 w-24 bg-slate-200 rounded"></div>
              <div className="h-6 w-12 bg-slate-200 rounded"></div>
              <div className="h-6 w-12 bg-slate-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
