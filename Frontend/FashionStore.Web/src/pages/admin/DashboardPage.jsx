import {
  Package,
  ClipboardList,
  Truck,
  Warehouse,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Shield,
  Layers,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SpotlightCard } from "../../components/ui";

const dashboardItems = [
  {
    title: "Sản phẩm",
    description: "Quản lý danh mục & phân loại",
    icon: Package,
    color: "#a855f7",
    href: "/admin-preview/san-pham",
    tag: "CATALOG",
  },
  {
    title: "Đơn hàng",
    description: "Theo dõi & xử lý đơn mua",
    icon: ClipboardList,
    color: "#c084fc",
    href: "/admin-preview/don-hang",
    tag: "ORDERS",
  },
  {
    title: "Vận chuyển",
    description: "Trạng thái giao nhận hàng",
    icon: Truck,
    color: "#818cf8",
    href: "/admin-preview/van-chuyen",
    tag: "LOGISTICS",
  },
  {
    title: "Tồn kho",
    description: "Kiểm soát số lượng tồn & nhập",
    icon: Warehouse,
    color: "#ec4899",
    href: "/admin-preview/ton-kho",
    tag: "STOCK",
  },
];

function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* PAGE HEADING */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-6 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-purple-400">
              ADMIN DASHBOARD
            </p>
          </div>

          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Tổng quan hệ thống
          </h1>

          <p className="mt-1 text-sm text-white/50">
            Trung tâm điều khiển và giám sát hoạt động FashionStore.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-300 backdrop-blur-md">
          <Activity size={15} className="animate-pulse text-purple-400" />
          <span>Realtime Metrics • 2026</span>
        </div>
      </div>

      {/* NOTICE BANNER */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-purple-600/15 via-fuchsia-600/10 to-transparent p-6 backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/15 text-purple-300">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Giao diện quản trị phong cách ReactBits đã kích hoạt
            </h3>
            <p className="mt-1 text-xs leading-6 text-white/60">
              Hệ thống được thiết kế tối ưu với hiệu ứng Spotlight Card, Dark Glassmorphism và Neon Violet Accents.
              Các chỉ số thống kê sẽ đồng bộ realtime từ cơ sở dữ liệu backend.
            </p>
          </div>
        </div>
      </div>
            </p>
          </div>
        </div>
      </div>

      {/* MODULE CARDS (REACTBITS SPOTLIGHT CARDS) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.title} to={item.href} className="block">
              <SpotlightCard
                spotlightColor={`${item.color}25`}
                hoverBorderColor={`${item.color}60`}
                className="p-6"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300"
                    style={{
                      background: `${item.color}15`,
                      borderColor: `${item.color}40`,
                      color: item.color,
                      boxShadow: `0 0 15px ${item.color}20`,
                    }}
                  >
                    <Icon size={22} />
                  </div>

                  <span
                    className="rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest"
                    style={{
                      background: `${item.color}15`,
                      color: item.color,
                      border: `1px solid ${item.color}30`,
                    }}
                  >
                    {item.tag}
                  </span>
                </div>

                <div className="mt-6 flex items-baseline justify-between">
                  <h2 className="text-lg font-bold text-white">{item.title}</h2>
                  <ArrowUpRight
                    size={16}
                    className="text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>

                <p className="mt-1 text-xs text-white/50">{item.description}</p>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-white/40">
                  <span>Trạng thái</span>
                  <span className="font-semibold text-emerald-400">● Hoạt động</span>
                </div>
              </SpotlightCard>
            </Link>
          );
        })}
      </div>

      {/* RECENT ACTIVITY & SYSTEM STATUS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* RECENT ACTIVITIES */}
        <section className="rounded-2xl border border-white/10 bg-[#0d0d14]/70 p-6 backdrop-blur-xl lg:col-span-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="font-display text-base font-bold text-white">
                Hoạt động hệ thống
              </h2>
              <p className="text-xs text-white/40">Nhật ký truy cập và tương tác mới nhất</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-semibold text-white/60">
              Live Stream
            </span>
          </div>

          <div className="divide-y divide-white/5 pt-2">
            {[
              {
                time: "Vừa xong",
                desc: "Hệ thống bảo mật API đã kích hoạt chính sách CORS linh hoạt",
                badge: "SECURITY",
                color: "text-purple-400",
              },
              {
                time: "5 phút trước",
                desc: "Bộ sưu tập 2026 Collection sẵn sàng phục vụ người dùng",
                badge: "CATALOG",
                color: "text-fuchsia-400",
              },
              {
                time: "10 phút trước",
                desc: "Database PostgreSQL kết nối ổn định",
                badge: "DATABASE",
                color: "text-emerald-400",
              },
            ].map((act, index) => (
              <div key={index} className="flex items-center justify-between py-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className={`font-mono font-bold ${act.color}`}>[{act.badge}]</span>
                  <span className="text-white/80">{act.desc}</span>
                </div>
                <span className="text-white/40">{act.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SYSTEM PERFORMANCE */}
        <section className="rounded-2xl border border-white/10 bg-[#0d0d14]/70 p-6 backdrop-blur-xl">
          <div className="border-b border-white/10 pb-4">
            <h2 className="font-display text-base font-bold text-white">
              Hiệu suất Console
            </h2>
            <p className="text-xs text-white/40">Tình trạng tài nguyên máy chủ</p>
          </div>

          <div className="space-y-5 pt-5">
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Bộ nhớ Cache</span>
                <span className="font-bold text-purple-400">94% Tối ưu</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[94%] bg-gradient-to-r from-purple-500 to-indigo-500" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Độ trễ phản hồi</span>
                <span className="font-bold text-emerald-400">28ms</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[25%] bg-emerald-400" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Cloudflare Edge Sync</span>
                <span className="font-bold text-[#a3e635]">Đồng bộ</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[100%] bg-[#a3e635]" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;
