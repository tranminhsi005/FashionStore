import { useRef } from "react";

/** Cursor-following glass highlight; uses CSS variables to avoid re-rendering on every pointer move. */
export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(182, 140, 255, 0.18)",
  borderColor = "rgba(255, 255, 255, 0.09)",
  hoverBorderColor = "rgba(196, 156, 255, 0.42)",
  onClick,
  ...props
}) {
  const cardRef = useRef(null);

  function handlePointerMove(event) {
    const element = cardRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
    element.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onClick={onClick}
      className={`spotlight-card ${className}`}
      style={{
        "--spotlight-color": spotlightColor,
        "--card-border": borderColor,
        "--card-border-hover": hoverBorderColor,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
