import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Decorative particle field used in the homepage hero.
 * Pauses in background tabs and becomes static when reduced motion is enabled.
 */
export default function ParticlesCanvas({
  particleCount = 50,
  speed = 0.5,
  interactive = true,
  glowColor = "rgba(168, 85, 247, 0.7)",
  lineColor = "rgba(168, 85, 247, 0.12)",
  secondaryColor = "rgba(99, 102, 241, 0.7)",
}) {
  const canvasRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    let width = 1;
    let height = 1;
    let pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    let animationFrameId = null;

    const mouse = { x: -1000, y: -1000, radius: 145 };
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      radius: Math.random() * 1.5 + 0.8,
      color: Math.random() > 0.42 ? glowColor : secondaryColor,
    }));

    function resizeCanvas() {
      const previousWidth = width;
      const previousHeight = height;
      const bounds = parent.getBoundingClientRect();
      width = Math.max(1, bounds.width || window.innerWidth);
      height = Math.max(1, bounds.height || window.innerHeight);
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const scaleX = width / previousWidth;
      const scaleY = height / previousHeight;
      particles.forEach((particle) => {
        particle.x *= scaleX;
        particle.y *= scaleY;
      });
    }

    function handlePointerMove(event) {
      const bounds = canvas.getBoundingClientRect();
      const insideCanvas = event.clientX >= bounds.left
        && event.clientX <= bounds.right
        && event.clientY >= bounds.top
        && event.clientY <= bounds.bottom;

      if (!insideCanvas) {
        handlePointerLeave();
        return;
      }

      mouse.x = event.clientX - bounds.left;
      mouse.y = event.clientY - bounds.top;
    }

    function handlePointerLeave() {
      mouse.x = -1000;
      mouse.y = -1000;
    }

    function drawFrame(animate = true) {
      context.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const first = particles[i];
          const second = particles[j];
          const dx = first.x - second.x;
          const dy = first.y - second.y;
          const distance = Math.hypot(dx, dy);

          if (distance < 112) {
            context.beginPath();
            context.strokeStyle = lineColor;
            context.lineWidth = 0.7 * (1 - distance / 112);
            context.moveTo(first.x, first.y);
            context.lineTo(second.x, second.y);
            context.stroke();
          }
        }
      }

      particles.forEach((particle) => {
        if (animate && interactive) {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.hypot(dx, dy);

          if (distance > 0.001 && distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            particle.x -= (dx / distance) * force * 2.2;
            particle.y -= (dy / distance) * force * 2.2;
          }
        }

        if (animate) {
          particle.x += particle.vx * particle.z;
          particle.y += particle.vy * particle.z;

          if (particle.x < 0) particle.x = width;
          if (particle.x > width) particle.x = 0;
          if (particle.y < 0) particle.y = height;
          if (particle.y > height) particle.y = 0;
        }

        context.save();
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius * particle.z, 0, Math.PI * 2);
        context.fillStyle = particle.color;
        context.shadowColor = particle.color;
        context.shadowBlur = 8 * particle.z;
        context.fill();
        context.restore();
      });
    }

    function stopAnimation() {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }

    function animate() {
      drawFrame(true);
      if (!reduceMotion && !document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    function startAnimation() {
      stopAnimation();
      if (reduceMotion) {
        drawFrame(false);
        return;
      }
      if (!document.hidden) animate();
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    }

    resizeCanvas();
    startAnimation();

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => {
          resizeCanvas();
          if (reduceMotion) drawFrame(false);
        })
      : null;

    resizeObserver?.observe(parent);
    window.addEventListener("resize", resizeCanvas);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (interactive && !reduceMotion) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      canvas.addEventListener("pointerleave", handlePointerLeave);
    }

    return () => {
      stopAnimation();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [particleCount, speed, interactive, glowColor, lineColor, secondaryColor, reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-60"
    />
  );
}
