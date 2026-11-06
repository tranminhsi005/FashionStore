import { Link } from "react-router-dom";

import { motion } from "motion/react";

import { ArrowRight, ArrowUpRight, MoveDown } from "lucide-react";

function HomePage() {
  return (
    <div>
      {/* =====================================
                HERO SECTION
            ===================================== */}

      <section className="container-shell grid min-h-[740px] grid-cols-1 items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        {/* LEFT CONTENT */}

        <motion.div
          initial={{
            opacity: 0,
            y: 35,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-10 bg-ink" />

            <p className="eyebrow text-muted">MODERN FASHION — 2026</p>
          </div>

          <h1 className="editorial-title">
            FIND YOUR
            <br />
            OWN
            <br />
            <span className="text-accent-dark">STYLE.</span>
          </h1>

          <p className="mt-8 max-w-md text-sm leading-7 text-muted md:text-base">
            Khám phá phong cách riêng của bạn thông qua những thiết kế thời
            trang hiện đại, tối giản và đầy cá tính.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              to="/san-pham"
              className="
                                group
                                inline-flex
                                items-center
                                gap-4
                                bg-ink
                                px-7
                                py-4
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-accent
                                hover:text-ink
                            "
            >
              KHÁM PHÁ BỘ SƯU TẬP
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </Link>

            <span className="text-xs font-medium text-muted">
              EXPLORE YOUR IDENTITY
            </span>
          </div>
        </motion.div>

        {/* RIGHT VISUAL */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1,
            delay: 0.2,
          }}
          className="
                        relative
                        flex
                        min-h-[460px]
                        items-center
                        justify-center
                        overflow-hidden
                        bg-[#deded4]
                        md:min-h-[590px]
                    "
        >
          {/* TOP LABEL */}

          <div className="absolute left-7 top-7 text-[10px] font-semibold tracking-[0.25em] text-black/50">
            F/S — EDITION 001
          </div>

          <div className="absolute right-7 top-7 text-[10px] font-semibold tracking-[0.2em] text-black/50">
            NEW PERSPECTIVE
          </div>

          {/* MAIN SHAPE */}

          <motion.div
            animate={{
              rotate: [0, 3, -3, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
                            relative
                            flex
                            h-[280px]
                            w-[210px]
                            items-center
                            justify-center
                            border
                            border-black/70
                            md:h-[390px]
                            md:w-[290px]
                        "
          >
            <span
              className="
                            font-display
                            text-[190px]
                            font-extrabold
                            leading-none
                            tracking-[-0.15em]
                            md:text-[270px]
                        "
            >
              F
            </span>

            <div
              className="
                            absolute
                            -bottom-5
                            -right-5
                            h-24
                            w-24
                            bg-accent
                            md:h-32
                            md:w-32
                        "
            />

            <div
              className="
                            absolute
                            -left-8
                            top-10
                            h-16
                            w-16
                            rounded-full
                            border
                            border-black/70
                        "
            />
          </motion.div>

          {/* BOTTOM LABEL */}

          <div className="absolute bottom-7 left-7 text-[10px] font-semibold tracking-[0.25em] text-black/50">
            INDEPENDENT FASHION
          </div>

          <div className="absolute bottom-7 right-7">
            <ArrowUpRight size={23} />
          </div>
        </motion.div>
      </section>

      {/* =====================================
                INTRODUCTION
            ===================================== */}

      <section
        id="about"
        className="border-y border-line bg-white py-24 md:py-32"
      >
        <div className="container-shell">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
            >
              <p className="eyebrow text-muted">ABOUT FASHIONSTORE</p>

              <h2 className="mt-7 max-w-xl font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.07em] md:text-6xl">
                NOT JUST
                <br />
                WHAT YOU
                <br />
                <span className="text-accent-dark">WEAR.</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.7,
                delay: 0.15,
              }}
              className="flex flex-col justify-center"
            >
              <p className="max-w-lg text-base leading-8 text-muted">
                FashionStore hướng đến một trải nghiệm thời trang hiện đại, nơi
                mỗi thiết kế giúp bạn thể hiện bản sắc và cá tính riêng của
                mình.
              </p>

              <Link
                to="/san-pham"
                className="mt-8 inline-flex items-center gap-3 text-sm font-bold"
              >
                KHÁM PHÁ NGAY
                <ArrowUpRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================
                BRAND STATEMENT
            ===================================== */}

      <section className="container-shell py-24 md:py-32">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-muted">YOUR OWN IDENTITY</p>

            <h2 className="mt-5 font-display text-4xl font-extrabold leading-none tracking-[-0.07em] md:text-7xl">
              STYLE IS
              <br />
              <span className="text-accent-dark">PERSONAL.</span>
            </h2>
          </div>

          <Link
            to="/san-pham"
            className="group flex items-center gap-4 text-sm font-semibold"
          >
            XEM SẢN PHẨM
            <span
              className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-line
                            transition
                            group-hover:border-ink
                            group-hover:bg-ink
                            group-hover:text-white
                        "
            >
              <ArrowUpRight size={19} />
            </span>
          </Link>
        </div>

        <div className="mt-16 border-t border-ink">
          <div className="flex items-center justify-between py-5">
            <p className="eyebrow text-muted">FASHIONSTORE / 001</p>

            <MoveDown size={20} className="text-muted" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
