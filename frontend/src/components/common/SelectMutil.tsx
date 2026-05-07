import { useEffect, useMemo, useRef, useState } from "react";

interface Option<T> {
  label: string;
  value: T;
}

interface Props<T> {
  label: string;
  options: Option<T>[];
  value: T[];
  onChange: (value: T[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

const isEqual = <T,>(a: T, b: T) => a === b;

export default function SelectMulti<T>({
  label,
  options,
  value = [],
  onChange,
  placeholder = "Chọn...",
  disabled = false,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(() => {
    return options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const selectedOptions = useMemo(() => {
    return options.filter((o) => value.some((v) => isEqual(v, o.value)));
  }, [options, value]);

  const toggleValue = (val: T) => {
    if (value.some((v) => isEqual(v, val))) {
      onChange(value.filter((v) => !isEqual(v, val)));
    } else {
      onChange([...value, val]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <div ref={ref} className="relative w-full">
      {/* Label */}
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>

      {/* Trigger */}
      <div
        onClick={() => !disabled && setOpen(!open)}
        className={`border rounded-xl px-3 py-2 flex flex-wrap gap-1 items-center cursor-pointer ${
          disabled ? "bg-gray-100" : "hover:border-blue-500"
        }`}
      >
        {selectedOptions.length === 0 ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          selectedOptions.map((opt) => (
            <span
              key={String(opt.value)}
              className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
            >
              {opt.label}
            </span>
          ))
        )}
      </div>

      {/* Dropdown */}
      <div
        className={`absolute z-20 mt-1 w-full bg-white border rounded shadow-lg transition-all duration-150 origin-top ${
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Search */}
        <div className="p-2 border-b">
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm..."
            className="w-full px-2 py-1 border rounded"
          />
        </div>

        {/* Options */}
        <div className="max-h-60 overflow-auto">
          {filteredOptions.length === 0 && (
            <div className="p-2 text-gray-400 text-sm">
              Không có kết quả
            </div>
          )}

          {filteredOptions.map((opt) => {
            const checked = value.some((v) => isEqual(v, opt.value));

            return (
              <div
                key={String(opt.value)}
                onClick={() => toggleValue(opt.value)}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-blue-50"
              >
                <input type="checkbox" checked={checked} readOnly />
                <span>{opt.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
