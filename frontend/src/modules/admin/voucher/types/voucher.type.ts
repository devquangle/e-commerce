import { BaseStatus } from "@/types/status";

export type VoucherStatus = BaseStatus;
export interface VoucherResponse {
  id: number;
  code: string;
  name: string;

  discountValue: number;
  minOrderValue: number;
  maxDiscountValue: number;


  usageLimit: number;
  usedCount: number;
  usageLimitPerUser: number;
  
  startDate: string;
  endDate: string;

  status: VoucherStatus;
}

export interface VoucherRequest {
  code: string;
  name: string;

  discountValue: number;
  minOrderValue: number;
  maxDiscountValue: number;


  usageLimit: number;
  usageLimitPerUser: number;

  startDate: string;
  endDate: string;

  status: VoucherStatus;
}

export interface VoucherSearchRequest {
  keyword?: string;
  status?: VoucherStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}
