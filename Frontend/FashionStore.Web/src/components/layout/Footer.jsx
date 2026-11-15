import { Link } from "react-router-dom";

import { ArrowUpRight, ArrowUp } from "lucide-react";

function Footer() {
  function veDauTrang() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "#030303", color: "#f0f0f5" }}
    >
      {/* =====================================
          AMBIENT GLOW ORBS
      ===================================== */}

      {/* Orb cyan — top left */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-80px",
          left: "-80px",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: "rgba(0,217,255,0.08)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      {/* Orb purple — bottom right */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-60px",
          right: "-60px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "rgba(124,58,237,0.1)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      {/* Orb purple — mid left */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "40%",
          left: "30%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(124,58,237,0.06)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div className="container-shell relative py-16 md:py-20">
        {/* TOP */}

        <div
          className="grid grid-cols-1 gap-12 pb-14 md:grid-cols-2"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400"
            >
              MODERN FASHION
            </p>

            <h2 className="mt-5 max-w-xl font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.07em] md:text-7xl">
              FIND YOUR
              <br />
              OWN{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #c084fc 50%, #a855f7 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                STYLE.
              </span>
            </h2>
          </div>

          <div className="flex flex-col justify-end md:items-end">
            <p
              className="max-w-sm text-sm leading-7 md:text-right"
              style={{ color: "rgba(240,240,245,0.5)" }}
            >
              Thời trang không chỉ là những gì bạn mặc. Đó còn là cách bạn thể
              hiện cá tính và bản sắc riêng.
            </p>

            <Link
              to="/san-pham"
              className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-purple-400 transition-all duration-200 hover:text-purple-300"
              onMouseEnter={function (e) {
                e.currentTarget.style.gap = "20px";
                e.currentTarget.style.textShadow = "0 0 16px rgba(168,85,247,0.6)";
              }}
              onMouseLeave={function (e) {
                e.currentTarget.style.gap = "12px";
                e.currentTarget.style.textShadow = "none";
              }}
            >
              Khám phá bộ sưu tập
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>

        {/* BOTTOM LINKS */}

        <div className="grid grid-cols-1 gap-10 py-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="font-display text-xl font-extrabold tracking-[-0.07em]" style={{ color: "#f0f0f5" }}>
              FASHIONSTORE
              <span
                style={{
                  background: "linear-gradient(135deg, #a855f7, #6366f1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                .
              </span>
            </p>

            <p
              className="mt-3 text-xs leading-6"
              style={{ color: "rgba(240,240,245,0.35)" }}
            >
              Modern Fashion.
              <br />
              Modern Identity.
            </p>
          </div>

          <div>
            <p
              className="eyebrow"
              style={{ color: "rgba(240,240,245,0.35)", letterSpacing: "0.15em" }}
            >
              KHÁM PHÁ
            </p>

            <div className="mt-5 flex flex-col gap-3 text-sm">
              <Link
                to="/"
                className="transition-colors duration-150 hover:text-purple-400"
                style={{ color: "rgba(240,240,245,0.6)" }}
              >
                Trang chủ
              </Link>

              <Link
                to="/san-pham"
                className="transition-colors duration-150 hover:text-purple-400"
                style={{ color: "rgba(240,240,245,0.6)" }}
              >
                Sản phẩm
              </Link>
            </div>
          </div>

          <div>
            <p
              className="eyebrow"
              style={{ color: "rgba(240,240,245,0.35)", letterSpacing: "0.15em" }}
            >
              TÀI KHOẢN
            </p>

            <div className="mt-5 flex flex-col gap-3 text-sm">
              <Link
                to="/dang-nhap"
                className="transition-colors duration-150 hover:text-purple-400"
                style={{ color: "rgba(240,240,245,0.6)" }}
              >
                Đăng nhập
              </Link>

              <Link
                to="/gio-hang"
                className="transition-colors duration-150 hover:text-purple-400"
                style={{ color: "rgba(240,240,245,0.6)" }}
              >
                Giỏ hàng
              </Link>
            </div>
          </div>

          <div>
            <p
              className="eyebrow"
              style={{ color: "rgba(240,240,245,0.35)", letterSpacing: "0.15em" }}
            >
              ĐIỀU HƯỚNG
            </p>

            <button
              type="button"
              onClick={veDauTrang}
              className="mt-5 inline-flex items-center gap-3 text-sm transition-colors duration-150 hover:text-purple-400"
              style={{ color: "rgba(240,240,245,0.6)" }}
              onMouseEnter={function (e) {
                e.currentTarget.style.textShadow = "0 0 12px rgba(168,85,247,0.5)";
              }}
              onMouseLeave={function (e) {
                e.currentTarget.style.textShadow = "none";
              }}
            >
              Về đầu trang
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        {/* COPYRIGHT */}

        <div
          className="flex flex-col justify-between gap-3 pt-6 text-[11px] sm:flex-row"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(240,240,245,0.3)",
          }}
        >
          <p>© 2026 FASHIONSTORE. ALL RIGHTS RESERVED.</p>

          <p>DESIGNED FOR YOUR OWN IDENTITY.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
