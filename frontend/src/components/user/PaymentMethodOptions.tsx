import type { PaymentMethodType } from "@/modules/user/cart/types/cart.type";
import { Banknote, Landmark } from "lucide-react";
import type { ReactNode } from "react";

export function PaymentMethodOptions({
  value,
  onChange,
}: {
  value: PaymentMethodType;
  onChange: (v: PaymentMethodType) => void;
}) {
  const options: {
    id: PaymentMethodType;
    label: string;
    icon: ReactNode;
    badges: ReactNode;
  }[] = [

    {
      id: "vnpay",
      label: "Thanh toán online",
      icon: <Landmark size={18} />,
      badges: (
        <PaymentBrandBadge
            label="ATM"
            className="bg-slate-100 text-slate-700"
          />
      ),
    },
    {
      id: "cod" as PaymentMethodType,
      label: "Thanh toán khi nhận hàng",
      icon: <Banknote size={18} />,
      badges: (
        <PaymentBrandBadge
          label="COD"
          className="bg-emerald-100 text-emerald-700"
        />
      ),
    },
  ];

  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const selected = value === opt.id;

        return (
          <label
            key={opt.id}
            className={`
          flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all
          ${
            selected
              ? "border-red-300 bg-red-50"
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }
        `}
          >
            <input
              type="radio"
              name="payment"
              checked={selected}
              onChange={() => onChange(opt.id)}
              className="h-4 w-4 shrink-0 text-red-600"
            />

            <span
              className={`
            flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
            ${
              selected ? "bg-red-600 text-white" : "bg-slate-100 text-slate-600"
            }
          `}
            >
              {opt.icon}
            </span>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">{opt.label}</p>
            </div>

            <div className="hidden lg:flex">{opt.badges}</div>
          </label>
        );
      })}
    </div>
  );
}
function PaymentBrandBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold leading-none ${className}`}
    >
      {label}
    </span>
  );
}
