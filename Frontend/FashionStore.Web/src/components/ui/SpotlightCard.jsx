import { useRef, useState } from "react";

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(0, 217, 255, 0.15)",
  borderColor = "rgba(255, 255, 255, 0.08)",
  hoverBorderColor = "rgba(0, 217, 255, 0.4)",
  onClick,
  ...props
}) {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border bg-[#0d0d14]/80 backdrop-blur-xl transition-all duration-300 ${className}`}
      style={{
        borderColor: opacity ? hoverBorderColor : borderColor,
        boxShadow: opacity
          ? "0 0 30px rgba(0, 217, 255, 0.08), 0 20px 40px rgba(0, 0, 0, 0.4)"
          : "0 10px 30px rgba(0, 0, 0, 0.3)",
      }}
      {...props}
    >
      {/* Spotlight neon gradient following cursor */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}

