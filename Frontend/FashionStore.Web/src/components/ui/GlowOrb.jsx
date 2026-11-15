/**
 * GlowOrb — decorative ambient light orb for dark backgrounds.
 *
 * Props:
 *  color    "cyan" | "purple" | "lime"   — neon color preset
 *  size     number (px)                  — diameter, default 600
 *  opacity  number 0-1                   — default 0.18
 *  top      string                       — CSS top value  (e.g. "-200px", "30%")
 *  left     string                       — CSS left value
 *  right    string                       — CSS right value
 *  bottom   string                       — CSS bottom value
 *  style    object                       — extra inline styles merged in
 */

const COLOR_MAP = {
    cyan: 'rgba(0, 217, 255, 1)',
    purple: 'rgba(124, 58, 237, 1)',
    lime: 'rgba(163, 230, 53, 1)',
};

export default function GlowOrb({
    color = 'cyan',
    size = 600,
    opacity = 0.18,
    top,
    left,
    right,
    bottom,
    style = {},
}) {
    const baseColor = COLOR_MAP[color] ?? COLOR_MAP.cyan;

    const orbStyle = {
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at center, ${baseColor} 0%, transparent 70%)`,
        opacity,
        filter: 'blur(100px)',
        pointerEvents: 'none',
        top,
        left,
        right,
        bottom,
        ...style,
    };

    return <div aria-hidden="true" style={orbStyle} />;
}
