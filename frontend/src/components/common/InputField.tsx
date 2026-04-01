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
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* Wrapper */}
      <div
        className={`relative flex items-center rounded-lg border bg-gray-50 transition
        ${
          error
            ? "border-red-400 focus-within:ring-2 focus-within:ring-red-200"
            : "border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 hover:border-gray-400"
        }`}
      >
        {/* Input */}
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name, rules)}
          className="w-full bg-transparent px-4 py-2 text-gray-800 outline-none"
        />
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