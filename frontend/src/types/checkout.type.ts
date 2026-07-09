export const PAYMENT_ADDRESS_STORAGE_KEY = "payment_selected_address_id";

export function getSelectedAddressId(): number {
  return Number(localStorage.getItem(PAYMENT_ADDRESS_STORAGE_KEY)) || 0;
}

export interface CouponForm {
  couponCode: string;
}