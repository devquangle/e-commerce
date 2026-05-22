import { useState, useRef, useEffect, useMemo } from "react";

interface Option<T> {
  label: string;
  value: T;
}

interface Props<T> {
  label?: string;
  options: Option<T>[];
  value?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
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

  useEffect(() => {
    if (open && searchable) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, searchable]);

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
    <div ref={ref} className="relative w-full">
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label} <span className="text-red-500">*</span>
        </label>
      )}

      <div
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`
          border rounded-xl px-3 py-2 flex justify-between items-center
          transition cursor-pointer
          ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "hover:border-blue-500"
          }
        `}
      >
        <span className={selected ? "text-black" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </span>

        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      <div
        className={`
          absolute z-20 mt-1 w-full bg-white border rounded-xl shadow-lg
          transition-all duration-150 origin-top
          ${
            open
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }
        `}
      >
        {searchable && (
          <div className="p-2 border-b">
            <input
              ref={inputRef}
              type="text"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
        )}

        <div className="max-h-60 overflow-auto">
          {filteredOptions.length === 0 && (
            <div className="p-2 text-gray-400 text-sm">Không có kết quả</div>
          )}

          {filteredOptions.map((option) => (
            <div
              key={String(option.value)}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
                setSearch("");
              }}
              className={`
                px-3 py-2 cursor-pointer transition
                hover:bg-blue-100
                ${
                  isEqual(option.value, value as T)
                    ? "bg-blue-50 font-medium"
                    : ""
                }
              `}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
