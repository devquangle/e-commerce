import { BookOpen } from "lucide-react";
import AuthorStatusBadge from "./AuthorStatusBadge";
import AuthorActionButtons from "./AuthorActionButtons";

type Props = {
  authors: any[];
  onEdit: (author: any) => void;
  onDelete: (author: any) => void;
};

const AuthorMobileCard = ({ authors, onEdit, onDelete }: Props) => {
  return (
    <div className="space-y-4 md:hidden">
      {authors.map((author) => (
        <div key={author.id} className="space-y-3 card-custom">
          {/* TITLE */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img
                src={author.avatarUrl}
                alt={author.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div className="text-base font-bold text-slate-800">{author.name}</div>
            </div>
            <AuthorStatusBadge status={author.status} />
          </div>

          <div className="text-sm text-slate-500 line-clamp-2">
            {author.description}
          </div>

          {/* INFO */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-sm text-slate-600">
            <span className="font-medium text-slate-500">Số lượng sách:</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800">
              <BookOpen size={13} className="text-slate-500" />
              {author.bookCount || 0} cuốn
            </span>
          </div>

          {/* ACTION */}
          <AuthorActionButtons item={author} onEdit={onEdit} onDelete={onDelete} mobile />
        </div>
      ))}
    </div>
  );
};

export default AuthorMobileCard;
