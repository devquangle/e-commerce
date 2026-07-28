export function OrderCardSkeleton() {
  return (
    <div className="rounded-xl shadow-sm bg-white p-4 space-y-4 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
            <div className="h-3.5 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="h-6 w-20 bg-gray-200 rounded-md"></div>
      </div>

      {/* Body */}
      <div className="grid md:grid-cols-2 gap-3 bg-gray-50 rounded-lg p-3">
        <div className="space-y-2">
          <div className="h-4 w-36 bg-gray-200 rounded"></div>
          <div className="h-3.5 w-4/5 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-28 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap justify-between items-center gap-3 pt-1">
        <div className="h-5 w-36 bg-gray-200 rounded"></div>

        <div className="flex gap-2">
          <div className="h-7 w-20 bg-gray-200 rounded"></div>
          <div className="h-7 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
