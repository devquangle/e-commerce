export const PAYMENT_ADDRESS_STORAGE_KEY = "payment_selected_address_id";

export function getSelectedAddressId(): number {
  return (
    Number(sessionStorage.getItem(PAYMENT_ADDRESS_STORAGE_KEY)) ||
    Number(localStorage.getItem(PAYMENT_ADDRESS_STORAGE_KEY)) ||
    0
  );
}

export function setSelectedAddressId(id: number | null) {
  if (id) {
    sessionStorage.setItem(PAYMENT_ADDRESS_STORAGE_KEY, String(id));
  } else {
    sessionStorage.removeItem(PAYMENT_ADDRESS_STORAGE_KEY);
    localStorage.removeItem(PAYMENT_ADDRESS_STORAGE_KEY);
  }
}

export interface CouponForm {
  couponCode: string;
}