import GenreStatusBadge from "./GenreStatusBadge";
import GenreActionButtons from "./GenreActionButtons";

import { SearchX } from "lucide-react";
import type { GenreResponse } from "../types/genre.type";

type Props = {
  genres: GenreResponse[];
  onEdit: (genre: GenreResponse) => void;
  onDelete: (genre: GenreResponse) => void;
  page: number;
  pageSize: number;
};

export default function GenreTable({
  genres,
  onEdit,
  onDelete,
  page,
  pageSize,
}: Props) {

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50">
          <tr className="text-slate-500">
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">
              STT
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">
              Thể loại
            </th>

            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">
              Số sản phẩm
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
          {genres && genres.length > 0 ? (
            genres.map((genre, index) => (
              <tr
                key={genre?.id}
                className="hover:bg-slate-50/60 transition-colors"
              >
                {/* AUTHOR */}
                <td className="py-4 px-4">
                  {(page - 1) * pageSize + index + 1}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={genre.urlImage || "/default-avatar.png"}
                      alt={genre.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                    />
                    <span className="font-semibold text-slate-900">
                      {genre.name}
                    </span>
                  </div>
                </td>

                {/* DESCRIPTION */}
                <td className="py-4 px-4 text-slate-500 font-medium">
                  {genre.totalProduct || 0}
                </td>

                {/* STATUS */}
                <td className="py-4 px-4">
                  <GenreStatusBadge status={genre?.status} />
                </td>

                {/* ACTION */}
                <td className="py-4 px-4 text-right">
                  {!(genre.name == "Khác") && (
                    <GenreActionButtons
                      item={genre}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-12 text-center text-slate-400">
                <div className="flex flex-col items-center justify-center gap-2">
                  {/* Thêm ICON ở đây */}
                  <div className="p-3 bg-slate-50 rounded-full text-slate-400 mb-1 animate-pulse">
                    <SearchX size={32} strokeWidth={1.5} />
                  </div>

                  <span className="text-sm font-medium text-slate-600">
                    Không tìm thấy thể loại nào
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
