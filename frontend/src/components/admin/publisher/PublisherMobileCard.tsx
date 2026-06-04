import { BookOpen, Building2 } from "lucide-react";
import PublisherStatusBadge from "./PublisherStatusBadge";
import PublisherActionButtons from "./PublisherActionButtons";

type Props = {
  publishers: any[];
  onEdit: (publisher: any) => void;
  onDelete: (publisher: any) => void;
};

const PublisherMobileCard = ({ publishers, onEdit, onDelete }: Props) => {
  return (
    <div className="space-y-4 md:hidden">
      {publishers.map((publisher) => (
        <div key={publisher.id} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          {/* TITLE */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-600 border border-slate-200">
                 <Building2 size={18} />
              </div>
              <div className="text-base font-bold text-slate-800">{publisher.name}</div>
            </div>
            <PublisherStatusBadge status={publisher.status} />
          </div>

          <div className="text-sm text-slate-500 line-clamp-2">
            {publisher.address}
          </div>

          {/* INFO */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-sm text-slate-600">
            <span className="font-medium text-slate-500">Số lượng sách:</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800">
              <BookOpen size={13} className="text-slate-500" />
              {publisher.bookCount || 0} cuốn
            </span>
          </div>

          {/* ACTION */}
          <PublisherActionButtons item={publisher} onEdit={onEdit} onDelete={onDelete} mobile />
        </div>
      ))}
    </div>
  );
};

export default PublisherMobileCard;
