export default function HeaderActionsSkeleton() {
  return (
    <div className="flex items-center gap-4 animate-pulse">
      {/* icon favorite skeleton */}
      <div className="hidden lg:block w-7 h-7 bg-slate-200 rounded-full"></div>

      {/* icon cart skeleton */}
      <div className="hidden lg:block w-8 h-8 bg-slate-200 rounded-full"></div>

      {/* icon menu skeleton */}
      <div className="flex items-center gap-2 rounded-full border border-slate-200 px-2 py-1">
        <div className="w-8 h-8 rounded-full bg-slate-200"></div>
        <div className="hidden lg:block w-20 h-4 bg-slate-200 rounded"></div>
      </div>
    </div>
  );
}
