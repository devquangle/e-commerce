import { ExternalLink } from "lucide-react";
import AuthorStatusBadge from "./AuthorStatusBadge";
import AuthorActionButtons from "./AuthorActionButtons";
import { useState } from "react";
import type { AuthorRes } from "@/types/author";
import { SearchX } from "lucide-react";
type Props = {
  authors: AuthorRes[];
  onEdit: (author: AuthorRes) => void;
  onDelete: (author: AuthorRes) => void;
};

const AuthorMobileCard = ({ authors, onEdit, onDelete }: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };
  return (
    <div className="space-y-4 md:hidden">
      {authors && authors.length > 0 ? (
        authors.map((author) => (
          <div key={author.id} className="space-y-3 card-custom">
            {/* TITLE */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={author.urlImage || "/default-avatar.png"}
                  alt={author.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                />

                <div className="flex flex-col">
                  {author.urlBio ? (
                    <a
                      href={author.urlBio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1 font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                    >
                      <span>{author.name}</span>
                      <ExternalLink
                        size={14}
                        className="text-slate-400 group-hover:text-indigo-500 transition-colors"
                      />
                    </a>
                  ) : (
                    <span className="font-semibold text-slate-900">
                      {author.name}
                    </span>
                  )}
                </div>
              </div>
              <AuthorStatusBadge status={author.status} />
            </div>

            {/* DESCRIPTION */}
            <div className="py-4 px-4 text-slate-500 text-xs max-w-[260px]">
              <div className="space-y-1">
                <p
                  className={`text-xs text-slate-500 leading-relaxed wrap-break-word ${
                    expandedId === author.id ? "" : "line-clamp-2"
                  }`}
                >
                  {author.description}
                </p>

                {author.description && author.description.length > 120 && (
                  <button
                    onClick={() => toggle(author.id)}
                    className="text-xs font-medium text-indigo-500 hover:text-indigo-600 hover:underline transition-colors mt-1 focus:outline-none"
                  >
                    {expandedId === author.id ? "Thu gọn" : "Xem thêm"}
                  </button>
                )}
              </div>
            </div>

            {/* ACTION */}
            <AuthorActionButtons
              item={author}
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

export default AuthorMobileCard;
