import { CreditCard } from "lucide-react";
import { PaymentMethodOptions } from "./PaymentMethodOptions";
import type { PaymentMethodType } from "../types/payment-method.type";

export default function PaymentMethod({
  value,
  onChange,
}: {
  value: PaymentMethodType;
  onChange: (v: PaymentMethodType) => void;
}) {
  return (
    <div className="card-custom space-y-4">
      <h2 className="text-base font-bold text-slate-900">
        Phương thức thanh toán
      </h2>
      <PaymentMethodOptions value={value} onChange={onChange} />
    </div>
  );
}
