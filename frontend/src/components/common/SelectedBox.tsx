import { ChevronDown, Search, X } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";

interface Option<T> {
  label: string;
  value: T;
}

interface Props<T> {
  label?: string;
  options: Option<T>[];
  value?: T | null;
  onChange: (value: T | null | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  required?: boolean;
  isClearable?: boolean;
}

const isEqual = <T,>(a: T, b: T) => a === b;

export default function SelectBox<T>({
  label,
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  disabled = false,
  searchable = true,
  required = false,
  isClearable = false,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(() => {
    return options.find((o) => value !== undefined && isEqual(o.value, value));
  }, [options, value]);

  const filteredOptions = useMemo(() => {
    if (!searchable || !search.trim()) return options;

    return options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search, searchable]);

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Tự động focus vào ô tìm kiếm khi mở menu công khai
  useEffect(() => {
    if (open && searchable) {
      inputRef.current?.focus();
    }
  }, [open, searchable]);

  // Đóng bằng phím Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-bold text-slate-600  tracking-wide">
          {label} {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}


      <div
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`
          w-full rounded-xl border border-slate-200 bg-white/70 h-11 px-4 text-sm 
          cursor-pointer flex items-center justify-between min-h-11 transition-all 
          hover:border-slate-300
          ${
            disabled
              ? "bg-slate-100 cursor-not-allowed opacity-60"
              : "focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100"
          }
        `}
      >
        <span
          className={`select-none ${selected ? "text-slate-800" : "text-slate-400"}`}
        >
          {selected ? selected.label : placeholder}
        </span>

        <div className="flex items-center gap-1.5 text-slate-400">
          {isClearable && selected && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(undefined);
                setSearch("");
              }}
              className="hover:text-red-500 transition-colors p-0.5 rounded-md hover:bg-slate-100"
            >
              <X size={15} />
            </button>
          )}
          <ChevronDown
            size={16}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      <div
        className={`
          absolute left-0 right-0 z-50 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg 
          transition-all duration-200 origin-top overflow-hidden p-2 space-y-2
          ${
            open
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }
        `}
      >
        {/* Search Input Box - ĐÃ ĐỒNG BỘ ĐẦY ĐỦ ICON VÀ NÚT XÓA */}
        {searchable && (
          <div className="relative">
            <div className="absolute left-3 top-2.5 text-slate-400 pointer-events-none">
              <Search size={14} />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm danh sách..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/50 outline-none transition focus:border-indigo-500 focus:bg-white"
              onClick={(e) => e.stopPropagation()}
            />
            {search && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearch("");
                }}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>
        )}

        {/* Options List */}
        <div className="max-h-52 overflow-y-auto space-y-0.5">
          {filteredOptions.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-400 italic">
              Không tìm thấy kết quả phù hợp
            </div>
          )}

          {filteredOptions.map((option) => {
            const isSelected =
              value !== undefined && isEqual(option.value, value);
            return (
              <div
                key={String(option.value)}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  setSearch("");
                }}
                className={`
                  px-3 py-2 rounded-lg text-xs cursor-pointer select-none transition
                  ${
                    isSelected
                      ? "bg-indigo-50 text-indigo-900 font-semibold"
                      : "hover:bg-slate-50 text-slate-700"
                  }
                `}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
