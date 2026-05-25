import { useEffect, useMemo, useRef, useState } from "react";
import { Check, X, Search, ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface Props {
  label?: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function SelectedMutil({
  label,
  options,
  value = [],
  onChange,
  placeholder = "Chọn...",
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lọc danh sách dựa trên từ khóa tìm kiếm
  const filteredOptions = useMemo(() => {
    return options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const optionLabelByValue = useMemo(() => {
    return new Map(options.map((option) => [option.value, option.label]));
  }, [options]);

  const toggleValue = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  return (
    <div ref={containerRef} className="relative w-full space-y-1.5">
      {/* Label */}
      {label && (
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <div
        onClick={() => !disabled && setOpen(!open)}
        className={`w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between min-h-11 transition-all hover:border-slate-350 ${
          disabled ? "bg-slate-100 cursor-not-allowed opacity-60" : "focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100"
        }`}
      >
        <div className="flex flex-wrap gap-1.5 items-center pr-4">
          {value.length === 0 ? (
            <span className="text-slate-400 text-sm select-none">{placeholder}</span>
          ) : (
            value.map((val) => (
              <span
                key={val}
                className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-semibold border border-indigo-100 animate-fade-in"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleValue(val);
                }}
              >
                {optionLabelByValue.get(val) ?? val}
                <X size={10} className="hover:text-indigo-900 ml-0.5 cursor-pointer shrink-0" />
              </span>
            ))
          )}
        </div>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-250 shrink-0 ${
            open ? "rotate-180 text-indigo-500" : ""
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      <div
        className={`absolute left-0 right-0 z-50 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg transition-all duration-200 origin-top overflow-hidden p-2 space-y-2 ${
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Search Input Box */}
        <div className="relative">
          <div className="absolute left-3 top-2.5 text-slate-400">
            <Search size={14} />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm danh sách..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-250 bg-slate-50/50 outline-none transition focus:border-indigo-500 focus:bg-white"
            onClick={(e) => e.stopPropagation()}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-650 cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Options List */}
        <div className="max-h-52 overflow-y-auto space-y-0.5">
          {filteredOptions.map((opt) => {
            const isSelected = value.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => toggleValue(opt.value)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer select-none transition ${
                  isSelected
                    ? "bg-indigo-50 text-indigo-900 font-semibold"
                    : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={14} className="text-indigo-600 shrink-0" />}
              </div>
            );
          })}

          {filteredOptions.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-400 italic">
              Không tìm thấy kết quả phù hợp
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
