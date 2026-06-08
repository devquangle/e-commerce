import { Library, SearchX } from "lucide-react";
import SeriesStatusBadge from "./SeriesStatusBadge";
import SeriesActionButtons from "./SeriesActionButtons";
import { useState } from "react";
import type { SeriesResponse } from "@/types/series";

type Props = {
  seriesList: SeriesResponse[];
  onEdit: (series: SeriesResponse) => void;
  onDelete: (series: SeriesResponse) => void;
};

const SeriesMobileCard = ({ seriesList, onEdit, onDelete }: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4 md:hidden">
      {seriesList && seriesList.length > 0 ? (
        seriesList.map((series) => (
          <div key={series.id} className="space-y-3 card-custom">
            {/* TITLE */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-violet-100 text-violet-600 border border-slate-200">
                  <Library size={18} />
                </div>
                <div className="text-base font-bold text-slate-800">
                  {series.name}
                </div>
              </div>
              <SeriesStatusBadge status={series.status} />
            </div>

            {/* DESCRIPTION */}
            <div className="py-4 px-4 text-slate-500 text-xs max-w-[260px]">
              <div className="space-y-1">
                <p
                  className={`text-xs text-slate-500 leading-relaxed wrap-break-word ${
                    expandedId === series.id ? "" : "line-clamp-2"
                  }`}
                >
                  {series.description}
                </p>

                {series.description && series.description.length > 120 && (
                  <button
                    onClick={() => toggle(series.id)}
                    className="text-xs font-medium text-indigo-500 hover:text-indigo-600 hover:underline transition-colors mt-1 focus:outline-none"
                  >
                    {expandedId === series.id ? "Thu gọn" : "Xem thêm"}
                  </button>
                )}
              </div>
            </div>

            {/* ACTION */}
            <SeriesActionButtons
              item={series}
              onEdit={onEdit}
              onDelete={onDelete}
              mobile
            />
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="p-3 bg-slate-50 rounded-full text-slate-400 mb-2">
            <SearchX size={32} strokeWidth={1.5} />
          </div>
          <span className="text-sm font-medium text-slate-600">
            Không tìm thấy series nào
          </span>
          <p className="text-xs text-slate-400 max-w-60 mt-1 leading-relaxed">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc xem sao nhé.
          </p>
        </div>
      )}
    </div>
  );
};

export default SeriesMobileCard;
