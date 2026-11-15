import { Link, NavLink } from "react-router-dom";
import { motion } from "motion/react";

const navigationItems = [
  { label: "Trang chủ", to: "/", end: true },
  { label: "Sản phẩm", to: "/san-pham" },
  { label: "Về thương hiệu", to: "/#about", isAnchor: true },
];

function Navigation({ mobile = false, onNavigate }) {
  const baseClass = mobile
    ? "flex flex-col gap-2"
    : "navigation-glass flex items-center gap-1 rounded-full p-1.5";

  return (
    <nav aria-label="Điều hướng chính" className={baseClass}>
      {navigationItems.map((item) => {
        if (item.isAnchor) {
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`navigation-link ${mobile ? "navigation-link-mobile" : ""}`}
            >
              {item.label}
            </Link>
          );
        }

        return (
          <NavLink key={item.to} to={item.to} end={item.end} onClick={onNavigate}>
            {({ isActive }) => (
              <span className={`navigation-link ${mobile ? "navigation-link-mobile" : ""} ${isActive ? "is-active" : ""}`}>
                {isActive && !mobile && (
                  <motion.span
                    layoutId="fashionstore-navigation-active"
                    className="navigation-active-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </span>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

export default Navigation;
