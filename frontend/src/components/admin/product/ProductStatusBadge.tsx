type Props = {
  status: "ACTIVE" | "INACTIVE";
};

const STATUS_CONFIG: Record<"ACTIVE" | "INACTIVE", { label: string; className: string }> = {
  ACTIVE: {
    label: "Đang bán",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
  },
  INACTIVE: {
    label: "Ngừng bán",
    className: "bg-slate-100 text-slate-600 border border-slate-200",
  },
};

export default function ProductStatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG["INACTIVE"];

  return (
    <span className={`px-2.5 py-1 text-xs rounded-full ${config.className}`}>
      {config.label}
    </span>
  );
}
