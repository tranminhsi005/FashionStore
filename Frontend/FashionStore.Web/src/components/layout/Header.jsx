import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Search, UserRound, ShoppingBag, Menu, X, Sparkles } from "lucide-react";
import Navigation from "./Navigation";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { tongSoLuong } = useCart();
  const { daDangNhap } = useAuth();

  const duongDanTaiKhoan = daDangNhap ? "/tai-khoan" : "/dang-nhap";

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  function dongMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#060608]/80 backdrop-blur-2xl">
      {/* =====================================
          TOP ANNOUNCEMENT BAR (REACTBITS STYLE)
      ===================================== */}
      <div className="relative overflow-hidden border-b border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-purple-600/15 to-purple-950/40 px-4 py-2 text-center text-[10px] font-bold tracking-[0.25em] text-purple-200 md:text-xs">
        <span className="text-purple-400">✦</span>
        <span className="mx-2 text-white/90">ELEVATE YOUR STYLE • 2026 CYBER COLLECTION</span>
        <span className="text-purple-400">✦</span>
      </div>

      {/* =====================================
          MAIN NAVBAR
      ===================================== */}
      <div className="container-shell flex h-[74px] items-center justify-between">
        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/80 transition-colors hover:border-purple-500/50 hover:text-white md:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            onClick={dongMenu}
            className="group flex items-center gap-1.5 font-display text-xl font-extrabold tracking-tight md:text-2xl"
          >
            <span className="bg-gradient-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-transparent">
              FASHIONSTORE
            </span>
            <span className="text-purple-500 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]">
              .
            </span>
          </Link>

          <span className="hidden items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-purple-300 sm:inline-flex">
            <Sparkles size={10} className="text-purple-400" />
            2026
          </span>
        </div>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:block">
          <Navigation />
        </div>

        {/* =====================================
            ACTIONS (SEARCH / ACCOUNT / CART)
        ===================================== */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* SEARCH */}
          <Link
            to="/san-pham"
            aria-label="Tìm kiếm sản phẩm"
            onClick={dongMenu}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/70 transition-all duration-300 hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-purple-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]"
          >
            <Search size={18} strokeWidth={1.8} />
          </Link>

          {/* ACCOUNT */}
          <Link
            to={duongDanTaiKhoan}
            aria-label={daDangNhap ? "Tài khoản" : "Đăng nhập"}
            onClick={dongMenu}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/70 transition-all duration-300 hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-purple-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]"
          >
            <UserRound size={18} strokeWidth={1.8} />
          </Link>

          {/* CART */}
          <Link
            to="/gio-hang"
            aria-label={`Giỏ hàng, ${tongSoLuong} sản phẩm`}
            onClick={dongMenu}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/70 transition-all duration-300 hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-purple-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]"
          >
            <ShoppingBag size={18} strokeWidth={1.8} />

            {tongSoLuong > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 px-1 text-[9px] font-extrabold leading-none text-white shadow-[0_0_12px_rgba(168,85,247,0.8)]">
                {tongSoLuong > 99 ? "99+" : tongSoLuong}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* =====================================
          MOBILE NAVIGATION
      ===================================== */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-b border-white/10 bg-[#0c0a14]/95 backdrop-blur-2xl md:hidden"
          >
            <div className="container-shell py-6">
              <Navigation mobile onNavigate={dongMenu} />

              <div className="mt-6 border-t border-white/10 pt-5">
                <Link
                  to={duongDanTaiKhoan}
                  onClick={dongMenu}
                  className="flex items-center gap-3 text-sm font-semibold text-white/70 transition-colors hover:text-purple-400"
                >
                  <UserRound size={18} />
                  {daDangNhap ? "Tài khoản của tôi" : "Đăng nhập / Đăng ký"}
                </Link>
              </div>

              <div className="mt-4">
                <Link
                  to="/gio-hang"
                  onClick={dongMenu}
                  className="flex items-center gap-3 text-sm font-semibold text-white/70 transition-colors hover:text-purple-400"
                >
                  <ShoppingBag size={18} />
                  Giỏ hàng
                  {tongSoLuong > 0 && (
                    <span className="ml-auto rounded-full bg-purple-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-[0_0_10px_rgba(168,85,247,0.6)]">
                      {tongSoLuong}
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
