import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Check, X, Search, ChevronDown } from "lucide-react";

type OptionValue = string | number;

interface Option<T extends OptionValue> {
  label: string;
  value: T;
}

interface Props<T extends OptionValue> {
  label?: string;
  options: Option<T>[];
  value: T[];
  onChange: (value: T[]) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function SelectedMutil<T extends OptionValue>({
  label,
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  disabled = false,
  required = false,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsListRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    return options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search]);

  const optionLabelByValue = useMemo(() => {
    return new Map<T, string>(
      options.map((option) => [option.value, option.label]),
    );
  }, [options]);

  const toggleValue = useCallback(
    (val: T) => {
      if (disabled) return;

      if (value.includes(val)) {
        onChange(value.filter((v) => v !== val));
      } else {
        onChange([...value, val]);
      }
    },
    [disabled, value, onChange],
  );

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (highlightedIndex < 0 || !optionsListRef.current) return;

    const listContainer = optionsListRef.current;

    const highlightedElement = listContainer.children[
      highlightedIndex
    ] as HTMLElement;

    if (!highlightedElement) return;

    const containerTop = listContainer.scrollTop;
    const containerBottom = containerTop + listContainer.clientHeight;

    const elemTop = highlightedElement.offsetTop;
    const elemBottom = elemTop + highlightedElement.clientHeight;

    if (elemTop < containerTop) {
      listContainer.scrollTop = elemTop;
    } else if (elemBottom > containerBottom) {
      listContainer.scrollTop = elemBottom - listContainer.clientHeight;
    }
  }, [highlightedIndex]);

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
            prev < filteredOptions.length - 1 ? prev + 1 : prev,
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
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [open, highlightedIndex, filteredOptions, toggleValue]);

  return (
    <div ref={containerRef} className="relative w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
          {label} {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full rounded-xl border border-slate-200 bg-white/70 h-11 px-4 text-sm flex items-center justify-between transition-all ${
          disabled
            ? "bg-slate-100 cursor-not-allowed opacity-60"
            : "cursor-pointer hover:border-slate-300"
        }`}
      >
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pr-4 whitespace-nowrap">
          {value.length === 0 ? (
            <span className="text-slate-400">{placeholder}</span>
          ) : (
            value.map((val) => (
              <span
                key={String(val)}
                className="inline-flex shrink-0 items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border bg-indigo-50 text-indigo-700 border-indigo-100 whitespace-nowrap"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleValue(val);
                }}
              >
                <span className="whitespace-nowrap">
                  {optionLabelByValue.get(val) ?? String(val)}
                </span>

                <X size={10} className="cursor-pointer shrink-0" />
              </span>
            ))
          )}
        </div>

        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        role="listbox"
        className={`absolute left-0 right-0 z-50 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg transition-all origin-top overflow-hidden p-2 space-y-2 ${
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-2.5 text-slate-400"
          />

          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setHighlightedIndex(-1);
            }}
            placeholder="Tìm kiếm..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:border-indigo-500"
          />

          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setHighlightedIndex(-1);
              }}
              className="absolute right-2 top-2"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div ref={optionsListRef} className="max-h-52 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, index) => {
              const isSelected = value.includes(opt.value);

              const isHighlighted = highlightedIndex === index;

              return (
                <div
                  key={String(opt.value)}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => toggleValue(opt.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition ${
                    isHighlighted
                      ? "bg-indigo-100 text-indigo-900"
                      : isSelected
                        ? "bg-indigo-50 text-indigo-900 font-semibold"
                        : "hover:bg-slate-50"
                  }`}
                >
                  <span>{opt.label}</span>

                  {isSelected && (
                    <Check size={14} className="text-indigo-600" />
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-6 text-center text-xs text-slate-400 italic">
              Không tìm thấy kết quả phù hợp
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
