import { LoaderCircle } from "lucide-react";

// Các kiểu button
const buttonVariants = {
  primary: "bg-ink text-white hover:bg-accent hover:text-ink",

  secondary: "bg-accent text-ink hover:bg-[#b7e55c]",

  outline: "border border-line bg-transparent text-ink hover:border-ink",

  ghost: "bg-transparent text-ink hover:bg-paper-dark",

  danger: "bg-danger text-white hover:bg-red-700",
};

// Các kích thước button
const buttonSizes = {
  small: "px-3 py-2 text-xs",

  medium: "px-5 py-3 text-sm",

  large: "px-7 py-4 text-sm",
};

function Button({
  children,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...rest
}) {
  const variantClass = buttonVariants[variant] || buttonVariants.primary;

  const sizeClass = buttonSizes[size] || buttonSizes.medium;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-control
                font-semibold
                interactive-transition
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-50
                ${variantClass}
                ${sizeClass}
                ${className}
            `}
      {...rest}
    >
      {loading && <LoaderCircle size={16} className="animate-spin" />}

      {children}
    </button>
  );
}

export default Button;
