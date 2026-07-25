
import type { AddressResponse } from "@/modules/user/address/types/address";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

interface ShippingAddressProps {
  selectedAddress: AddressResponse | null;
  isLoading?: boolean;
}

export function ShippingAddress({ selectedAddress, isLoading }: ShippingAddressProps) {
  return (
    <div className="card-custom space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-blue-600 shrink-0" />
          <h2 className="text-base font-bold text-slate-900">Giao tới</h2>
        </div>
        <Link
          to="/address-payment"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
        >
          Thay đổi
        </Link>
      </div>

      {isLoading ? (
        /* Skeleton */
        <div className="space-y-2 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-4 w-28 rounded-md bg-slate-200" />
            <div className="h-3 w-px bg-slate-200" />
            <div className="h-4 w-24 rounded-md bg-slate-200" />
          </div>
          <div className="h-3 w-full rounded-md bg-slate-100" />
          <div className="h-3 w-3/4 rounded-md bg-slate-100" />
        </div>
      ) : selectedAddress ? (
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <span className="font-bold text-slate-900">
                {selectedAddress.fullName}
              </span>
              <span className="w-px h-3.5 bg-slate-300" />
              <span className="font-semibold text-slate-700">
                {selectedAddress.phone}
              </span>
              {selectedAddress.default && (
                <span className="inline-flex ml-auto items-center px-1.5 py-0.5 rounded-lg text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">
                  Mặc định
                </span>
              )}
            </div>
            <div className="text-sm text-slate-500 leading-relaxed">
              <span>{selectedAddress.streetFull}</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-400 italic">Chưa chọn địa chỉ giao hàng.</p>
      )}
    </div>
  );
}
