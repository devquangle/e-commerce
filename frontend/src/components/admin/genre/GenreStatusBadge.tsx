import { GenreStatus, GenreStatusLabel } from "@/types/genre";

type Props = {
  status: GenreStatus;
};

function statusClass(status: GenreStatus) {
  switch (status) {
    case GenreStatus.ACTIVE:
      return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";

    case GenreStatus.INACTIVE:
      return "bg-slate-100 text-slate-600 border border-slate-200";

    case GenreStatus.DELETED:
      return "bg-rose-50 text-rose-700 border border-rose-200/60";

    default:
      return "bg-slate-100 text-slate-600 border border-slate-200";
  }
}


export default function GenreStatusBadge({ status }: Props) {
  return (
    <span
      className={`px-2.5 py-1 text-xs rounded-full ${statusClass(status)}`}
    >
      {GenreStatusLabel[status]}
    </span>
  )
}
