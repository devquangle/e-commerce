import type { OrderStatus } from "./order.type";

export interface OrderFilterRequest {
  keyword?: string;
  startDate?: string;
  endDate?: string;
  status?: OrderStatus;
  page: number | 1;
  size: number | 10;
}
