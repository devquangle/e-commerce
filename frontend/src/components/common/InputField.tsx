import type {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form";
import { useState } from "react";

interface InputFieldProps<
  T extends FieldValues,
> extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  rules?: RegisterOptions<T, Path<T>>;
  error?: FieldError;
  required?: boolean;
  autoComplete?: string;
}

export default function InputField<T extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  register,
  rules,
  error,
  autoComplete,
  required = false,
  disabled = false,
  className = "",
  ...rest
}: InputFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const hasRequiredRule = rules?.required !== undefined;

  return (
    <div className="w-full space-y-1.5">
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

      <div
        className={`
          relative flex h-11 items-center rounded-xl border transition-all
          ${
            error
              ? "border-red-500 bg-red-50"
              : "border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100"
          }
          ${disabled ? "bg-slate-100 opacity-70" : ""}
        `}
      >
        <input
          id={name}
          type={inputType}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autoComplete || (isPassword ? "current-password" : "on")}
          {...register(name, rules)}
          {...rest}
          className={`
            h-full w-full rounded-xl bg-transparent px-4 text-sm
            text-slate-900 placeholder:text-slate-400
            outline-none
            ${isPassword ? "pr-10" : ""}
            ${className}
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
