import { ExternalLink } from "lucide-react";
import PublisherStatusBadge from "./PublisherStatusBadge";
import PublisherActionButtons from "./PublisherActionButtons";
import { useState } from "react";
import type { PublisherResponse } from "../types/publisher.type";
import { SearchX } from "lucide-react";
type Props = {
  publishers: PublisherResponse[];
  onEdit: (publisher: PublisherResponse) => void;
  onDelete: (publisher: PublisherResponse) => void;
};

const PublisherMobileCard = ({ publishers, onEdit, onDelete }: Props) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };
  return (
    <div className="space-y-4 md:hidden">
      {publishers && publishers.length > 0 ? (
        publishers.map((publisher) => (
          <div key={publisher.id} className="space-y-3 card-custom">
            {/* TITLE */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                

                <div className="flex flex-col">
                  {publisher.urlBio ? (
                    <a
                      href={publisher.urlBio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1 font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                    >
                      <span>{publisher.name}</span>
                      <ExternalLink
                        size={14}
                        className="text-slate-400 group-hover:text-indigo-500 transition-colors"
                      />
                    </a>
                  ) : (
                    <span className="font-semibold text-slate-900">
                      {publisher.name}
                    </span>
                  )}
                </div>
              </div>
              <PublisherStatusBadge status={publisher.status} />
            </div>

            {/* DESCRIPTION */}
            <div className="py-4 px-4 text-slate-500 text-xs max-w-[260px]">
              <div className="space-y-1">
                <p
                  className={`text-xs text-slate-500 leading-relaxed wrap-break-word ${
                    expandedId === publisher.id ? "" : "line-clamp-2"
                  }`}
                >
                  {publisher.description}
                </p>

                {publisher.description && publisher.description.length > 120 && (
                  <button
                    onClick={() => toggle(publisher.id)}
                    className="text-xs font-medium text-indigo-500 hover:text-indigo-600 hover:underline transition-colors mt-1 focus:outline-none"
                  >
                    {expandedId === publisher.id ? "Thu gọn" : "Xem thêm"}
                  </button>
                )}
              </div>
            </div>

            {/* ACTION */}
            <PublisherActionButtons
              item={publisher}
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

export default PublisherMobileCard;
