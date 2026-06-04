import { BookOpen } from "lucide-react";
import AuthorStatusBadge from "./AuthorStatusBadge";
import AuthorActionButtons from "./AuthorActionButtons";

type Props = {
  authors: any[];
  onEdit: (author: any) => void;
  onDelete: (author: any) => void;
};

export default function AuthorTable({ authors, onEdit, onDelete }: Props) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-slate-500">
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50 first:rounded-l-lg last:rounded-r-lg">
              Tác giả
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
          {authors.map((author) => (
            <tr key={author.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <img
                    src={author.avatarUrl}
                    alt={author.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <span className="font-semibold text-slate-900">{author.name}</span>
                </div>
              </td>
              <td className="py-4 px-4 text-slate-500 text-xs max-w-[200px] truncate">
                {author.description}
              </td>
              <td className="py-4 px-4 text-slate-600">
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-md font-semibold">
                  <BookOpen size={13} className="text-slate-500" />
                  {author.bookCount || 0} cuốn
                </span>
              </td>
              <td className="py-4 px-4">
                <AuthorStatusBadge status={author.status} />
              </td>
              <td className="py-4 px-4 text-right">
                <div className="inline-flex gap-2">
                  <AuthorActionButtons item={author} onEdit={onEdit} onDelete={onDelete} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
