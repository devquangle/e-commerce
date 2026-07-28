import type {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form";

interface TextAreaFieldProps<T extends FieldValues = FieldValues>
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  name?: Path<T>;
  register?: UseFormRegister<T>;
  rules?: RegisterOptions<T, Path<T>>;
  error?: FieldError | string;
  required?: boolean;
}

export default function TextAreaField<T extends FieldValues = FieldValues>({
  label,
  name,
  placeholder,
  register,
  rules,
  error,
  rows = 4,
  required = false,
  disabled = false,
  className = "",
  value,
  onChange,
  ...rest
}: TextAreaFieldProps<T>) {
  const errorMessage = typeof error === "string" ? error : error?.message;
  const hasRequiredRule = rules?.required !== undefined;

  const registerProps = register && name ? register(name, rules) : {};

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={name || "textarea"}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
          {(required || hasRequiredRule) && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      <textarea
        id={name || "textarea"}
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...registerProps}
        {...rest}
        className={`w-full rounded-xl border p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all resize-none ${
          errorMessage
            ? "border-red-500 bg-red-50"
            : "border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        } ${disabled ? "bg-slate-100 opacity-70" : ""} ${className}`}
      />

      {errorMessage && (
        <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}