import type { AddressResponse } from "@/modules/user/address/types/address";

export const PAYMENT_ADDRESS_STORAGE_KEY = "payment_selected_address_id";
export const PAYMENT_ADDRESS_OBJ_KEY = "payment_selected_address_obj";

export function getSelectedAddressId(): number {
  return (
    Number(sessionStorage.getItem(PAYMENT_ADDRESS_STORAGE_KEY)) ||
    Number(localStorage.getItem(PAYMENT_ADDRESS_STORAGE_KEY)) ||
    0
  );
}

export function getCachedSelectedAddress(): AddressResponse | null {
  try {
    const str =
      sessionStorage.getItem(PAYMENT_ADDRESS_OBJ_KEY) ||
      localStorage.getItem(PAYMENT_ADDRESS_OBJ_KEY);
    return str ? JSON.parse(str) : null;
  } catch {
    return null;
  }
}

export function setCachedSelectedAddress(address: AddressResponse | null) {
  if (address) {
    sessionStorage.setItem(PAYMENT_ADDRESS_OBJ_KEY, JSON.stringify(address));
    sessionStorage.setItem(PAYMENT_ADDRESS_STORAGE_KEY, String(address.id));
  } else {
    sessionStorage.removeItem(PAYMENT_ADDRESS_OBJ_KEY);
    sessionStorage.removeItem(PAYMENT_ADDRESS_STORAGE_KEY);
    localStorage.removeItem(PAYMENT_ADDRESS_OBJ_KEY);
    localStorage.removeItem(PAYMENT_ADDRESS_STORAGE_KEY);
  }
}

export interface CouponForm {
  couponCode: string;
}