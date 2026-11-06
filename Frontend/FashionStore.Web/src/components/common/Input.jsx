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
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-semibold text-ink"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? messageId : undefined}
        className={`
                    w-full
                    rounded-control
                    border
                    bg-white
                    px-4
                    py-3
                    text-sm
                    text-ink
                    outline-none
                    transition
                    placeholder:text-muted-light
                    focus:border-ink
                    focus:ring-2
                    focus:ring-ink/5
                    ${error ? "border-danger" : "border-line"}
                `}
        {...rest}
      />

      {error && (
        <p id={messageId} className="mt-2 text-xs text-danger">
          {error}
        </p>
      )}

      {!error && hint && (
        <p id={messageId} className="mt-2 text-xs text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

export default Input;
