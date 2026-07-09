import { PAYMENT_ADDRESS_STORAGE_KEY } from "@/pages/user/AddressPayment";




export function getSelectedAddressId(): number {
  return Number(localStorage.getItem(PAYMENT_ADDRESS_STORAGE_KEY)) || 0;
}

export interface CouponForm {
  couponCode: string;
}