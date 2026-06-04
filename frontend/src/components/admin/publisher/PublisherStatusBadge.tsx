type Props = {
  status: "ACTIVE" | "INACTIVE";
};

export default function PublisherStatusBadge({ status }: Props) {
  const statusClass = status === "ACTIVE" 
    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
    : "bg-slate-100 text-slate-600 border border-slate-200";
    
  const statusLabel = status === "ACTIVE" ? "Hoạt động" : "Ngừng hoạt động";

  return (
    <span className={`px-2.5 py-1 text-xs rounded-full ${statusClass}`}>
      {statusLabel}
    </span>
  )
}
