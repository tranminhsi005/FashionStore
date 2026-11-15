import { Link, NavLink } from "react-router-dom";

const navigationItems = [
  {
    label: "Trang chủ",
    to: "/",
    end: true,
  },
  {
    label: "Sản phẩm",
    to: "/san-pham",
  },
  {
    label: "Về thương hiệu",
    to: "/#about",
  },
];

function Navigation({ mobile = false, onNavigate }) {
  const baseClass = mobile
    ? "flex flex-col gap-4"
    : "flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-xl";

  return (
    <nav aria-label="Điều hướng chính" className={baseClass}>
      {navigationItems.map((item) => {
        if (item.to === "/#about") {
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`rounded-full px-4 py-2 text-xs font-semibold text-white/60 transition-all duration-300 hover:text-white ${
                mobile ? "text-base py-2.5" : ""
              }`}
            >
              {item.label}
            </Link>
          );
        }

        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) => `
              relative rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300
              ${
                isActive
                  ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                  : "text-white/60 hover:text-white hover:bg-white/[0.04]"
              }
              ${mobile ? "text-base py-2.5" : ""}
            `}
          >
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

export default Navigation;
