import SelectBox from "@/components/common/SelectedBox";
import { RotateCcw, Search } from "lucide-react";
import { BaseStatus, getBaseStatusLabel } from "@/types/status";

interface GenreFilterProps {
  keyword: string;
  status: BaseStatus | null;

  onKeywordChange: (value: string) => void;
  onStatusChange: (value: BaseStatus | null) => void;
  onReset: () => void;
}

export default function GenreFilter({
  keyword,
  status,
  onKeywordChange,
  onStatusChange,
  onReset,
}: GenreFilterProps) {
  const statusOptions = [
    {
      label: "Tất cả trạng thái",
      value: null,
    },

    ...(Object.values(BaseStatus) as BaseStatus[]).map(
      (value) => ({
        label: getBaseStatusLabel(value),
        value,
      })
    ),
  ];

  return (
    <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4 md:items-center">
      <div className="relative md:col-span-2">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          value={keyword}
          onChange={(e) =>
            onKeywordChange(e.target.value)
          }
          placeholder="Tìm theo tên thể loại..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5"
        />
      </div>

      <SelectBox<BaseStatus | null>
        options={statusOptions}
        value={status}
        onChange={onStatusChange}
        searchable={false}
      />

      <button
        onClick={onReset}
        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5"
      >
        <RotateCcw size={16} />
        Làm mới
      </button>
    </div>
  );
}