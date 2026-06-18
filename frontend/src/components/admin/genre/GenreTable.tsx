import type { GenreResponse } from "@/types/genre";
import { BookOpen } from "lucide-react";
import GenreStatusBadge from "./GenreStatusBadge";
import GenreActionButtons from "./GenreActionButtons";
type Props = {
  genres: GenreResponse[];
  onEdit: (genre: GenreResponse) => void;
  onDelete: (genre: GenreResponse) => void;
};

export default function GenreTable({ genres, onEdit, onDelete }: Props) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-slate-500 bg-slate-50">
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 first:rounded-l-lg">
              STT
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400">
              Tên thể loại
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50">
              Số sách liên quan
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
          {genres.map((genre, index) => (
            <tr
              key={genre.id}
              className="hover:bg-slate-50/50 transition-colors"
            >
              <td className="py-4 px-4 font-medium text-slate-500">
                {index + 1}
              </td>
              <td className="py-4 px-4 text-slate-900 font-semibold">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-200 shadow-sm flex items-center justify-center">
                    {genre.urlImage ? (
                      <img
                        src={genre.urlImage}
                        alt={genre.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-slate-400 font-bold text-lg bg-slate-100 w-full h-full flex items-center justify-center">
                        {genre.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span>{genre?.name}</span>
                </div>
              </td>

              <td className="py-4 px-4 text-slate-600">
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-md font-semibold">
                  <BookOpen size={13} className="text-slate-500" />
                  {genre.totalProduct || 0} cuốn
                </span>
              </td>

              <td className="py-4 px-4">
                <GenreStatusBadge status={genre.status} />
              </td>

              <td className="py-4 px-4 text-right">
                <div className="inline-flex gap-2">
                  <GenreActionButtons
                    genre={genre}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
