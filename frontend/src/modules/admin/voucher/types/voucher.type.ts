import { BaseStatus } from "@/types/status";

export type VoucherStatus = BaseStatus;
export type VoucherDiscountType = "PERCENT" | "FIXED";

export interface VoucherItem {
  code: string;
  name: string;
  discountType: VoucherDiscountType;
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue?: number;
  startDate: string;
  endDate: string;
  status: VoucherStatus;
  quantity: number;
  usedQuantity: number;
  description?: string;
}

export interface VoucherRequest {
  code: string;
  name: string;
  discountType: VoucherDiscountType;
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue?: number;
  startDate: string;
  endDate: string;
  status: VoucherStatus;
  quantity: number;
  description?: string;
}
