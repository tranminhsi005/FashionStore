import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Zap,
  Star,
  ShieldCheck,
  Flame,
  Layers,
  Cpu,
} from "lucide-react";
import { ParticlesCanvas, SpotlightCard } from "../../components/ui";

const SHOWCASE_CARDS = [
  {
    title: "Cyber Streetwear",
    tag: "FEATURED",
    desc: "Thiết kế năng động giao thoa giữa thời trang đường phố và công nghệ tương lai.",
    gradient: "from-purple-500/20 to-indigo-500/10",
    color: "#a855f7",
    icon: Flame,
    href: "/san-pham",
  },
  {
    title: "Minimalist Matrix",
    tag: "SIGNATURE",
    desc: "Đường cắt may tối giản, form dáng thanh lịch với chất liệu sợi dệt thế hệ mới.",
    gradient: "from-indigo-500/20 to-fuchsia-500/10",
    color: "#818cf8",
    icon: Layers,
    href: "/san-pham",
  },
  {
    title: "Techwear Obsidian",
    tag: "INNOVATION",
    desc: "Kháng nước, co giãn 4 chiều và tích hợp túi tiện ích chuẩn phong cách vị lai.",
    gradient: "from-fuchsia-500/20 to-purple-500/10",
    color: "#c084fc",
    icon: Cpu,
    href: "/san-pham",
  },
];

export default function HomePage() {
  const TICKER_TEXT =
    "✦ CYBER FASHION • REACTBITS DESIGN • 2026 COLLECTION • FASHIONSTORE • ELEVATE YOUR STYLE • TECHWEAR • MINIMALIST LUXURY • ";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#060608] text-[#f3f0fa] selection:bg-purple-600 selection:text-white">
      {/* =========================================================================
          REACTBITS SIGNATURE: GIANT PURPLE AURORA RADIAL GLOW & DOT GRID
      ========================================================================= */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 50% 12%, rgba(168, 85, 247, 0.22) 0%, rgba(99, 102, 241, 0.1) 35%, transparent 65%)",
        }}
      />

      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* =========================================================================
          SECTION 1 — HERO SECTION (REACTBITS STYLE)
      ========================================================================= */}
      <section className="relative z-10 flex min-h-[92vh] items-center overflow-hidden py-16 md:py-24">
        {/* Interactive 3D Particles */}
        <ParticlesCanvas
          particleCount={40}
          speed={0.4}
          glowColor="rgba(168, 85, 247, 0.7)"
          lineColor="rgba(168, 85, 247, 0.12)"
          secondaryColor="rgba(99, 102, 241, 0.7)"
        />

        <div className="container-shell grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            {/* Top Pill Announcement */}
            <Link
              to="/san-pham"
              className="group mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-200 backdrop-blur-xl transition-all duration-300 hover:border-purple-400 hover:bg-purple-500/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.35)]"
            >
              <Sparkles size={13} className="text-purple-400" />
              <span>COLLECTION 2026 ĐÃ RA MẮT</span>
              <ArrowRight
                size={13}
                className="transition-transform group-hover:translate-x-1 text-purple-400"
              />
            </Link>

            {/* H1 Heading */}
            <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl">
              FIND YOUR
              <br />
              OWN{" "}
              <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(168,85,247,0.4)]">
                STYLE.
              </span>
            </h1>

            {/* Paragraph */}
            <p className="mt-6 max-w-lg text-base leading-8 text-white/60 md:text-lg">
              Khám phá bản sắc độc bản của bạn qua ngôn ngữ thời trang hiện đại,
              tối giản và đầy tính công nghệ vị lai.
            </p>

            {/* ReactBits CTA Buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/san-pham"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_30px_rgba(168,85,247,0.45)] transition-all duration-300 hover:from-purple-500 hover:to-indigo-500 hover:shadow-[0_0_45px_rgba(168,85,247,0.7)]"
              >
                <span>Khám phá bộ sưu tập</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/#about"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-7 py-4 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:bg-white/[0.08] hover:text-white"
              >
                <span>Về thương hiệu</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>

            {/* Trust Metrics */}
            <div className="mt-12 flex items-center gap-8 border-t border-white/10 pt-6 text-xs text-white/50">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-purple-400" />
                <span>Chính hãng 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-purple-400" />
                <span>Giao hàng thần tốc</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT 3D SHOWCASE VISUAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {/* Floating Tag Top Left */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -left-4 z-20 flex items-center gap-2 rounded-xl border border-purple-500/40 bg-[#0e0a1a]/90 px-4 py-2.5 text-xs font-bold text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] backdrop-blur-xl"
            >
              <Zap size={14} className="text-purple-400" />
              <span>LIMITED EDITION</span>
            </motion.div>

            {/* Floating Tag Bottom Right */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -right-4 z-20 flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-[#0a0a16]/90 px-4 py-2.5 text-xs font-bold text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] backdrop-blur-xl"
            >
              <Star size={14} className="text-indigo-400" />
              <span>VERIFIED CYBER</span>
            </motion.div>

            {/* 3D Geometric Rotating Cube / Showcase Frame */}
            <motion.div
              animate={{
                rotateY: [0, 8, -8, 0],
                rotateX: [0, 4, -4, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
              className="relative h-[440px] w-full max-w-[360px] rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-950/40 via-[#0c0a18]/80 to-[#06060a]/90 p-8 shadow-[0_0_60px_rgba(168,85,247,0.2)] backdrop-blur-2xl md:h-[480px] md:max-w-[390px]"
            >
              {/* Outer Glow Halo */}
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-tr from-purple-600/20 via-indigo-600/20 to-transparent blur-xl" />

              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] font-bold tracking-widest text-purple-300/60">
                  <span>F/S — EDITION 001</span>
                  <span>NEW PERSPECTIVE</span>
                </div>

                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="relative font-display text-8xl font-black tracking-tighter sm:text-9xl">
                    <span className="bg-gradient-to-b from-white via-purple-200 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.6)]">
                      F
                    </span>
                    <span className="text-purple-500">.</span>
                  </div>
                  <p className="mt-3 text-xs font-bold tracking-[0.3em] text-white/50">
                    FASHIONSTORE 2026
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[10px] font-bold tracking-wider text-white/40">
                  <span>INDEPENDENT DESIGN</span>
                  <span className="text-purple-400">REACTBITS V2.0</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — MARQUEE TICKER (REACTBITS CYBER STYLE)
      ========================================================================= */}
      <section className="relative z-10 overflow-hidden border-y border-purple-500/20 bg-purple-950/20 py-4 backdrop-blur-md">
        <div className="marquee-track flex whitespace-nowrap text-xs font-bold uppercase tracking-[0.25em] text-purple-300">
          <span>{TICKER_TEXT}</span>
          <span>{TICKER_TEXT}</span>
          <span>{TICKER_TEXT}</span>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — COMPONENT SHOWCASE (REACTBITS SPOTLIGHT GRID)
      ========================================================================= */}
      <section className="relative z-10 py-24 md:py-32">
        <div className="container-shell">
          <div className="mb-14 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-[11px] font-bold tracking-widest text-purple-300">
              <Sparkles size={12} />
              CURATED SELECTION
            </div>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Bộ Sưu Tập Tiêu Biểu
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/50">
              Từng tác phẩm được sáng tạo để mang đến cảm giác thoải mái tối đa và
              khẳng định phong cách riêng của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {SHOWCASE_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.title} to={card.href} className="group block">
                  <SpotlightCard
                    spotlightColor="rgba(168, 85, 247, 0.25)"
                    hoverBorderColor="rgba(168, 85, 247, 0.6)"
                    className="p-8"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border"
                        style={{
                          background: `${card.color}15`,
                          borderColor: `${card.color}40`,
                          color: card.color,
                        }}
                      >
                        <Icon size={22} />
                      </div>
                      <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[10px] font-bold text-purple-300">
                        {card.tag}
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-bold text-white transition-colors group-hover:text-purple-300">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-white/55">
                      {card.desc}
                    </p>

                    <div className="mt-8 flex items-center gap-2 text-xs font-bold text-purple-400 group-hover:text-purple-300">
                      <span>Xem ngay</span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </SpotlightCard>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — ABOUT & BRAND STATS (REACTBITS GLASS METRICS)
      ========================================================================= */}
      <section id="about" className="relative z-10 border-t border-white/10 bg-[#08070e]/80 py-24 backdrop-blur-2xl md:py-32">
        <div className="container-shell">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400">
                ABOUT FASHIONSTORE
              </p>
              <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
                NOT JUST WHAT
                <br />
                YOU <span className="text-purple-400">WEAR.</span>
              </h2>
              <p className="mt-6 text-base leading-8 text-white/60">
                FashionStore hướng đến trải nghiệm mua sắm hiện đại, nơi mỗi
                thiết kế thời trang là một tuyên ngôn cá tính độc lập, mang tinh
                thần vị lai và thẩm mỹ đỉnh cao.
              </p>
            </div>

            {/* Metrics Glass Box */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: "100+", label: "Sản phẩm chọn lọc" },
                { number: "100%", label: "Vải dệt cao cấp" },
                { number: "2026", label: "Kỷ nguyên vị lai" },
                { number: "∞", label: "Cảm hứng phong cách" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:bg-purple-950/20"
                >
                  <p className="font-display text-3xl font-extrabold text-purple-400 sm:text-4xl">
                    {stat.number}
                  </p>
                  <p className="mt-2 text-xs font-medium text-white/50">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — BRAND STATEMENT & BOTTOM CTA
      ========================================================================= */}
      <section className="relative z-10 py-24 text-center md:py-32">
        <div className="container-shell flex flex-col items-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-purple-400">
            YOUR OWN IDENTITY
          </p>
          <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-white sm:text-7xl">
            STYLE IS{" "}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              PERSONAL.
            </span>
          </h2>
          <p className="mt-4 max-w-md text-sm text-white/60">
            Sẵn sàng nâng tầm phong cách cùng bộ sưu tập thời trang công nghệ cao
            mới nhất của chúng tôi.
          </p>

          <Link
            to="/san-pham"
            className="group mt-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300 hover:from-purple-500 hover:to-indigo-500 hover:shadow-[0_0_45px_rgba(168,85,247,0.6)]"
          >
            <span>Bắt đầu mua sắm</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
