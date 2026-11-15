/**
 * AnimatedGrid — SVG dot/line grid that pulses in opacity.
 * Mimics the grid background seen on reactbits.dev.
 *
 * Props:
 *  cellSize   number (px)   — grid cell size, default 48
 *  color      string        — grid line/dot color, default rgba(255,255,255,0.06)
 *  style      object        — extra inline styles for the outer wrapper
 *  className  string
 */

import { useId } from 'react';

export default function AnimatedGrid({
    cellSize = 48,
    color = 'rgba(255,255,255,0.06)',
    style = {},
    className = '',
}) {
    const patternId = useId();

    const wrapperStyle = {
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
    };

    return (
        <div aria-hidden="true" style={wrapperStyle} className={className}>
            <svg
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                style={{ position: 'absolute', inset: 0 }}
            >
                <defs>
                    <pattern
                        id={patternId}
                        width={cellSize}
                        height={cellSize}
                        patternUnits="userSpaceOnUse"
                    >
                        {/* vertical line */}
                        <line
                            x1={cellSize}
                            y1="0"
                            x2={cellSize}
                            y2={cellSize}
                            stroke={color}
                            strokeWidth="0.5"
                        />
                        {/* horizontal line */}
                        <line
                            x1="0"
                            y1={cellSize}
                            x2={cellSize}
                            y2={cellSize}
                            stroke={color}
                            strokeWidth="0.5"
                        />
                        {/* intersection dot */}
                        <circle
                            cx={cellSize}
                            cy={cellSize}
                            r="1"
                            fill={color}
                        />
                    </pattern>
                </defs>

                <rect
                    width="100%"
                    height="100%"
                    fill={`url(#${patternId})`}
                    style={{
                        animation: 'grid-pulse 6s ease-in-out infinite',
                    }}
                />
            </svg>

            {/* keyframes injected via style tag for self-containment */}
            <style>{`
                @keyframes grid-pulse {
                    0%, 100% { opacity: 0.6; }
                    50%       { opacity: 1; }
                }
            `}</style>
        </div>
    );
}
