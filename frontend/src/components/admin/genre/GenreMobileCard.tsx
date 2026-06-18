import type { GenreResponse } from "@/types/genre";
import { BookOpen } from "lucide-react";

import GenreStatusBadge from "./GenreStatusBadge";
import GenreActionButtons from "./GenreActionButtons";

type Props = {
  genres: GenreResponse[];
  onEdit: (genre: GenreResponse) => void;
  onDelete: (genre: GenreResponse) => void;
};

const GenreMobileCard = ({
  genres,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <div className="space-y-4 md:hidden">
      {genres.map((genre, index) => (
        <div
          key={genre.id}
          className="space-y-3 card-custom"
        >
          {/* TITLE & IMAGE */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-slate-500 font-bold bg-slate-100 px-2 py-1 rounded-md text-xs">
                #{index + 1}
              </span>
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
              <div className="text-base font-bold text-slate-800">
                {genre.name}
              </div>
            </div>

            <GenreStatusBadge status={genre.status} />
          </div>

          {/* INFO */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-sm text-slate-600">
            <span className="font-medium text-slate-500">
              Số lượng sách:
            </span>

            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800">
              <BookOpen size={13} className="text-slate-500" />
              {genre.totalProduct || 0} cuốn
            </span>
          </div>

          {/* ACTION */}
          <GenreActionButtons
            genre={genre}
            onEdit={onEdit}
            onDelete={onDelete}
            mobile
          />
        </div>
      ))}
    </div>
  );
};

export default GenreMobileCard;