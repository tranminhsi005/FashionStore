import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Zap, Star, TrendingUp } from "lucide-react";
import { ParticlesCanvas } from "../../components/ui";

/* ─── Keyframe injection ─── */
const STYLES = `
@keyframes ticker-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes float-y {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50%       { transform: translateY(-18px) rotate(2deg); }
}
@keyframes spin-slow {
  from { transform: rotateY(0deg); }
  to   { transform: rotateY(360deg); }
}
@keyframes glow-pulse {
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 1; }
}
@keyframes underline-grow {
  from { width: 0; }
  to   { width: 100%; }
}
`;

function InjectStyles() {
  return <style>{STYLES}</style>;
}

/* ─── Ambient orb helper ─── */
function Orb({ color, size, top, left, right, bottom, opacity = 1 }) {
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: "blur(120px)",
        top,
        left,
        right,
        bottom,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
}

/* ─── Gradient text span ─── */
function GradientText({ children, from = "#00d9ff", to = "#7c3aed" }) {
  return (
    <span
      style={{
        background: `linear-gradient(135deg, ${from}, ${to})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
}

export default function HomePage() {
  const TICKER_TEXT =
    "MODERN FASHION \u2022 FIND YOUR STYLE \u2022 2026 COLLECTION \u2022 FASHIONSTORE \u2022 MODERN FASHION \u2022 FIND YOUR STYLE \u2022 2026 COLLECTION \u2022 FASHIONSTORE \u2022 ";

  return (
    <div style={{ background: "#030303", color: "#f0f0f5", overflowX: "hidden" }}>
      <InjectStyles />

      {/* ══════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Ambient orbs */}
        <Orb color="rgba(0,217,255,0.12)"  size="600px" top="-100px"  right="-120px" />
        <Orb color="rgba(124,58,237,0.15)" size="700px" bottom="-200px" left="-180px" />
        <Orb color="rgba(163,230,53,0.06)" size="400px" top="40%"    right="30%" />

        {/* 3D Interactive Particles Canvas (Lusion & ReactBits style) */}
        <ParticlesCanvas particleCount={45} speed={0.5} />

        {/* Subtle grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />

        <div
          className="container-shell"
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "center",
            padding: "6rem 1.5rem",
            width: "100%",
          }}
        >
          {/* ── LEFT CONTENT ── */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            {/* Eyebrow */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "2rem" }}>
              <span
                style={{
                  display: "block",
                  width: "40px",
                  height: "1px",
                  background: "#00d9ff",
                  boxShadow: "0 0 8px #00d9ff",
                }}
              />
              <span
                style={{
                  color: "#00d9ff",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                }}
              >
                MODERN FASHION — 2026
              </span>
            </div>

            {/* H1 */}
            <h1
              style={{
                fontFamily: "var(--font-display, 'Manrope', sans-serif)",
                fontSize: "clamp(3.5rem, 10vw, 9rem)",
                fontWeight: 800,
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
                color: "#ffffff",
                margin: 0,
              }}
            >
              FIND YOUR
              <br />
              OWN
              <br />
              <GradientText>STYLE.</GradientText>
            </h1>

            {/* Description */}
            <p
              style={{
                marginTop: "2rem",
                maxWidth: "420px",
                fontSize: "0.95rem",
                lineHeight: 1.8,
                color: "rgba(240,240,245,0.5)",
              }}
            >
              Khám phá phong cách riêng của bạn thông qua những thiết kế thời trang hiện đại, tối giản và đầy cá tính.
            </p>

            {/* CTAs */}
            <div style={{ marginTop: "2.5rem", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
              <Link
                to="/san-pham"
                style={{ textDecoration: "none" }}
              >
                <motion.span
                  whileHover={{ boxShadow: "0 0 32px rgba(0,217,255,0.5), 0 0 60px rgba(0,217,255,0.2)" }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "14px 28px",
                    border: "1px solid rgba(0,217,255,0.5)",
                    background: "rgba(0,217,255,0.08)",
                    backdropFilter: "blur(16px)",
                    borderRadius: "4px",
                    color: "#00d9ff",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    boxShadow: "0 0 20px rgba(0,217,255,0.2)",
                    transition: "box-shadow 0.3s ease",
                  }}
                >
                  KHÁM PHÁ BỘ SƯU TẬP
                  <ArrowRight size={16} />
                </motion.span>
              </Link>

              <Link
                to="/san-pham"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "rgba(240,240,245,0.4)",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                EXPLORE YOUR IDENTITY
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </motion.div>

          {/* ── RIGHT VISUAL: 3D-ish Card ── */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
            style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}
          >
            {/* Floating badge: top-left */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: "5%",
                left: "-5%",
                zIndex: 10,
                background: "rgba(13,13,20,0.8)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(0,217,255,0.3)",
                borderRadius: "8px",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Zap size={14} style={{ color: "#00d9ff" }} />
              <span style={{ color: "#00d9ff", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em" }}>
                NEW ARRIVAL
              </span>
            </motion.div>

            {/* Floating badge: bottom-right */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              style={{
                position: "absolute",
                bottom: "8%",
                right: "-5%",
                zIndex: 10,
                background: "rgba(124,58,237,0.15)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(124,58,237,0.4)",
                borderRadius: "8px",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Star size={14} style={{ color: "#a3e635" }} />
              <span style={{ color: "#a3e635", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em" }}>
                2026 COLLECTION
              </span>
            </motion.div>

            {/* Main 3D card */}
            <motion.div
              animate={{
                rotateY: [0, 8, -8, 0],
                rotateX: [0, 3, -3, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "800px",
                width: "320px",
                height: "420px",
                position: "relative",
              }}
            >
              {/* Card face */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 0 60px rgba(0,217,255,0.08), 0 0 100px rgba(124,58,237,0.08), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                {/* Gradient border glow */}
                <div
                  style={{
                    position: "absolute",
                    inset: "-1px",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, rgba(0,217,255,0.4), rgba(124,58,237,0.4), rgba(163,230,53,0.2))",
                    zIndex: -1,
                    opacity: 0.6,
                  }}
                />

                {/* Top label */}
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.25em",
                    color: "rgba(240,240,245,0.4)",
                  }}
                >
                  F/S — EDITION 001
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    color: "rgba(240,240,245,0.4)",
                  }}
                >
                  NEW PERSPECTIVE
                </div>

                {/* Main text */}
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display, 'Manrope', sans-serif)",
                      fontSize: "5rem",
                      fontWeight: 800,
                      lineHeight: 1,
                      letterSpacing: "-0.05em",
                      background: "linear-gradient(135deg, #00d9ff, #7c3aed)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 20px rgba(0,217,255,0.5))",
                    }}
                  >
                    F/S
                  </div>
                  <div
                    style={{
                      marginTop: "8px",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.4em",
                      color: "rgba(240,240,245,0.3)",
                      textTransform: "uppercase",
                    }}
                  >
                    FASHIONSTORE
                  </div>
                </div>

                {/* Decorative corner lines */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "20px",
                    width: "40px",
                    height: "40px",
                    borderLeft: "1px solid rgba(0,217,255,0.4)",
                    borderBottom: "1px solid rgba(0,217,255,0.4)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                    width: "40px",
                    height: "40px",
                    borderRight: "1px solid rgba(124,58,237,0.4)",
                    borderBottom: "1px solid rgba(124,58,237,0.4)",
                  }}
                />

                {/* Inner ambient */}
                <div
                  style={{
                    position: "absolute",
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    background: "rgba(0,217,255,0.06)",
                    filter: "blur(60px)",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    animation: "glow-pulse 3s ease-in-out infinite",
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — MARQUEE / TICKER
      ══════════════════════════════════════════ */}
      <div
        style={{
          background: "#0a0a0f",
          borderTop: "1px solid rgba(0,217,255,0.15)",
          borderBottom: "1px solid rgba(0,217,255,0.15)",
          padding: "18px 0",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Left/right fade masks */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "80px",
            background: "linear-gradient(to right, #0a0a0f, transparent)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "80px",
            background: "linear-gradient(to left, #0a0a0f, transparent)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            animation: "ticker-scroll 20s linear infinite",
          }}
        >
          {[TICKER_TEXT, TICKER_TEXT].map((t, i) => (
            <span
              key={i}
              style={{
                color: "#00d9ff",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                textShadow: "0 0 12px rgba(0,217,255,0.6)",
                flexShrink: 0,
                paddingRight: "0",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 3 — ABOUT
      ══════════════════════════════════════════ */}
      <section
        id="about"
        style={{
          position: "relative",
          padding: "7rem 1.5rem",
          overflow: "hidden",
        }}
      >
        <Orb color="rgba(124,58,237,0.1)" size="500px" top="0" right="-100px" />
        <Orb color="rgba(0,217,255,0.07)" size="400px" bottom="-100px" left="-80px" />

        <div
          className="container-shell"
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
          }}
        >
          {/* Left heading */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <span
              style={{
                color: "#00d9ff",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "1.5rem",
              }}
            >
              ABOUT FASHIONSTORE
            </span>

            <h2
              style={{
                fontFamily: "var(--font-display, 'Manrope', sans-serif)",
                fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                fontWeight: 800,
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
                color: "#ffffff",
                margin: 0,
              }}
            >
              NOT JUST
              <br />
              WHAT YOU
              <br />
              <GradientText>WEAR.</GradientText>
            </h2>
          </motion.div>

          {/* Right glass card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "2.5rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Inner ambient glow */}
              <div
                style={{
                  position: "absolute",
                  top: "-60px",
                  right: "-60px",
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  background: "rgba(124,58,237,0.12)",
                  filter: "blur(60px)",
                  pointerEvents: "none",
                }}
              />

              <p
                style={{
                  fontSize: "0.95rem",
                  lineHeight: 1.85,
                  color: "rgba(240,240,245,0.55)",
                  position: "relative",
                }}
              >
                FashionStore hướng đến một trải nghiệm thời trang hiện đại, nơi mỗi thiết kế giúp bạn thể hiện bản sắc và cá tính riêng của mình.
              </p>

              {/* Stats row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "1rem",
                  marginTop: "2rem",
                  paddingTop: "2rem",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  position: "relative",
                }}
              >
                {[
                  { value: "100+", label: "Sản phẩm" },
                  { value: "2026", label: "Collection" },
                  { value: "∞", label: "Phong cách" },
                ].map(({ value, label }) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontFamily: "var(--font-display, 'Manrope', sans-serif)",
                        fontSize: "1.8rem",
                        fontWeight: 800,
                        background: "linear-gradient(135deg, #00d9ff, #7c3aed)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {value}
                    </div>
                    <div
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        letterSpacing: "0.15em",
                        color: "rgba(240,240,245,0.35)",
                        textTransform: "uppercase",
                        marginTop: "4px",
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/san-pham"
                style={{ textDecoration: "none" }}
              >
                <motion.span
                  whileHover={{ gap: "16px" }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "2rem",
                    color: "#00d9ff",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    textShadow: "0 0 10px rgba(0,217,255,0.5)",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  KHÁM PHÁ NGAY
                  <ArrowUpRight size={16} />
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4 — BRAND STATEMENT
      ══════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          padding: "7rem 1.5rem",
          overflow: "hidden",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Giant background glow behind text */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "900px",
            height: "400px",
            background:
              "radial-gradient(ellipse at center, rgba(0,217,255,0.07) 0%, rgba(124,58,237,0.08) 50%, transparent 70%)",
            pointerEvents: "none",
            filter: "blur(40px)",
          }}
        />

        <div
          className="container-shell"
          style={{ position: "relative", zIndex: 1 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span
              style={{
                color: "rgba(240,240,245,0.35)",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "2rem",
              }}
            >
              YOUR OWN IDENTITY
            </span>

            <div style={{ position: "relative", display: "inline-block" }}>
              <h2
                style={{
                  fontFamily: "var(--font-display, 'Manrope', sans-serif)",
                  fontSize: "clamp(3rem, 9vw, 8rem)",
                  fontWeight: 800,
                  lineHeight: 0.95,
                  letterSpacing: "-0.04em",
                  color: "#ffffff",
                  margin: 0,
                  textShadow: "0 0 60px rgba(0,217,255,0.15)",
                }}
              >
                STYLE IS
                <br />
                <GradientText>PERSONAL.</GradientText>
              </h2>

              {/* Animated underline */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                style={{
                  height: "2px",
                  background: "linear-gradient(90deg, #00d9ff, #7c3aed, transparent)",
                  marginTop: "12px",
                  borderRadius: "2px",
                  boxShadow: "0 0 12px rgba(0,217,255,0.5)",
                }}
              />
            </div>
          </motion.div>

          {/* Bottom row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "4rem",
              paddingTop: "2rem",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.3em",
                color: "rgba(240,240,245,0.25)",
                textTransform: "uppercase",
              }}
            >
              FASHIONSTORE / 001
            </span>

            <Link
              to="/san-pham"
              style={{ textDecoration: "none" }}
            >
              <motion.span
                whileHover={{ boxShadow: "0 0 24px rgba(0,217,255,0.4)" }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 24px",
                  border: "1px solid rgba(0,217,255,0.3)",
                  background: "rgba(0,217,255,0.06)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "4px",
                  color: "#00d9ff",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "box-shadow 0.3s ease",
                }}
              >
                XEM SẢN PHẨM
                <TrendingUp size={15} />
              </motion.span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
