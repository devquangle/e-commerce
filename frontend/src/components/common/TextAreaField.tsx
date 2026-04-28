import type {
    FieldError,
    RegisterOptions,
    UseFormRegister,
    FieldValues,
    Path
} from "react-hook-form";

interface TextAreaFieldProps<T extends FieldValues> {
    label: string;
    name: Path<T>;
    placeholder?: string;
    register: UseFormRegister<T>;
    rules?: RegisterOptions<T, Path<T>>;
    error?: FieldError;
    rows?: number;
}

export default function TextAreaField<T extends FieldValues>({
    label,
    name,
    placeholder,
    register,
    rules,
    error,
    rows = 2
}: TextAreaFieldProps<T>) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">
                {label} <span className="text-red-500">*</span>
            </label>

            <textarea
                rows={rows}
                placeholder={placeholder}
                {...register(name, rules)}
                className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400
                ${error ? "border-red-500" : "border-gray-300"}`}
            />

            {error && (
                <p className="text-red-500 text-sm mt-1">
                    {error.message}
                </p>
            )}
        </div>
    );
}