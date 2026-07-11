import type { VoucherRequest } from "../types/voucher.type";
import { VoucherStatus } from "../types/voucher.status";

export const initialStartDate = new Date().toISOString().split("T")[0];
export const initialEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];

export const initialFormValues: VoucherRequest = {
  code: "",
  name: "",
  discountValue: 10,
  minOrderValue: 200000,
  maxDiscountValue: 50000,
  usageLimit: 100,
  usageLimitPerUser: 1,
  startDate: initialStartDate,
  endDate: initialEndDate,
  status: VoucherStatus.ACTIVE,
};
