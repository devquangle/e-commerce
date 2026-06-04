import { BookOpen, Library } from "lucide-react";
import SeriesStatusBadge from "./SeriesStatusBadge";
import SeriesActionButtons from "./SeriesActionButtons";

type Props = {
  seriesList: any[];
  onEdit: (series: any) => void;
  onDelete: (series: any) => void;
};

export default function SeriesTable({ seriesList, onEdit, onDelete }: Props) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-slate-500">
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50 first:rounded-l-lg last:rounded-r-lg">
              Tên Series
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50">
              Mô tả
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50">
              Số sách
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50">
              Trạng thái
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50 text-right">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {seriesList.map((series) => (
            <tr key={series.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-violet-100 text-violet-600 border border-slate-200">
                     <Library size={18} />
                  </div>
                  <span className="font-semibold text-slate-900">{series.name}</span>
                </div>
              </td>
              <td className="py-4 px-4 text-slate-500 text-xs max-w-[200px] truncate">
                {series.description}
              </td>
              <td className="py-4 px-4 text-slate-600">
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-md font-semibold">
                  <BookOpen size={13} className="text-slate-500" />
                  {series.bookCount || 0} cuốn
                </span>
              </td>
              <td className="py-4 px-4">
                <SeriesStatusBadge status={series.status} />
              </td>
              <td className="py-4 px-4 text-right">
                <div className="inline-flex gap-2">
                  <SeriesActionButtons item={series} onEdit={onEdit} onDelete={onDelete} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
