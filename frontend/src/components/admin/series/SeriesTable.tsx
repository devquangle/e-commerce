import { Library, SearchX } from "lucide-react";
import SeriesStatusBadge from "./SeriesStatusBadge";
import SeriesActionButtons from "./SeriesActionButtons";
import type { SeriesResponse } from "@/types/series";
import { useState } from "react";

type Props = {
  seriesList: SeriesResponse[];
  onEdit: (series: SeriesResponse) => void;
  onDelete: (series: SeriesResponse) => void;
};

export default function SeriesTable({ seriesList, onEdit, onDelete }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50">
          <tr className="text-slate-500">
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">
              STT
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">
              Tên Series
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">
              Mô tả
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-right">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {seriesList && seriesList.length > 0 ? (
            seriesList.map((series, index) => (
              <tr
                key={series?.id}
                className="hover:bg-slate-50/60 transition-colors"
              >
                {/* STT */}
                <td className="py-4 px-4">{index + 1}</td>

                {/* NAME */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-violet-100 text-violet-600 border border-slate-200">
                      <Library size={18} />
                    </div>
                    <span className="font-semibold text-slate-900">
                      {series.name}
                    </span>
                  </div>
                </td>

                {/* DESCRIPTION */}
                <td className="py-4 px-4 text-slate-500 text-xs max-w-[260px]">
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
                </td>

                {/* STATUS */}
                <td className="py-4 px-4">
                  <SeriesStatusBadge status={series?.status} />
                </td>

                {/* ACTION */}
                <td className="py-4 px-4 text-right">
                  <SeriesActionButtons
                    item={series}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-12 text-center text-slate-400">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="p-3 bg-slate-50 rounded-full text-slate-400 mb-1 animate-pulse">
                    <SearchX size={32} strokeWidth={1.5} />
                  </div>

                  <span className="text-sm font-medium text-slate-600">
                    Không tìm thấy series nào
                  </span>
                  <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
                    Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc xem sao nhé.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
