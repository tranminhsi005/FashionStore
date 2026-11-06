import { Link } from "react-router-dom";

import { ArrowLeft, ArrowUpRight } from "lucide-react";

function ComingSoonPage({
  title = "Đang phát triển",
  description = "Chức năng này sẽ được triển khai trong các Phase tiếp theo.",
}) {
  return (
    <section className="container-shell flex min-h-[65vh] flex-col items-start justify-center py-20">
      <p className="eyebrow text-muted">FASHIONSTORE / COMING SOON</p>

      <h1 className="mt-7 font-display text-5xl font-extrabold tracking-[-0.08em] md:text-7xl">
        {title}
        <span className="text-accent-dark">.</span>
      </h1>

      <p className="mt-6 max-w-lg text-sm leading-7 text-muted">
        {description}
      </p>

      <Link
        to="/"
        className="mt-10 inline-flex items-center gap-3 border-b border-ink pb-2 text-sm font-semibold transition hover:gap-5"
      >
        <ArrowLeft size={17} />
        Trở về trang chủ
      </Link>
    </section>
  );
}

export default ComingSoonPage;
