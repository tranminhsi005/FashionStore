import { useId } from "react";

function Input({
  label,
  id,
  type = "text",
  placeholder = "",
  error = "",
  hint = "",
  className = "",
  ...rest
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const messageId = `${inputId}-message`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-white/85">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? messageId : undefined}
        className={`w-full rounded-control border bg-white/[0.045] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-purple-300/60 focus:bg-white/[0.065] focus:ring-2 focus:ring-purple-300/10 ${error ? "border-rose-400/60" : "border-white/10"}`}
        {...rest}
      />
      {error && <p id={messageId} className="mt-2 text-xs text-rose-300">{error}</p>}
      {!error && hint && <p id={messageId} className="mt-2 text-xs text-white/40">{hint}</p>}
    </div>
  );
}

export default Input;
