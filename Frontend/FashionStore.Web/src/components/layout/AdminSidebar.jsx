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
  Sparkles,
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
    <aside className="z-40 w-full shrink-0 border-b border-white/10 bg-[#08080e]/90 text-white backdrop-blur-2xl lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
      {/* LOGO */}
      <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/10 px-6">
        <div className="flex items-center gap-3">
          <span className="brand-mark">F<span>.</span></span>
          <div>
            <p className="font-display text-sm font-extrabold tracking-[0.12em] text-white">FASHIONSTORE</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
              <p className="text-[8px] font-bold tracking-[0.2em] text-white/40">ADMIN STUDIO</p>
            </div>
          </div>
        </div>
      </div>

      {/* MENU */}
      <nav
        aria-label="Điều hướng quản trị"
        className="flex gap-1.5 overflow-x-auto px-3 py-3 lg:block lg:flex-1 lg:space-y-1.5 lg:overflow-y-auto lg:overflow-x-hidden lg:px-3 lg:py-6"
      >
        <p className="hidden px-3 pb-3 text-[10px] font-bold tracking-[0.2em] text-white/30 lg:block">
          HỆ THỐNG QUẢN LÝ
        </p>

        {adminMenus.map(function (item) {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={function ({ isActive }) {
                return `group flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-3.5 py-3 text-xs font-semibold transition-all duration-300 ${
                  isActive
                    ? "border border-purple-500/40 bg-gradient-to-r from-purple-600/25 via-fuchsia-600/15 to-transparent text-white shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                    : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                }`;
              }}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={17}
                    className={`transition-colors duration-300 ${
                      isActive
                        ? "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                        : "text-white/40 group-hover:text-white"
                    }`}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto hidden shrink-0 border-t border-white/10 p-5 lg:block">
        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-purple-400" />
            <span className="text-[11px] font-bold text-white">FashionStore Studio</span>
          </div>
          <p className="mt-1 text-[10px] text-purple-300/50">
            CONTROL PANEL • SYSTEM ONLINE
          </p>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
