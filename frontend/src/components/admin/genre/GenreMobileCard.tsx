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
      {genres.map((genre) => (
        <div
          key={genre.id}
          className="space-y-3 card-custom"
        >
          {/* TITLE */}
          <div className="flex items-start justify-between">
            <div className="text-base font-bold text-slate-800">
              {genre.name}
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