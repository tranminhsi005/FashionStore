import { LoaderCircle } from "lucide-react";

function Loading({
  label = "Đang tải dữ liệu...",
  size = 24,
  fullScreen = false,
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`
                flex
                items-center
                justify-center
                gap-3
                text-sm
                text-muted
                ${fullScreen ? "min-h-screen" : "py-10"}
            `}
    >
      <LoaderCircle size={size} className="animate-spin text-ink" />

      <span>{label}</span>
    </div>
  );
}

export default Loading;
