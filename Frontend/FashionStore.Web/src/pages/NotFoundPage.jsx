import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Orbit } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { AnimatedGrid, GlowOrb } from "../components/ui";

function NotFoundPage() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="not-found-page relative isolate flex min-h-[78vh] items-center justify-center overflow-hidden px-5 py-20 text-center">
      <AnimatedGrid cellSize={58} color="rgba(219,203,255,0.05)" />
      <GlowOrb color="purple" size={560} opacity={0.15} top="-240px" left="50%" />
      <GlowOrb color="cyan" size={360} opacity={0.07} bottom="-200px" right="-120px" />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24, filter: "blur(8px)" }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ type: "spring", stiffness: 170, damping: 24 }}
        className="not-found-card relative z-10 mx-auto w-full max-w-3xl rounded-[30px] border border-white/10 px-7 py-14 md:px-14 md:py-20"
      >
        <div className="mx-auto mb-6 grid h-12 w-12 place-items-center rounded-2xl border border-purple-200/20 bg-purple-200/10 text-purple-200">
          <Orbit size={22} />
        </div>
        <p className="eyebrow">FASHIONSTORE / LOST IN SPACE</p>
        <h1 className="not-found-code mt-5 font-display text-[clamp(7rem,22vw,15rem)] font-extrabold leading-[0.78] tracking-[-0.12em]">
          404<span>.</span>
        </h1>
        <h2 className="mt-9 text-xl font-bold text-white md:text-2xl">Trang này không tồn tại.</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/50">
          Có thể đường dẫn đã thay đổi hoặc nội dung bạn tìm kiếm không còn ở đây. Hãy quay lại bộ sưu tập và tiếp tục khám phá.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/" className="liquid-action px-6 py-3.5 text-xs font-bold uppercase tracking-wider">
            <ArrowLeft size={15} /> Trang chủ
          </Link>
          <Link to="/san-pham" className="liquid-action liquid-action-secondary px-6 py-3.5 text-xs font-semibold">
            Khám phá sản phẩm <ArrowUpRight size={15} />
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

export default NotFoundPage;
