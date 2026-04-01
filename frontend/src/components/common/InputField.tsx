import type {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form";
import { useState } from "react";

interface InputFieldProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: Path<T>;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  rules?: RegisterOptions<T, Path<T>>;
  error?: FieldError;
  required?: boolean;
}

export default function InputField<T extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  register,
  rules,
  error,
  required = false, 
}: InputFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const isNumber = type === "number";

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const inputPlaceholder = isPassword
    ? "••••••••"
    : isNumber
      ? "0"
      : placeholder;
  const hasRequiredRule = rules?.required !== undefined;
  return (
    <div className="flex flex-col gap-1">
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {(required || hasRequiredRule) && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
      )}

      {/* Wrapper - Bỏ focus-within và hover */}
      <div
        className={`relative flex items-center rounded-xl border transition-all duration-200
    ${error
            ? "border-red-500 bg-red-50"
            : "border-gray-200 bg-[#edf2f9] focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
          }`}
      >
        {/* Input - Thêm outline-none */}
        <input
          id={name}
          type={inputType}
          placeholder={inputPlaceholder}
          {...register(name, rules)}
          className="w-full bg-transparent px-4 py-2 text-gray-800 outline-none pr-10 rounded-xl"
        />

        {/* Toggle button for password */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:cursor-pointer"
          >
            {showPassword ? (
              // eye off
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                  d="M3 3l18 18M10.584 10.587a2 2 0 002.829 2.828M9.88 4.88A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-1.563 3.029M6.1 6.1A9.953 9.953 0 002.458 12C3.732 16.057 7.523 19 12 19c1.042 0 2.05-.151 3-.433" />
              </svg>
            ) : (
              // eye
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-600 text-sm mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
}