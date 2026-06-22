import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
  onView?: () => void;
};

export default function ActionButtons({ onEdit, onDelete, onView }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative flex justify-center" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
      >
        <MoreHorizontal size={18} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 w-36 bg-white rounded-xl border shadow-lg py-1 animate-in fade-in">
          {onView && (
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-600"
              onClick={() => { onView(); setOpen(false); }}
            >
              <Eye size={14} /> Xem
            </button>
          )}
          <button
            className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-600"
            onClick={() => { onEdit(); setOpen(false); }}
          >
            <Pencil size={14} /> Chỉnh sửa
          </button>
          <button
            className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-500"
            onClick={() => { onDelete(); setOpen(false); }}
          >
            <Trash2 size={14} /> Xoá
          </button>
        </div>
      )}
    </div>
  );
}
