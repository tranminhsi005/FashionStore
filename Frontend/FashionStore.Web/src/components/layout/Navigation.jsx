import { Link, NavLink } from "react-router-dom";

const navigationItems = [
  {
    label: "Trang chủ",
    to: "/",
    end: true,
  },
  {
    label: "Bộ sưu tập",
    to: "/san-pham",
  },
  {
    label: "Về chúng tôi",
    to: "/#about",
  },
];

function Navigation({ mobile = false, onNavigate }) {
  const baseClass = mobile ? "flex flex-col gap-5" : "flex items-center gap-9";

  return (
    <nav aria-label="Điều hướng chính" className={baseClass}>
      {navigationItems.map((item) => {
        if (item.to === "/#about") {
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`
                                text-sm
                                font-semibold
                                text-muted
                                transition
                                hover:text-ink
                                ${mobile ? "text-lg" : ""}
                            `}
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
                            relative
                            text-sm
                            font-semibold
                            transition
                            hover:text-ink
                            ${isActive ? "text-ink" : "text-muted"}
                            ${mobile ? "text-lg" : ""}
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
