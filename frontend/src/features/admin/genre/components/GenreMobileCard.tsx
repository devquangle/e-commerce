import { ExternalLink } from "lucide-react";
import GenreStatusBadge from "./GenreStatusBadge";
import GenreActionButtons from "./GenreActionButtons";
import { useState } from "react";
import type { GenreRes } from "../../types/genre.type";
import { SearchX } from "lucide-react";
type Props = {
  genres: GenreRes[];
  onEdit: (genre: GenreRes) => void;
  onDelete: (genre: GenreRes) => void;
};

const GenreMobileCard = ({ genres, onEdit, onDelete }: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };
  return (
    <div className="space-y-4 md:hidden">
      {genres && genres.length > 0 ? (
        genres.map((genre) => (
          <div key={genre.id} className="space-y-3 card-custom">
            {/* TITLE */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={genre.urlImage || "/default-avatar.png"}
                  alt={genre.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                />

                <div className="flex flex-col">
                  {genre.urlBio ? (
                    <a
                      href={genre.urlBio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1 font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                    >
                      <span>{genre.name}</span>
                      <ExternalLink
                        size={14}
                        className="text-slate-400 group-hover:text-indigo-500 transition-colors"
                      />
                    </a>
                  ) : (
                    <span className="font-semibold text-slate-900">
                      {genre.name}
                    </span>
                  )}
                </div>
              </div>
              <GenreStatusBadge status={genre.status} />
            </div>

            {/* DESCRIPTION */}
            <div className="py-4 px-4 text-slate-500 text-xs max-w-[260px]">
              <div className="space-y-1">
                <p
                  className={`text-xs text-slate-500 leading-relaxed wrap-break-word ${
                    expandedId === genre.id ? "" : "line-clamp-2"
                  }`}
                >
                  {genre.description}
                </p>

                {genre.description && genre.description.length > 120 && (
                  <button
                    onClick={() => toggle(genre.id)}
                    className="text-xs font-medium text-indigo-500 hover:text-indigo-600 hover:underline transition-colors mt-1 focus:outline-none"
                  >
                    {expandedId === genre.id ? "Thu gọn" : "Xem thêm"}
                  </button>
                )}
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
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="p-3 bg-slate-50 rounded-full text-slate-400 mb-2">
            <SearchX size={32} strokeWidth={1.5} />
          </div>
          <span className="text-sm font-medium text-slate-600">
            Không tìm thấy tác giả nào
          </span>
          <p className="text-xs text-slate-400 max-w-60 mt-1 leading-relaxed">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc xem sao nhé.
          </p>
        </div>
      )}
    </div>
  );
};

export default GenreMobileCard;
