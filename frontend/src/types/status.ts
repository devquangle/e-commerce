export const BaseStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  DELETED: "DELETED",
} as const;

export type BaseStatus =
  (typeof BaseStatus)[keyof typeof BaseStatus];

export const BaseStatusConfig: Record<
  BaseStatus,
  { label: string }
> = {
  ACTIVE: { label: "Hoạt động" },
  INACTIVE: { label: "Ngừng hoạt động" },
  DELETED: { label: "Đã xóa" },
};

export const getBaseStatusLabel = (status: BaseStatus) =>
  BaseStatusConfig[status].label;