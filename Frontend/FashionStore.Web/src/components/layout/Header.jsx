import { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";

import { AnimatePresence, motion } from "motion/react";

import { Search, UserRound, ShoppingBag, Menu, X } from "lucide-react";

import Navigation from "./Navigation";

import { useCart } from "../../contexts/CartContext";

import { useAuth } from "../../contexts/AuthContext";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  const { tongSoLuong } = useCart();

  const { daDangNhap } = useAuth();

  // =============================================
  // ĐƯỜNG DẪN TÀI KHOẢN
  // =============================================

  const duongDanTaiKhoan = daDangNhap ? "/tai-khoan" : "/dang-nhap";

  // =============================================
  // ĐÓNG MENU MOBILE KHI CHUYỂN TRANG
  // =============================================

  useEffect(
    function () {
      setMenuOpen(false);
    },
    [location.pathname, location.search],
  );

  // =============================================
  // ĐÓNG MENU
  // =============================================

  function dongMenu() {
    setMenuOpen(false);
  }

  // =============================================
  // GIAO DIỆN
  // =============================================

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-md">
      {/* =====================================
          ANNOUNCEMENT BAR
      ===================================== */}

      <div className="bg-ink px-4 py-2 text-center text-[10px] font-semibold tracking-[0.2em] text-white md:text-xs">
        A NEW PERSPECTIVE ON EVERYDAY STYLE
      </div>

      {/* =====================================
          MAIN HEADER
      ===================================== */}

      <div className="border-b border-line">
        <div className="container-shell flex h-[76px] items-center justify-between">
          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={function () {
              setMenuOpen(!menuOpen);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-paper-dark md:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* LOGO */}

          <Link
            to="/"
            onClick={dongMenu}
            className="font-display text-xl font-extrabold tracking-[-0.08em] md:text-2xl"
          >
            FASHIONSTORE
            <span className="text-accent-dark">.</span>
          </Link>

          {/* DESKTOP NAVIGATION */}

          <div className="hidden md:block">
            <Navigation />
          </div>

          {/* =====================================
              ACTIONS
          ===================================== */}

          <div className="flex items-center gap-1 md:gap-3">
            {/* SEARCH */}

            <Link
              to="/san-pham"
              aria-label="Tìm kiếm sản phẩm"
              onClick={dongMenu}
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-paper-dark"
            >
              <Search size={19} strokeWidth={1.7} />
            </Link>

            {/* ACCOUNT */}

            <Link
              to={duongDanTaiKhoan}
              aria-label={daDangNhap ? "Tài khoản" : "Đăng nhập"}
              onClick={dongMenu}
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-paper-dark"
            >
              <UserRound size={19} strokeWidth={1.7} />
            </Link>

            {/* CART */}

            <Link
              to="/gio-hang"
              aria-label={`Giỏ hàng, ${tongSoLuong} sản phẩm`}
              onClick={dongMenu}
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-paper-dark"
            >
              <ShoppingBag size={19} strokeWidth={1.7} />

              {daDangNhap && tongSoLuong > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-bold leading-none text-white">
                  {tongSoLuong > 99 ? "99+" : tongSoLuong}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================
          MOBILE NAVIGATION
      ===================================== */}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.25,
            }}
            className="overflow-hidden border-b border-line bg-paper md:hidden"
          >
            <div className="container-shell py-7">
              {/* NAVIGATION */}

              <Navigation mobile onNavigate={dongMenu} />

              {/* ACCOUNT */}

              <div className="mt-8 border-t border-line pt-5">
                <Link
                  to={duongDanTaiKhoan}
                  onClick={dongMenu}
                  className="flex items-center gap-3 text-sm font-semibold transition-colors hover:text-accent-dark"
                >
                  <UserRound size={18} />

                  {daDangNhap ? "Tài khoản của tôi" : "Đăng nhập"}
                </Link>
              </div>

              {/* CART */}

              <div className="mt-5">
                <Link
                  to="/gio-hang"
                  onClick={dongMenu}
                  className="flex items-center gap-3 text-sm font-semibold transition-colors hover:text-accent-dark"
                >
                  <ShoppingBag size={18} />
                  Giỏ hàng
                  {daDangNhap && tongSoLuong > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] text-white">
                      {tongSoLuong > 99 ? "99+" : tongSoLuong}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
