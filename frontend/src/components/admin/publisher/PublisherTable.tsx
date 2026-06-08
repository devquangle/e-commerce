import { Building2, SearchX } from "lucide-react";
import PublisherStatusBadge from "./PublisherStatusBadge";
import PublisherActionButtons from "./PublisherActionButtons";
import type { PublisherResponse } from "@/types/publisher";
import { useState } from "react";

type Props = {
  publishers: PublisherResponse[];
  onEdit: (publisher: PublisherResponse) => void;
  onDelete: (publisher: PublisherResponse) => void;
};

export default function PublisherTable({ publishers, onEdit, onDelete }: Props) {
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
              Tên NXB
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">
              Địa chỉ
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
          {publishers && publishers.length > 0 ? (
            publishers.map((publisher, index) => (
              <tr
                key={publisher?.id}
                className="hover:bg-slate-50/60 transition-colors"
              >
                {/* STT */}
                <td className="py-4 px-4">{index + 1}</td>

                {/* NAME */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-600 border border-slate-200">
                      <Building2 size={18} />
                    </div>
                    <span className="font-semibold text-slate-900">
                      {publisher.name}
                    </span>
                  </div>
                </td>

                {/* ADDRESS */}
                <td className="py-4 px-4 text-slate-500 text-xs max-w-[260px]">
                  <div className="space-y-1">
                    <p
                      className={`text-xs text-slate-500 leading-relaxed wrap-break-word ${
                        expandedId === publisher.id ? "" : "line-clamp-2"
                      }`}
                    >
                      {publisher.street}
                    </p>

                    {publisher.street && publisher.street.length > 120 && (
                      <button
                        onClick={() => toggle(publisher.id)}
                        className="text-xs font-medium text-indigo-500 hover:text-indigo-600 hover:underline transition-colors mt-1 focus:outline-none"
                      >
                        {expandedId === publisher.id ? "Thu gọn" : "Xem thêm"}
                      </button>
                    )}
                  </div>
                </td>

                {/* STATUS */}
                <td className="py-4 px-4">
                  <PublisherStatusBadge status={publisher?.status} />
                </td>

                {/* ACTION */}
                <td className="py-4 px-4 text-right">
                  <PublisherActionButtons
                    item={publisher}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-12 text-center text-slate-400">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="p-3 bg-slate-50 rounded-full text-slate-400 mb-1 animate-pulse">
                    <SearchX size={32} strokeWidth={1.5} />
                  </div>

                  <span className="text-sm font-medium text-slate-600">
                    Không tìm thấy nhà xuất bản nào
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
