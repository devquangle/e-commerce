export type Order = {
  id: number;
  fullname: string;
  phone: string;
  address: string;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  date: string; // YYYY-MM-DD
};

export type PaymentMethod = "COD" | "VNPAY";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPING"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED_DELIVERY";

export type PaymentStatus = "UNPAID" | "PAID";

export const PaymentStatusMapping: Record<PaymentStatus, string> = {
  UNPAID: "Chưa thanh toán",
  PAID: "Đã thanh toán",
};

export const PaymentMethodMapping: Record<PaymentMethod, string> = {
  COD: "Tiền mặt",
  VNPAY: "Ví điện tử",
};

export const OrderStatusMapping: Record<OrderStatus, string> = {
  PENDING: "Đang xử lý",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  FAILED_DELIVERY: "Giao thất bại",
};
export const OrderStatusColor: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPING: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
  FAILED_DELIVERY: "bg-red-100 text-red-700",
};
