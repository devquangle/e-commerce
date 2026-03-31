import type {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form";

interface InputFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  rules?: RegisterOptions<T, Path<T>>;
  error?: FieldError;
}

export default function InputField<T extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  register,
  rules,
  error,
}: InputFieldProps<T>) {
  return (
    <div className="flex flex-col gap-1">
      {/* Label */}
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      {/* Input */}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        className={`w-full rounded-lg px-4 py-2 text-gray-800 outline-none transition
        ${error
          ? "border border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
          : "border border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        }`}
      />

      {/* Error */}
      {error && (
        <p className="text-red-600 text-sm mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
}