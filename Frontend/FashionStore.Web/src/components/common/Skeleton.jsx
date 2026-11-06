function Skeleton({ variant = "text", className = "", count = 1 }) {
  const variants = {
    text: "h-4 w-full rounded",

    title: "h-7 w-2/3 rounded",

    circle: "aspect-square w-12 rounded-full",

    image: "aspect-[3/4] w-full rounded-editorial",

    card: "h-64 w-full rounded-editorial",
  };

  const variantClass = variants[variant] || variants.text;

  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`
                        animate-pulse
                        bg-paper-dark
                        ${variantClass}
                        ${className}
                    `}
        />
      ))}
    </div>
  );
}

export default Skeleton;
