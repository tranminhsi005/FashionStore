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
    <footer className="bg-ink text-white">
      <div className="container-shell py-16 md:py-20">
        {/* TOP */}

        <div className="grid grid-cols-1 gap-12 border-b border-white/15 pb-14 md:grid-cols-2">
          <div>
            <p className="eyebrow text-white/50">MODERN FASHION</p>

            <h2 className="mt-5 max-w-xl font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.07em] md:text-7xl">
              FIND YOUR
              <br />
              OWN <span className="text-accent">STYLE.</span>
            </h2>
          </div>

          <div className="flex flex-col justify-end md:items-end">
            <p className="max-w-sm text-sm leading-7 text-white/55 md:text-right">
              Thời trang không chỉ là những gì bạn mặc. Đó còn là cách bạn thể
              hiện cá tính và bản sắc riêng.
            </p>

            <Link
              to="/san-pham"
              className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-accent transition hover:gap-5"
            >
              Khám phá bộ sưu tập
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>

        {/* BOTTOM */}

        <div className="grid grid-cols-1 gap-10 py-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="font-display text-xl font-extrabold tracking-[-0.07em]">
              FASHIONSTORE<span className="text-accent">.</span>
            </p>

            <p className="mt-3 text-xs leading-6 text-white/45">
              Modern Fashion.
              <br />
              Modern Identity.
            </p>
          </div>

          <div>
            <p className="eyebrow text-white/40">KHÁM PHÁ</p>

            <div className="mt-5 flex flex-col gap-3 text-sm text-white/70">
              <Link to="/" className="hover:text-accent">
                Trang chủ
              </Link>

              <Link to="/san-pham" className="hover:text-accent">
                Sản phẩm
              </Link>
            </div>
          </div>

          <div>
            <p className="eyebrow text-white/40">TÀI KHOẢN</p>

            <div className="mt-5 flex flex-col gap-3 text-sm text-white/70">
              <Link to="/dang-nhap" className="hover:text-accent">
                Đăng nhập
              </Link>

              <Link to="/gio-hang" className="hover:text-accent">
                Giỏ hàng
              </Link>
            </div>
          </div>

          <div>
            <p className="eyebrow text-white/40">ĐIỀU HƯỚNG</p>

            <button
              type="button"
              onClick={veDauTrang}
              className="mt-5 inline-flex items-center gap-3 text-sm text-white/70 transition hover:text-accent"
            >
              Về đầu trang
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        {/* COPYRIGHT */}

        <div className="flex flex-col justify-between gap-3 border-t border-white/15 pt-6 text-[11px] text-white/40 sm:flex-row">
          <p>© 2026 FASHIONSTORE. ALL RIGHTS RESERVED.</p>

          <p>DESIGNED FOR YOUR OWN IDENTITY.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
