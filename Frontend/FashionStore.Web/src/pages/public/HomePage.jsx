import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Layers3,
  ScanLine,
  Orbit,
  MoveUpRight,
  ArrowDown,
} from "lucide-react";
import { AnimatedGrid, GlowOrb, ParticlesCanvas, Reveal, SpotlightCard } from "../../components/ui";

const SHOWCASE_CARDS = [
  {
    number: "01",
    title: "Everyday Form",
    tag: "ESSENTIALS",
    desc: "Những thiết kế linh hoạt, dễ kết hợp và luôn giữ được phom dáng riêng.",
    icon: Layers3,
    tone: "violet",
  },
  {
    number: "02",
    title: "Quiet Statement",
    tag: "MINIMAL",
    desc: "Đường nét tinh gọn, bảng màu có chiều sâu và chất liệu được chọn lọc.",
    icon: ScanLine,
    tone: "blue",
  },
  {
    number: "03",
    title: "Future Utility",
    tag: "TECHWEAR",
    desc: "Tính ứng dụng gặp gỡ ngôn ngữ thiết kế hiện đại trong từng chi tiết.",
    icon: Orbit,
    tone: "rose",
  },
];

const TICKER_TEXT = "FORM FOLLOWS FEELING  /  MODERN WARDROBE  /  PERSONAL IDENTITY  /  FASHIONSTORE  /  " ;

export default function HomePage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="home-page relative overflow-hidden">
      <section className="home-hero relative isolate flex min-h-[min(850px,calc(100svh-100px))] items-center py-16 md:py-24">
        <AnimatedGrid cellSize={64} color="rgba(219, 203, 255, 0.055)" />
        <GlowOrb color="purple" size={700} opacity={0.19} top="-180px" right="-120px" />
        <GlowOrb color="cyan" size={500} opacity={0.09} bottom="-180px" left="42%" />
        <ParticlesCanvas
          particleCount={34}
          speed={0.16}
          glowColor="rgba(207, 178, 255, 0.65)"
          lineColor="rgba(191, 163, 255, 0.085)"
          secondaryColor="rgba(145, 166, 255, 0.55)"
        />

        <div className="container-shell relative z-10 grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ type: "spring", stiffness: 150, damping: 22, delay: 0.08 }}
            className="relative z-10 flex flex-col items-start"
          >
            <div className="home-kicker"><span /><Sparkles size={13} /> THE NEW WAY TO WEAR</div>
            <h1 className="home-title mt-7">
              DRESS IN<br />
              YOUR OWN<br />
              <span>FREQUENCY<span className="home-title-period">.</span></span>
            </h1>
            <p className="mt-7 max-w-xl text-sm leading-7 text-white/58 md:text-base md:leading-8">
              Tủ đồ hiện đại bắt đầu từ những lựa chọn có chủ đích. Khám phá phom dáng, chất liệu và cảm hứng phù hợp với bản sắc của bạn.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/san-pham" className="liquid-action px-7 py-3.5 text-xs font-bold uppercase tracking-[0.12em]">
                Khám phá bộ sưu tập <ArrowRight size={16} />
              </Link>
              <Link to="/#about" className="liquid-action liquid-action-secondary px-6 py-3.5 text-xs font-semibold">
                Câu chuyện thương hiệu <ArrowUpRight size={15} />
              </Link>
            </div>

            <div className="home-trust-row mt-12">
              <div><ShieldCheck size={16} /><span>Chọn lọc chất lượng</span></div>
              <i />
              <div><Truck size={16} /><span>Giao hàng toàn quốc</span></div>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94, rotate: 2 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 125, damping: 20, delay: 0.18 }}
            className="hero-art-wrap relative mx-auto w-full max-w-[570px]"
          >
            <motion.div className="hero-orbit hero-orbit-one" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 54, repeat: Infinity, ease: "linear" }} />
            <motion.div className="hero-orbit hero-orbit-two" animate={reduceMotion ? undefined : { rotate: -360 }} transition={{ duration: 72, repeat: Infinity, ease: "linear" }} />

            <motion.div
              className="hero-art-card"
              animate={reduceMotion ? undefined : { y: [0, -9, 0], rotateZ: [0, 0.6, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="hero-art-topline">
                <span>F/S — OBJECT STUDY 001</span>
                <span>01 / 03</span>
              </div>
              <div className="hero-art-core">
                <div className="hero-glass-shape hero-glass-shape-back" />
                <div className="hero-glass-shape hero-glass-shape-front" />
                <div className="hero-art-monogram">F<span>.</span></div>
                <div className="hero-art-orbit-dot" />
              </div>
              <div className="hero-art-bottomline">
                <div><span className="hero-art-caption">COLLECTION 2026</span><strong>FORM / FUNCTION</strong></div>
                <span className="hero-art-index">FS—001</span>
              </div>
            </motion.div>

            <motion.div className="hero-float-note hero-float-note-top" animate={reduceMotion ? undefined : { y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
              <span className="hero-note-icon"><Sparkles size={14} /></span>
              <span><small>CURATED DETAILS</small><strong>Made to move</strong></span>
            </motion.div>
            <motion.div className="hero-float-note hero-float-note-bottom" animate={reduceMotion ? undefined : { y: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
              <span className="hero-note-number">01</span>
              <span><small>DESIGN PHILOSOPHY</small><strong>Less, but considered.</strong></span>
            </motion.div>
          </motion.div>
        </div>

        <div className="home-scroll-cue"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></div>
      </section>

      <div className="home-ticker relative z-10 overflow-hidden">
        <div className="marquee-track whitespace-nowrap py-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-purple-100/65 md:text-xs">
          <span>{TICKER_TEXT.repeat(4)}</span><span>{TICKER_TEXT.repeat(4)}</span>
        </div>
      </div>

      <section className="section-spacing relative z-10">
        <div className="container-shell">
          <Reveal className="section-intro-row">
            <div>
              <p className="eyebrow">A WARDROBE WITH INTENTION</p>
              <h2 className="section-heading mt-4 max-w-2xl">A GOOD LOOK.<br /><span className="gradient-text">A BETTER FEELING.</span></h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-white/50">
              Không chạy theo mọi xu hướng. Chúng tôi tập trung vào những lựa chọn có thể đồng hành cùng bạn lâu hơn một mùa.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {SHOWCASE_CARDS.map((card, index) => {
              const Icon = card.icon;
              return (
                <Reveal key={card.number} delay={index * 0.08}>
                  <Link to="/san-pham" className="group block h-full">
                    <SpotlightCard className={`collection-card collection-card-${card.tone} h-full p-6 md:p-7`} spotlightColor="rgba(190, 159, 255, 0.16)">
                      <div className="flex items-center justify-between">
                        <span className="collection-number">/{card.number}</span>
                        <span className="collection-icon"><Icon size={19} strokeWidth={1.6} /></span>
                      </div>
                      <div className="collection-card-art" aria-hidden="true"><span>{card.number}</span></div>
                      <div className="relative z-10 mt-20">
                        <p className="eyebrow !text-[9px]">{card.tag}</p>
                        <div className="mt-2 flex items-end justify-between gap-3">
                          <h3 className="font-display text-xl font-bold tracking-tight text-white md:text-2xl">{card.title}</h3>
                          <MoveUpRight size={18} className="mb-1 shrink-0 text-white/45 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
                        </div>
                        <p className="mt-3 max-w-xs text-xs leading-6 text-white/52">{card.desc}</p>
                      </div>
                    </SpotlightCard>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="about" className="about-section relative z-10 scroll-mt-28 py-20 md:py-28">
        <div className="container-shell grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <p className="eyebrow">ABOUT FASHIONSTORE</p>
            <h2 className="mt-5 font-display text-4xl font-extrabold leading-[0.98] tracking-[-0.06em] text-white sm:text-6xl">
              NOT MORE.<br /><span className="gradient-text">MORE MEANING.</span>
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-8 text-white/55 md:text-base">
              FashionStore tin rằng phong cách tốt không nằm ở số lượng bạn sở hữu, mà ở cảm giác tự tin khi bạn chọn mặc. Từng sản phẩm được giới thiệu với tinh thần hiện đại, dễ ứng dụng và có cá tính riêng.
            </p>
            <Link to="/san-pham" className="about-inline-link mt-8">Tìm phong cách của bạn <ArrowUpRight size={16} /></Link>
          </Reveal>

          <Reveal delay={0.12} className="about-glass-board">
            <div className="about-board-top"><span>FASHIONSTORE / PRINCIPLES</span><span>EST. 2026</span></div>
            <div className="about-principle"><span>01</span><div><strong>Considered design</strong><p>Thiết kế có chủ đích, không phô trương.</p></div></div>
            <div className="about-principle"><span>02</span><div><strong>Everyday versatility</strong><p>Dễ phối hợp và phù hợp nhiều khoảnh khắc.</p></div></div>
            <div className="about-principle"><span>03</span><div><strong>Personal expression</strong><p>Phong cách của bạn, theo cách của bạn.</p></div></div>
            <div className="about-board-foot"><span>FORM FOLLOWS FEELING</span><span className="about-board-orbit"><Orbit size={18} /></span></div>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 px-4 py-20 md:py-28">
        <Reveal className="home-final-cta mx-auto max-w-[1360px] overflow-hidden rounded-[30px] px-6 py-16 text-center md:px-12 md:py-24">
          <div className="home-final-glow" aria-hidden="true" />
          <p className="eyebrow relative z-10">YOUR NEXT EVERYDAY LOOK</p>
          <h2 className="relative z-10 mt-5 font-display text-4xl font-extrabold tracking-[-0.065em] text-white sm:text-6xl md:text-7xl">MAKE SPACE FOR<br /><span className="gradient-text">YOURSELF.</span></h2>
          <p className="relative z-10 mx-auto mt-5 max-w-lg text-sm leading-7 text-white/55">Bắt đầu với một lựa chọn vừa vặn với bạn. Khám phá bộ sưu tập FashionStore ngay hôm nay.</p>
          <Link to="/san-pham" className="liquid-action relative z-10 mt-8 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.12em]">Khám phá sản phẩm <ArrowRight size={16} /></Link>
        </Reveal>
      </section>
    </div>
  );
}
