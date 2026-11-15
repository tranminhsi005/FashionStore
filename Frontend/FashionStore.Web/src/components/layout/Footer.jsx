import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import { motion } from "motion/react";

function Footer() {
  function veDauTrang() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="site-footer relative overflow-hidden">
      <div className="footer-ambient footer-ambient-one" aria-hidden="true" />
      <div className="footer-ambient footer-ambient-two" aria-hidden="true" />
      <div className="container-shell relative z-10 py-14 md:py-20">
        <div className="footer-feature">
          <div>
            <p className="eyebrow">THE FASHIONSTORE EDIT</p>
            <h2 className="footer-headline">WEAR YOUR<br /><span>OWN FREQUENCY.</span></h2>
          </div>
          <div className="footer-feature-copy">
            <p>Phong cách không cần lên tiếng quá nhiều. Chỉ cần đúng với bạn — từ chất liệu, phom dáng đến từng chi tiết nhỏ.</p>
            <Link to="/san-pham" className="footer-cta">Khám phá bộ sưu tập <ArrowUpRight size={17} /></Link>
          </div>
        </div>

        <div className="footer-links-grid">
          <div>
            <Link to="/" className="brand-lockup footer-brand">
              <span className="brand-mark">F<span>.</span></span>
              <span className="brand-wordmark">FASHIONSTORE</span>
            </Link>
            <p className="footer-brand-note">Modern form.<br />Personal identity.</p>
          </div>
          <div>
            <p className="footer-label">KHÁM PHÁ</p>
            <div className="footer-link-list"><Link to="/">Trang chủ</Link><Link to="/san-pham">Tất cả sản phẩm</Link><Link to="/#about">Về thương hiệu</Link></div>
          </div>
          <div>
            <p className="footer-label">TÀI KHOẢN</p>
            <div className="footer-link-list"><Link to="/dang-nhap">Đăng nhập</Link><Link to="/dang-ky">Tạo tài khoản</Link><Link to="/don-hang">Đơn hàng của tôi</Link></div>
          </div>
          <div className="footer-back-top">
            <p className="footer-label">ĐIỀU HƯỚNG</p>
            <motion.button type="button" onClick={veDauTrang} whileTap={{ scale: 0.96 }}>
              Về đầu trang <ArrowUp size={16} />
            </motion.button>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 FASHIONSTORE. ALL RIGHTS RESERVED.</span>
          <span>DESIGNED FOR YOUR OWN IDENTITY.</span>
          <span className="footer-status"><i /> DIGITAL ATELIER / VIETNAM</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
