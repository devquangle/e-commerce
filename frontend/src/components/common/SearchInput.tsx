import type {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form";
import { useState, useRef, useEffect } from "react";

// Đổi tên T1 -> TForm, T2 -> TOption để code tường minh, không bị nhầm lẫn
interface SearchInputProps<TForm extends FieldValues, TOption>
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "name" | "onChange" | "onSelect"
  > {
  label?: string;
  type?: string;
  name: Path<TForm>;
  register: UseFormRegister<TForm>;
  rules?: RegisterOptions<TForm, Path<TForm>>;
  error?: FieldError;
  required?: boolean;
  dataOptions: TOption[]; 
  displayKey: keyof TOption;
  onSelect?: (item: TOption) => void;
}

export default function SearchInput<TForm extends FieldValues, TOption>({
  label,
  name,
  placeholder,
  register,
  type = "text",
  rules,
  error,
  required = false,
  disabled = false,
  className = "",
  dataOptions,
  displayKey,
  onSelect,
  ...rest
}: SearchInputProps<TForm, TOption>) {
  const hasRequiredRule = rules?.required !== undefined;

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const { ref: registerRef, onChange: _onChange, ...registerRest } = register(name, rules);

  // Lọc danh sách theo query người dùng gõ
  const filtered =
    query.trim() === ""
      ? dataOptions
      : dataOptions.filter((item) =>
          String(item[displayKey])
            .toLowerCase()
            .includes(query.toLowerCase())
        );

  // Đóng dropdown khi click ra ngoài container
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** Xử lý khi chọn 1 item trong dropdown */
  // 💡 FIX: Đổi từ `item: T` thành `item: TOption` để khớp định nghĩa component
  function handleSelect(item: TOption) {
    const newValue = String(item[displayKey]);
    setQuery(newValue);
    setIsOpen(false);
    setHighlightIndex(-1);
    
    // Báo cho react-hook-form biết giá trị đã thay đổi
    _onChange({
      target: { name, value: newValue },
      type: "change",
    });

    onSelect?.(item);
  }

  /** Điều hướng keyboard trong dropdown */
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") setIsOpen(true);
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) => Math.min(prev + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        if (highlightIndex >= 0 && filtered[highlightIndex]) {
          e.preventDefault();
          handleSelect(filtered[highlightIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightIndex(-1);
        break;
    }
  }

  return (
    <div className="w-full space-y-1.5" ref={containerRef}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
          {(required || hasRequiredRule) && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        <div
          className={`
            flex h-11 items-center rounded-xl border transition-all
            ${
              error
                ? "border-red-500 bg-red-50"
                : "border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100"
            }
            ${disabled ? "bg-slate-100 opacity-70" : ""}
          `}
        >
          {/* Search icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-3 h-4 w-4 flex-shrink-0 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>

          <input
            id={name}
            type={type}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete="off"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setHighlightIndex(-1);
              _onChange(e); 
            }}
            onFocus={() => {
              if (!disabled) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            ref={registerRef}
            {...registerRest}
            {...rest}
            className={`
              h-full w-full bg-transparent px-3 text-sm
              text-slate-900 placeholder:text-slate-400
              outline-none
              ${className}
            `}
          />

          {/* Clear button */}
          {query && !disabled && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setIsOpen(false);
                setHighlightIndex(-1);
                _onChange({
                  target: { name, value: "" },
                  type: "change",
                });
              }}
              className="mr-3 flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Xóa tìm kiếm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Dropdown suggestions */}
        {isOpen && !disabled && filtered.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
            {filtered.map((item, idx) => (
              <div
                key={`${String(item[displayKey])}-${idx}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(item);
                }}
                onMouseEnter={() => setHighlightIndex(idx)}
                className={`
                  cursor-pointer select-none px-4 py-2.5 text-sm transition-colors
                  ${
                    idx === highlightIndex
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-slate-700 hover:bg-slate-50"
                  }
                `}
              >
                {String(item[displayKey])}
              </div>
            ))}
          </div>
        )}

        {/* Không tìm thấy kết quả */}
        {isOpen && !disabled && query.trim() !== "" && filtered.length === 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400 shadow-lg">
            Không tìm thấy kết quả cho &quot;{query}&quot;
          </div>
        )}
      </div>

      {/* Error message */}
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}