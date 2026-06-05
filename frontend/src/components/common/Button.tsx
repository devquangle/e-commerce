import type { LucideIcon } from "lucide-react";
import React from "react";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "warning"
    | "outline";
  icon?: LucideIcon;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  color = "primary",
  icon: Icon,
  type = "button",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center  justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all active:scale-95 ";

  const colorStyles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
    outline:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
  };

  const disabledStyles =
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-inherit disabled:active:scale-100";

  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${colorStyles[color]}
        ${disabledStyles}
        ${className ?? ""}
      `}
      {...props}
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
};

export default Button;