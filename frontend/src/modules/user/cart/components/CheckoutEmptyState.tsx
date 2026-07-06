import { ChevronRight, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

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
    <div className="relative overflow-hidden card-custom-v1 p-10 flex flex-col items-center justify-center text-center">
      
      {/* Decorative Gradients */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-50 opacity-60 blur-3xl transition-transform duration-1000 group-hover:translate-x-4"></div>
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-rose-50 opacity-60 blur-3xl transition-transform duration-1000 group-hover:-translate-x-4"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Icon Wrapper */}
        <div className="group relative mb-8 flex h-28 w-28 items-center justify-center cursor-default">
          <div className="absolute inset-0 rounded-full bg-indigo-100 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:animate-ping"></div>
          <div className="absolute inset-2 rounded-full bg-indigo-50 transition-transform duration-500 group-hover:scale-110"></div>
          <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.25rem] bg-gradient-to-tr from-indigo-500 to-violet-500 text-white shadow-xl shadow-indigo-500/20 transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-indigo-500/40">
            <Icon size={36} strokeWidth={1.5} />
          </div>
        </div>

        {/* Text Content */}
        <h2 className="heading-2 mb-4 text-slate-900">
          {title}
        </h2>
        <p className="mx-auto mb-10 max-w-md text-base text-slate-500 leading-relaxed">
          {description}
        </p>

        {/* Action Button */}
        <Link
          to={action.to}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-slate-900 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-slate-900/20 transition-all duration-300 hover:scale-105 hover:bg-indigo-600 hover:shadow-indigo-500/30 active:scale-95"
        >
          <span className="relative z-10">{action.label}</span>
          <ChevronRight 
            size={18} 
            className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" 
          />
        </Link>
      </div>
    </div>
  );
}