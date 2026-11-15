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
    <header
      className="sticky top-0 z-50"
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background: "rgba(3,3,3,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* =====================================
          ANNOUNCEMENT BAR
      ===================================== */}

      <div
        className="px-4 py-2 text-center text-[10px] font-semibold tracking-[0.2em] text-white md:text-xs"
        style={{
          background: "linear-gradient(90deg, #00d9ff22 0%, #7c3aed22 50%, #00d9ff22 100%)",
          borderBottom: "1px solid rgba(0,217,255,0.15)",
        }}
      >
        <span style={{ color: "#00d9ff" }}>✦</span>
        {" "}A NEW PERSPECTIVE ON EVERYDAY STYLE{" "}
        <span style={{ color: "#7c3aed" }}>✦</span>
      </div>

      {/* =====================================
          MAIN HEADER
      ===================================== */}

      <div>
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
            className="flex h-10 w-10 items-center justify-center rounded-full transition md:hidden"
            style={{
              color: "var(--color-text, #f0f0f5)",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
            }}
            onMouseEnter={function(e) {
              e.currentTarget.style.background = "rgba(0,217,255,0.08)";
              e.currentTarget.style.borderColor = "rgba(0,217,255,0.3)";
            }}
            onMouseLeave={function(e) {
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* LOGO */}

          <Link
            to="/"
            onClick={dongMenu}
            className="font-display text-xl font-extrabold tracking-[-0.08em] md:text-2xl"
            style={{ color: "#f0f0f5" }}
          >
            FASHIONSTORE
            <span
              style={{
                background: "linear-gradient(135deg, #00d9ff, #7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              .
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}

          <div className="hidden md:block">
            <Navigation />
          </div>

          {/* =====================================
              ACTIONS
          ===================================== */}

          <div className="flex items-center gap-1 md:gap-2">
            {/* SEARCH */}

            <Link
              to="/san-pham"
              aria-label="Tìm kiếm sản phẩm"
              onClick={dongMenu}
              className="flex h-10 w-10 items-center justify-center rounded-full transition"
              style={{
                color: "rgba(240,240,245,0.65)",
                border: "1px solid transparent",
              }}
              onMouseEnter={function(e) {
                e.currentTarget.style.color = "#00d9ff";
                e.currentTarget.style.background = "rgba(0,217,255,0.08)";
                e.currentTarget.style.borderColor = "rgba(0,217,255,0.2)";
              }}
              onMouseLeave={function(e) {
                e.currentTarget.style.color = "rgba(240,240,245,0.65)";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <Search size={19} strokeWidth={1.7} />
            </Link>

            {/* ACCOUNT */}

            <Link
              to={duongDanTaiKhoan}
              aria-label={daDangNhap ? "Tài khoản" : "Đăng nhập"}
              onClick={dongMenu}
              className="flex h-10 w-10 items-center justify-center rounded-full transition"
              style={{
                color: "rgba(240,240,245,0.65)",
                border: "1px solid transparent",
              }}
              onMouseEnter={function(e) {
                e.currentTarget.style.color = "#00d9ff";
                e.currentTarget.style.background = "rgba(0,217,255,0.08)";
                e.currentTarget.style.borderColor = "rgba(0,217,255,0.2)";
              }}
              onMouseLeave={function(e) {
                e.currentTarget.style.color = "rgba(240,240,245,0.65)";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <UserRound size={19} strokeWidth={1.7} />
            </Link>

            {/* CART */}

            <Link
              to="/gio-hang"
              aria-label={`Giỏ hàng, ${tongSoLuong} sản phẩm`}
              onClick={dongMenu}
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition"
              style={{
                color: "rgba(240,240,245,0.65)",
                border: "1px solid transparent",
              }}
              onMouseEnter={function(e) {
                e.currentTarget.style.color = "#00d9ff";
                e.currentTarget.style.background = "rgba(0,217,255,0.08)";
                e.currentTarget.style.borderColor = "rgba(0,217,255,0.2)";
              }}
              onMouseLeave={function(e) {
                e.currentTarget.style.color = "rgba(240,240,245,0.65)";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <ShoppingBag size={19} strokeWidth={1.7} />

              {daDangNhap && tongSoLuong > 0 && (
                <span
                  className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold leading-none"
                  style={{
                    background: "linear-gradient(135deg, #00d9ff, #7c3aed)",
                    color: "#fff",
                    boxShadow: "0 0 8px rgba(0,217,255,0.5)",
                  }}
                >
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
            className="overflow-hidden md:hidden"
            style={{
              background: "rgba(13,13,20,0.98)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="container-shell py-7">
              {/* NAVIGATION */}

              <Navigation mobile onNavigate={dongMenu} />

              {/* ACCOUNT */}

              <div
                className="mt-8 pt-5"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Link
                  to={duongDanTaiKhoan}
                  onClick={dongMenu}
                  className="flex items-center gap-3 text-sm font-semibold transition-colors"
                  style={{ color: "rgba(240,240,245,0.65)" }}
                  onMouseEnter={function(e) {
                    e.currentTarget.style.color = "#00d9ff";
                  }}
                  onMouseLeave={function(e) {
                    e.currentTarget.style.color = "rgba(240,240,245,0.65)";
                  }}
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
                  className="flex items-center gap-3 text-sm font-semibold transition-colors"
                  style={{ color: "rgba(240,240,245,0.65)" }}
                  onMouseEnter={function(e) {
                    e.currentTarget.style.color = "#00d9ff";
                  }}
                  onMouseLeave={function(e) {
                    e.currentTarget.style.color = "rgba(240,240,245,0.65)";
                  }}
                >
                  <ShoppingBag size={18} />
                  Giỏ hàng
                  {daDangNhap && tongSoLuong > 0 && (
                    <span
                      className="flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold"
                      style={{
                        background: "linear-gradient(135deg, #00d9ff, #7c3aed)",
                        color: "#fff",
                        boxShadow: "0 0 8px rgba(0,217,255,0.4)",
                      }}
                    >
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
