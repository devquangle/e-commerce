import { useState } from "react";
import { SearchX, Package } from "lucide-react";

import GenreStatusBadge from "./GenreStatusBadge";
import GenreActionButtons from "./GenreActionButtons";
import type { GenreResponse } from "../types/genre.type";

type Props = {
  genres: GenreResponse[];
  onEdit: (genre: GenreResponse) => void;
  onDelete: (genre: GenreResponse) => void;
};

export default function GenreMobileCard({
  genres,
  onEdit,
  onDelete,
}: Props) {


  if (!genres.length) {
    return (
      <div className="md:hidden flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="p-3 bg-slate-50 rounded-full text-slate-400 mb-2">
          <SearchX size={32} strokeWidth={1.5} />
        </div>

        <span className="text-sm font-medium text-slate-600">
          Không tìm thấy thể loại nào
        </span>

        <p className="text-xs text-slate-400 mt-1">
          Hãy thử thay đổi từ khóa tìm kiếm.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:hidden">
      {genres.map((genre) => (
        <div
          key={genre.id}
          className="card-custom space-y-4"
        >
          {/* HEADER */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={genre.urlImage || "/default-avatar.png"}
                alt={genre.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
              />

              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900 truncate">
                  {genre.name}
                </h3>

                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                  <Package size={13} />
                  <span>
                    {genre.totalProduct} sản phẩm
                  </span>
                </div>
              </div>
            </div>

            <GenreStatusBadge status={genre.status} />
          </div>

          {/* INFO */}
          <div className="rounded-xl bg-slate-50 p-3">
           

            <div className="flex justify-between text-sm mt-2">
              <span className="text-slate-500">
                Tổng sản phẩm
              </span>

              <span className="font-medium text-slate-900">
                {genre.totalProduct}
              </span>
            </div>
          </div>

          {/* ACTION */}
          <GenreActionButtons
            item={genre}
            onEdit={onEdit}
            onDelete={onDelete}
            mobile
          />
        </div>
      ))}
    </div>
  );
}