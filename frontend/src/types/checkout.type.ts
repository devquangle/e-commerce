import { PAYMENT_ADDRESS_STORAGE_KEY } from "@/pages/user/AddressPayment";

export interface CheckoutAddress {
  id: number;
  fullName: string;
  phone: string;
  streetFull: string;
  default: boolean;
}

export const MOCK_CHECKOUT_ADDRESSES: CheckoutAddress[] = [
  {
    id: 1,
    fullName: "Nguyễn Văn A",
    phone: "0901 234 567",
    streetFull: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    default: true,
  },
  {
    id: 2,
    fullName: "Trần Thị B",
    phone: "0912 345 678",
    streetFull: "456 Lê Lợi, Phường 1, Quận 3, TP. Hồ Chí Minh",
    default: false,
  },
];

export function getSelectedAddressId(): number {
  const saved = Number(sessionStorage.getItem(PAYMENT_ADDRESS_STORAGE_KEY));
  if (MOCK_CHECKOUT_ADDRESSES.some((a) => a.id === saved)) return saved;
  return (
    MOCK_CHECKOUT_ADDRESSES.find((a) => a.default)?.id ??
    MOCK_CHECKOUT_ADDRESSES[0].id
  );
}

export interface CouponForm {
  couponCode: string;
}