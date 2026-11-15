import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Search, UserRound, ShoppingBag, Menu, X, ArrowUpRight } from "lucide-react";
import Navigation from "./Navigation";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { tongSoLuong } = useCart();
  const { daDangNhap } = useAuth();
  const duongDanTaiKhoan = daDangNhap ? "/tai-khoan" : "/dang-nhap";

  useEffect(() => setMenuOpen(false), [location.pathname, location.search]);

  const actionClass = "header-icon-button";

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="announcement-strip">
        <span className="announcement-dot" />
        <span>FASHIONSTORE STUDIO</span>
        <span className="announcement-separator">/</span>
        <span className="announcement-muted">NEW SEASON — DISCOVER YOUR FORM</span>
        <ArrowUpRight size={12} className="announcement-arrow" />
      </div>

      <div className="container-shell header-main">
        <button
          type="button"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((value) => !value)}
          className={`${actionClass} md:hidden`}
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>

        <Link to="/" className="brand-lockup" aria-label="FashionStore - Trang chủ">
          <span className="brand-mark">F<span>.</span></span>
          <span className="brand-wordmark">FASHIONSTORE</span>
        </Link>

        <div className="hidden md:block">
          <Navigation />
        </div>

        <div className="header-actions">
          <Link to="/san-pham" aria-label="Tìm kiếm sản phẩm" className={actionClass}>
            <Search size={18} strokeWidth={1.8} />
          </Link>
          <Link to={duongDanTaiKhoan} aria-label={daDangNhap ? "Tài khoản" : "Đăng nhập"} className={actionClass}>
            <UserRound size={18} strokeWidth={1.8} />
          </Link>
          <Link to="/gio-hang" aria-label={`Giỏ hàng, ${tongSoLuong} sản phẩm`} className={`${actionClass} cart-action`}>
            <ShoppingBag size={18} strokeWidth={1.8} />
            {tongSoLuong > 0 && <motion.span key={tongSoLuong} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="cart-count">{tongSoLuong > 99 ? "99+" : tongSoLuong}</motion.span>}
          </Link>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 240, damping: 27 }}
            className="mobile-navigation-wrap md:hidden"
          >
            <div className="container-shell mobile-navigation-content">
              <Navigation mobile onNavigate={() => setMenuOpen(false)} />
              <div className="mobile-navigation-meta">
                <Link to={duongDanTaiKhoan} onClick={() => setMenuOpen(false)}>
                  <UserRound size={16} /> {daDangNhap ? "Tài khoản của tôi" : "Đăng nhập / Đăng ký"}
                </Link>
                <Link to="/gio-hang" onClick={() => setMenuOpen(false)}>
                  <ShoppingBag size={16} /> Giỏ hàng <span>{tongSoLuong}</span>
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
