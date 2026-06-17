import type { CheckoutAddress } from "@/types/checkout.type";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface ShippingAddressProps {
  selectedAddress: CheckoutAddress | undefined;
}

export function ShippingAddress({ selectedAddress }: ShippingAddressProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
          <MapPin size={18} className="text-red-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Địa chỉ giao hàng</h2>
      </div>

      {selectedAddress && (
        <div className="rounded-2xl border border-red-200/60 bg-red-50/30 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold text-slate-900">{selectedAddress.fullName}</p>
              <p className="text-sm text-slate-600 mt-1">{selectedAddress.phone}</p>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {selectedAddress.streetFull}
              </p>
            </div>
            {selectedAddress.default && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-red-600 text-white whitespace-nowrap ml-3">
                Mặc định
              </span>
            )}
          </div>
        </div>
      )}

      <Link
        to="/address-payment"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200/60 bg-slate-50/50 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100/50 hover:border-slate-300 transition"
      >
        Thay đổi
      </Link>
    </div>
  );
}