import Container from "@/components/common/Container";
import { useCountAddress } from "@/modules/user/address/hooks/useAddress";

export default function AddressPaymentSkeleton() {
  const addressCount = useCountAddress(1);

  return (
    <Container className="max-w-7xl p-2 my-6 animate-pulse">
      {/* Title Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
        <div className="h-7 w-56 bg-slate-200 rounded-md"></div>
      </div>

      {/* Address Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: addressCount }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col justify-between card-custom min-h-[140px]"
          >
            <div className="space-y-2">
              <div className="h-5 w-36 bg-slate-200 rounded"></div>
              <div className="h-4 w-28 bg-slate-200 rounded"></div>
              <div className="h-4 w-4/5 bg-slate-200 rounded"></div>
            </div>

            <div className="flex items-center flex-wrap gap-2 mt-3">
              <div className="h-6 w-32 bg-slate-200 rounded"></div>
              <div className="h-6 w-20 bg-slate-200 rounded"></div>
              <div className="h-6 w-12 bg-slate-200 rounded"></div>
              <div className="h-6 w-12 bg-slate-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Add new address link skeleton */}
      <div className="mt-6">
        <div className="h-5 w-72 bg-slate-200 rounded"></div>
      </div>
    </Container>
  );
}
