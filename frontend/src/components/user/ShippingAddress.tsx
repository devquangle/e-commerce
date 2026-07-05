import type { CheckoutAddress } from "@/types/checkout.type";
import { Link } from "react-router-dom";

interface ShippingAddressProps {
  selectedAddress: CheckoutAddress | undefined;
}

export function ShippingAddress({ selectedAddress }: ShippingAddressProps) {
  return (
    <div className="card-custom space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">Giao tới</h2>
        <Link
          to="/address-payment"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
        >
          Thay đổi
        </Link>
      </div>

      {selectedAddress && (
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <span className="font-bold text-slate-900">
                {selectedAddress.fullName}
              </span>
              <span className="w-px h-3.5 bg-slate-300"></span>
              <span className="font-semibold text-slate-700">
                {selectedAddress.phone}
              </span>
              {selectedAddress.default && (
                <span className="inline-flex ml-auto items-center px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">
                  Mặc định
                </span>
              )}
            </div>
            
            <div className="text-sm text-slate-500 leading-relaxed mt-0.5">
              <span>{selectedAddress.streetFull}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
