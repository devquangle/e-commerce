import SeriesStatusBadge from "./SeriesStatusBadge";
import SeriesActionButtons from "./SeriesActionButtons";
import { useState } from "react";
import { SearchX } from "lucide-react";
import type { SeriesResponse } from "../types/series.type";

type Props = {
  series: SeriesResponse[];
  onEdit: (series: SeriesResponse) => void;
  onDelete: (series: SeriesResponse) => void;
};

const SeriesMobileCard = ({ series, onEdit, onDelete }: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };
  
  return (
    <div className="space-y-4 md:hidden">
      {series && series.length > 0 ? (
        series.map((item) => (
          <div key={item.id} className="space-y-3 card-custom">
            {/* TITLE & STATUS */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900">
                    {item.name}
                  </span>
                  {item.slug && (
                    <span className="text-xs text-slate-500">
                      {item.slug}
                    </span>
                  )}
                </div>
              </div>
              <SeriesStatusBadge status={item.status} />
            </div>

            {/* DESCRIPTION */}
            {item.description && (
              <div className="text-slate-500 text-xs">
                <div className="space-y-1">
                  <p
                    className={`text-xs text-slate-500 leading-relaxed wrap-break-word ${
                      expandedId === item.id ? "" : "line-clamp-2"
                    }`}
                  >
                    {item.description}
                  </p>

                  {item.description.length > 120 && (
                    <button
                      onClick={() => toggle(item.id)}
                      className="text-xs font-medium text-indigo-500 hover:text-indigo-600 hover:underline transition-colors mt-1 focus:outline-none"
                    >
                      {expandedId === item.id ? "Thu gọn" : "Xem thêm"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ACTION */}
            {!(item.name === "Khác") && (
              <SeriesActionButtons
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
                mobile
              />
            )}
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="p-3 bg-slate-50 rounded-full text-slate-400 mb-2">
            <SearchX size={32} strokeWidth={1.5} />
          </div>
          <span className="text-sm font-medium text-slate-600">
            Không tìm thấy Series nào
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
