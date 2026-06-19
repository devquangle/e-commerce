import type { BaseStatus } from "@/types/status";

type Props = {
  status: BaseStatus;
};

const STATUS_CONFIG: Record<
  BaseStatus,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: "Hoạt động",
    className:
      "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
  },
  INACTIVE: {
    label: "Ngừng hoạt động",
    className: "bg-slate-100 text-slate-600 border border-slate-200",
  },
  DELETED: {
    label: "Đã xóa",
    className: "bg-red-50 text-red-600 border border-red-200",
  },
};

export default function ProductStatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status];

  return (
    <span className={`px-2.5 py-1 text-xs rounded-full ${config.className}`}>
      {config.label}
    </span>
  );
}