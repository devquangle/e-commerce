import { RotateCcw, Search } from "lucide-react";
import SelectBox from "@/components/common/SelectedBox";
import { BaseStatus } from "@/types/status";

interface AuthorFilterProps {
  keyword: string;
  status: BaseStatus | null;

  statusOptions: {
    label: string;
    value: BaseStatus | null;
  }[];

  onKeywordChange: (value: string) => void;
  onStatusChange: (value: BaseStatus | null) => void;
  onReset: () => void;
}

export default function AuthorFilter({
  keyword,
  status,
  statusOptions,
  onKeywordChange,
  onStatusChange,
  onReset,
}: AuthorFilterProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          type="text"
          placeholder="Tìm theo tên tác giả..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white"
        />
      </div>

      <div className="w-full md:w-56">
        <SelectBox<BaseStatus | null>
          options={statusOptions}
          value={status}
          onChange={onStatusChange}
          searchable={false}
        />
      </div>

      <button
        onClick={onReset}
        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
      >
        <RotateCcw size={16} />
        Làm mới
      </button>
    </div>
  );
}