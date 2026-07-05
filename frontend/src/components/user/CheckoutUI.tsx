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
        <h1 className="text-2xl font-bold text-slate-900 leading-tight">
          {title}
        </h1>
      </div>
    </div>
  );
}

export function CheckoutEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action: { to: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 px-6 text-center shadow-sm">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500">
        <Icon size={24} className="text-slate-400 bg-indigo-500" />
      </div>

      <h2 className="text-xl font-bold text-slate-900">{title}</h2>

      <p className="mt-2 max-w-sm text-sm text-slate-600">{description}</p>

      <Link
        to={action.to}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        {action.label}
        <ChevronRight size={16} />
      </Link>
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
          <p className="truncate text-xs font-medium text-slate-600">
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

