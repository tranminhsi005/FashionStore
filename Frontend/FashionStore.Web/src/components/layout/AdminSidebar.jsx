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
        <div>
          <p className="font-display text-xl font-extrabold tracking-[-0.07em]">
            FASHIONSTORE
            <span className="text-[#00d9ff]">.</span>
          </p>

          <div className="mt-1 flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#00d9ff]" />
            <p className="text-[9px] font-bold tracking-[0.22em] text-[#00d9ff]">
              ADMIN CONSOLE
            </p>
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
                return `group flex shrink-0 items-center gap-3 whitespace-nowrap rounded-lg px-3.5 py-3 text-xs font-semibold transition-all duration-300 ${
                  isActive
                    ? "border border-[#00d9ff]/30 bg-gradient-to-r from-[#00d9ff]/20 via-[#7c3aed]/10 to-transparent text-white shadow-[0_0_20px_rgba(0,217,255,0.15)]"
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
                        ? "text-[#00d9ff] drop-shadow-[0_0_8px_rgba(0,217,255,0.8)]"
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
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#00d9ff]" />
            <span className="text-[11px] font-bold text-white">ReactBits Engine</span>
          </div>
          <p className="mt-1 text-[10px] text-white/40">
            UI Version 2.0 • Cyber Active
          </p>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
