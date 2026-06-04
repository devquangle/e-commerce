import { BookOpen, Library } from "lucide-react";
import SeriesStatusBadge from "./SeriesStatusBadge";
import SeriesActionButtons from "./SeriesActionButtons";

type Props = {
  seriesList: any[];
  onEdit: (series: any) => void;
  onDelete: (series: any) => void;
};

const SeriesMobileCard = ({ seriesList, onEdit, onDelete }: Props) => {
  return (
    <div className="space-y-4 md:hidden">
      {seriesList.map((series) => (
        <div key={series.id} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          {/* TITLE */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-violet-100 text-violet-600 border border-slate-200">
                 <Library size={18} />
              </div>
              <div className="text-base font-bold text-slate-800">{series.name}</div>
            </div>
            <SeriesStatusBadge status={series.status} />
          </div>

          <div className="text-sm text-slate-500 line-clamp-2">
            {series.description}
          </div>

          {/* INFO */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-sm text-slate-600">
            <span className="font-medium text-slate-500">Số lượng sách:</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800">
              <BookOpen size={13} className="text-slate-500" />
              {series.bookCount || 0} cuốn
            </span>
          </div>

          {/* ACTION */}
          <SeriesActionButtons item={series} onEdit={onEdit} onDelete={onDelete} mobile />
        </div>
      ))}
    </div>
  );
};

export default SeriesMobileCard;
