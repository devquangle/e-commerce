export const VoucherStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  DELETED: "DELETED",
} as const;

export type VoucherStatus = (typeof VoucherStatus)[keyof typeof VoucherStatus];

export const VoucherStatusConfig: Record<VoucherStatus, { label: string }> = {
  ACTIVE: { label: "Hoạt động" },
  INACTIVE: { label: "Tạm ngưng" },
  DELETED: { label: "Đã xóa" },
};

export const getVoucherStatusLabel = (status?: VoucherStatus | string) => {
  if (!status) return "Không xác định";
  const upperStatus = String(status).toUpperCase() as VoucherStatus;
  return VoucherStatusConfig[upperStatus]?.label || String(status);
};
