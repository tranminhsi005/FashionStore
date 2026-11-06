import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  Tags,
  Truck,
  Warehouse,
  ClipboardList,
  Ruler,
  Palette,
} from "lucide-react";

// =============================================
// DANH SÁCH MENU ADMIN
// =============================================

const adminMenus = [
  {
    label: "Tổng quan",
    path: "/admin-preview",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Sản phẩm",
    path: "/admin-preview/san-pham",
    icon: Package,
  },
  {
    label: "Danh mục",
    path: "/admin-preview/danh-muc",
    icon: Tags,
  },
  {
    label: "Thương hiệu",
    path: "/admin-preview/thuong-hieu",
    icon: Tags,
  },
  {
    label: "Kích cỡ",
    path: "/admin-preview/kich-co",
    icon: Ruler,
  },
  {
    label: "Màu sắc",
    path: "/admin-preview/mau-sac",
    icon: Palette,
  },
  {
    label: "Tồn kho",
    path: "/admin-preview/ton-kho",
    icon: Warehouse,
  },
  {
    label: "Đơn hàng",
    path: "/admin-preview/don-hang",
    icon: ClipboardList,
  },
  {
    label: "Vận chuyển",
    path: "/admin-preview/van-chuyen",
    icon: Truck,
  },
];

// =============================================
// COMPONENT
// =============================================

function AdminSidebar() {
  return (
    <aside className="z-40 w-full shrink-0 bg-ink text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:flex-col">
      {/* LOGO */}

      <div className="flex h-[76px] shrink-0 items-center border-b border-white/10 px-6">
        <div>
          <p className="font-display text-xl font-extrabold tracking-[-0.07em]">
            FASHIONSTORE
            <span className="text-accent">.</span>
          </p>

          <p className="mt-1 text-[9px] font-semibold tracking-[0.22em] text-white/40">
            ADMINISTRATION
          </p>
        </div>
      </div>

      {/* MENU */}

      <nav
        aria-label="Điều hướng quản trị"
        className="flex gap-2 overflow-x-auto px-3 py-3 lg:block lg:flex-1 lg:space-y-2 lg:overflow-y-auto lg:overflow-x-hidden lg:px-4 lg:py-7"
      >
        <p className="hidden px-3 pb-3 text-[10px] font-semibold tracking-[0.2em] text-white/35 lg:block">
          MENU QUẢN TRỊ
        </p>

        {adminMenus.map(function (item) {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={function ({ isActive }) {
                return `flex shrink-0 items-center gap-3 whitespace-nowrap rounded-control px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-accent text-ink"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`;
              }}
            >
              <Icon size={18} />

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* FOOTER */}

      <div className="mt-auto hidden shrink-0 border-t border-white/10 p-5 lg:block">
        <p className="text-xs text-white/40">FashionStore Admin</p>

        <p className="mt-1 text-[10px] text-white/25">Management Workspace</p>
      </div>
    </aside>
  );
}

export default AdminSidebar;
