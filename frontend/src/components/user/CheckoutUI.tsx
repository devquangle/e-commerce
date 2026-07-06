import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function CheckoutPageHeader({
  icon: Icon,
  title,
  iconClassName = "bg-indigo-500 shadow-red-600/10",
}: {
  icon: LucideIcon;
  title: string;
  iconClassName?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md ${iconClassName}`}
      >
        <Icon size={20} />
      </div>

      <div>
        <h1 className="heading-1 text-slate-900 leading-tight">
          {title}
        </h1>
      </div>
    </div>
  );
}


export function CheckoutMobileBar({
  subtitle,
  total,
  discount,
  action,
}: {
  subtitle: string;
  total: number;
  discount?: number;
  action: ReactNode;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white p-3 lg:hidden">
      <div className="mx-auto flex max-w-7xl p-2 items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate caption-text font-medium">
            {subtitle}
          </p>

          {discount != null && discount > 0 && (
            <p className="mt-0.5 text-xs font-semibold text-green-600">
              Tiết kiệm {discount.toLocaleString("vi-VN")}₫
            </p>
          )}

          <p className="mt-1 text-lg font-bold text-red-600 tabular-nums">
            {total.toLocaleString("vi-VN")}₫
          </p>
        </div>

        <div className="shrink-0">{action}</div>
      </div>
    </div>
  );
}

