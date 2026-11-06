import { Package, ClipboardList, Truck, Warehouse } from "lucide-react";

const dashboardItems = [
  {
    title: "Sản phẩm",
    description: "Quản lý sản phẩm",
    icon: Package,
  },
  {
    title: "Đơn hàng",
    description: "Theo dõi đơn hàng",
    icon: ClipboardList,
  },
  {
    title: "Vận chuyển",
    description: "Theo dõi giao hàng",
    icon: Truck,
  },
  {
    title: "Tồn kho",
    description: "Quản lý hàng hóa",
    icon: Warehouse,
  },
];

function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* PAGE HEADING */}

      <div>
        <p className="eyebrow text-muted">ADMINISTRATION</p>

        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.06em] md:text-4xl">
          Tổng quan
        </h1>

        <p className="mt-3 text-sm text-muted">
          Không gian quản lý hệ thống FashionStore.
        </p>
      </div>

      {/* NOTICE */}

      <div className="border border-line bg-white p-5">
        <p className="text-sm font-semibold">Giao diện quản trị đã sẵn sàng.</p>

        <p className="mt-2 text-xs leading-6 text-muted">
          Các số liệu thống kê sẽ được kết nối với backend khi triển khai module
          quản trị. Hiện tại chưa có dữ liệu thống kê được tải.
        </p>
      </div>

      {/* MODULE CARDS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="border border-line bg-white p-5 transition hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center bg-paper-dark">
                  <Icon size={21} />
                </div>

                <span className="text-2xl font-semibold text-muted-light">
                  —
                </span>
              </div>

              <h2 className="mt-7 text-sm font-bold">{item.title}</h2>

              <p className="mt-2 text-xs text-muted">{item.description}</p>

              <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-muted-light">
                Chưa kết nối dữ liệu
              </p>
            </div>
          );
        })}
      </div>

      {/* DATA PLACEHOLDER */}

      <section className="border border-line bg-white">
        <div className="border-b border-line p-5">
          <h2 className="font-display text-lg font-bold">Hoạt động gần đây</h2>

          <p className="mt-1 text-xs text-muted">
            Thông tin hoạt động sẽ xuất hiện khi tích hợp API.
          </p>
        </div>

        <div className="flex min-h-48 items-center justify-center p-5">
          <p className="text-sm text-muted">Chưa có dữ liệu để hiển thị.</p>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
