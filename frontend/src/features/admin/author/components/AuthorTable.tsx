import AuthorStatusBadge from "./AuthorStatusBadge";
import AuthorActionButtons from "./AuthorActionButtons";
import type { AuthorRes } from "@/types/author";
import { ExternalLink, SearchX } from "lucide-react";
import { useState } from "react";

type Props = {
  authors: AuthorRes[];
  onEdit: (author: AuthorRes) => void;
  onDelete: (author: AuthorRes) => void;
};

export default function AuthorTable({ authors, onEdit, onDelete }: Props) {
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
              Tác giả
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
          {authors && authors.length > 0 ? (
            authors.map((author, index) => (
              <tr
                key={author?.id}
                className="hover:bg-slate-50/60 transition-colors"
              >
                {/* AUTHOR */}
                <td className="py-4 px-4">{index + 1}</td>
                <td className="py-4 px-4">
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
                </td>

                {/* DESCRIPTION */}
                <td className="py-4 px-4 text-slate-500 text-xs max-w-[260px]">
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
                </td>

                {/* STATUS */}
                <td className="py-4 px-4">
                  <AuthorStatusBadge status={author?.status} />
                </td>

                {/* ACTION */}
                <td className="py-4 px-4 text-right">
                  {!(author.name == "Khác" )&& (
                    <AuthorActionButtons
                      item={author}
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
                    Không tìm thấy tác giả nào
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
