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
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsListRef = useRef<HTMLDivElement>(null);

  // Lọc danh sách dựa trên từ khóa tìm kiếm
  const filteredOptions = useMemo(() => {
    return options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const optionLabelByValue = useMemo(() => {
    return new Map(options.map((option) => [option.value, option.label]));
  }, [options]);

  const toggleValue = useMemo(() => {
    return (val: string) => {
      if (disabled) return;
      if (value.includes(val)) {
        onChange(value.filter((v) => v !== val));
      } else {
        onChange([...value, val]);
    }
    };
  }, [disabled, value, onChange]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus vào ô input khi mở dropdown
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  // Tự động cuộn (Scroll into view) khi điều hướng bằng bàn phím
  useEffect(() => {
    if (highlightedIndex < 0 || !optionsListRef.current) return;
    
    const listContainer = optionsListRef.current;
    const highlightedElement = listContainer.children[highlightedIndex] as HTMLElement;
    
    if (highlightedElement) {
      const containerTop = listContainer.scrollTop;
      const containerBottom = containerTop + listContainer.clientHeight;
      const elemTop = highlightedElement.offsetTop;
      const elemBottom = elemTop + highlightedElement.clientHeight;

      if (elemTop < containerTop) {
        listContainer.scrollTop = elemTop;
      } else if (elemBottom > containerBottom) {
        listContainer.scrollTop = elemBottom - listContainer.clientHeight;
      }
    }
  }, [highlightedIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case "Escape":
          setOpen(false);
          setSearch("");
          setHighlightedIndex(-1);
          break;
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            toggleValue(filteredOptions[highlightedIndex].value);
          }
          break;
        default:
          break;
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, highlightedIndex, filteredOptions, toggleValue]);

  return (
    <div ref={containerRef} className="relative w-full space-y-1.5">
      {/* Label */}
      {label && (
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Select ${label || "options"}, ${value.length} selected`}
        className={`w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between min-h-11 transition-all hover:border-slate-300 ${
          disabled
            ? "bg-slate-100 cursor-not-allowed opacity-60"
            : "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
        }`}
      >
        <div className="flex flex-wrap gap-1.5 items-center pr-4">
          {value.length === 0 ? (
            <span className="text-slate-400 text-sm select-none">
              {placeholder}
            </span>
          ) : (
            value.map((val) => (
              <span
                key={val}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  disabled
                    ? "bg-slate-100 text-slate-500 border-slate-200"
                    : "bg-indigo-50 text-indigo-700 border-indigo-100 cursor-pointer hover:bg-indigo-100"
                }`}
                onClick={(e) => {
                  if (!disabled) {
                    e.stopPropagation();
                    toggleValue(val);
                  }
                }}
                role={!disabled ? "button" : undefined}
                tabIndex={!disabled ? 0 : undefined}
                onKeyDown={(e) => {
                  if (!disabled && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    toggleValue(val);
                  }
                }}
              >
                {optionLabelByValue.get(val) ?? val}
                {!disabled && (
                  <X
                    size={10}
                    className="hover:text-indigo-900 ml-0.5 cursor-pointer shrink-0"
                  />
                )}
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
      </button>

      {/* Dropdown Menu */}
      <div
        role="listbox"
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
            onChange={(e) => {
              setSearch(e.target.value);
              setHighlightedIndex(-1); // ĐÃ SỬA: Reset đồng bộ ngay tại handler
            }}
            placeholder="Tìm kiếm danh sách..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/50 outline-none transition focus:border-indigo-500 focus:bg-white"
            onClick={(e) => e.stopPropagation()}
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setHighlightedIndex(-1); // ĐÃ SỬA: Reset đồng bộ ngay tại handler
              }}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Options List */}
        <div 
          ref={optionsListRef}
          className="max-h-52 overflow-y-auto space-y-0.5"
        >
          {filteredOptions.map((opt, index) => {
            const isSelected = value.includes(opt.value);
            const isHighlighted = highlightedIndex === index;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => toggleValue(opt.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer select-none transition ${
                  isHighlighted
                    ? "bg-indigo-100 text-indigo-900"
                    : isSelected
                      ? "bg-indigo-50 text-indigo-900 font-semibold"
                      : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <Check size={14} className="text-indigo-600 shrink-0" />
                )}
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