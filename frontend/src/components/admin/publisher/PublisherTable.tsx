import { BookOpen, Building2 } from "lucide-react";
import PublisherStatusBadge from "./PublisherStatusBadge";
import PublisherActionButtons from "./PublisherActionButtons";

type Props = {
  publishers: any[];
  onEdit: (publisher: any) => void;
  onDelete: (publisher: any) => void;
};

export default function PublisherTable({ publishers, onEdit, onDelete }: Props) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-slate-500">
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50 first:rounded-l-lg last:rounded-r-lg">
              Tên NXB
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50">
              Địa chỉ
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
          {publishers.map((publisher) => (
            <tr key={publisher.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-600 border border-slate-200">
                     <Building2 size={18} />
                  </div>
                  <span className="font-semibold text-slate-900">{publisher.name}</span>
                </div>
              </td>
              <td className="py-4 px-4 text-slate-500 text-xs max-w-[200px] truncate">
                {publisher.address}
              </td>
              <td className="py-4 px-4 text-slate-600">
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-md font-semibold">
                  <BookOpen size={13} className="text-slate-500" />
                  {publisher.bookCount || 0} cuốn
                </span>
              </td>
              <td className="py-4 px-4">
                <PublisherStatusBadge status={publisher.status} />
              </td>
              <td className="py-4 px-4 text-right">
                <div className="inline-flex gap-2">
                  <PublisherActionButtons item={publisher} onEdit={onEdit} onDelete={onDelete} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
