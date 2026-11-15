import { LoaderCircle } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const buttonVariants = {
  primary: "liquid-button-primary text-white",
  secondary: "liquid-button-secondary text-white",
  outline: "border border-white/15 bg-white/[0.035] text-white/85 hover:border-purple-200/40 hover:bg-white/[0.075]",
  ghost: "bg-transparent text-white/70 hover:bg-white/[0.06] hover:text-white",
  danger: "border border-rose-400/25 bg-rose-500/12 text-rose-200 hover:bg-rose-500/20",
};

const buttonSizes = {
  small: "px-3.5 py-2 text-xs",
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
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      whileTap={disabled || loading || reduceMotion ? undefined : { scale: 0.975 }}
      transition={{ type: "spring", stiffness: 520, damping: 30 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold interactive-transition disabled:cursor-not-allowed disabled:opacity-50 ${buttonVariants[variant] || buttonVariants.primary} ${buttonSizes[size] || buttonSizes.medium} ${className}`}
      {...rest}
    >
      {loading && <LoaderCircle size={16} className="animate-spin" />}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

export default Button;
