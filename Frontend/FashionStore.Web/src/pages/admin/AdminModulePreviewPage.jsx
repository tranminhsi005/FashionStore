import { useLocation, Link } from "react-router-dom";

import { ArrowLeft } from "lucide-react";

const moduleNames = {
  "san-pham": "Quản lý sản phẩm",

  "danh-muc": "Quản lý danh mục",

  "thuong-hieu": "Quản lý thương hiệu",

  "ton-kho": "Quản lý tồn kho",

  "don-hang": "Quản lý đơn hàng",

  "van-chuyen": "Quản lý vận chuyển",
};

function AdminModulePreviewPage() {
  const location = useLocation();

  const moduleKey = location.pathname.split("/").pop();

  const moduleName = moduleNames[moduleKey] || "Module quản trị";

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow text-muted">ADMIN / PREVIEW</p>

        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.06em]">
          {moduleName}
        </h1>

        <p className="mt-3 text-sm text-muted">
          Giao diện chức năng này sẽ được triển khai trong các Phase quản trị
          tiếp theo.
        </p>
      </div>

      <div className="flex min-h-64 flex-col items-center justify-center border border-dashed border-line bg-white p-6 text-center">
        <p className="text-sm font-semibold">Module chưa được triển khai.</p>

        <p className="mt-2 max-w-md text-xs leading-6 text-muted">
          Đây chỉ là trang kiểm tra điều hướng. Chưa có dữ liệu hoặc thao tác
          nghiệp vụ ở đây.
        </p>

        <Link
          to="/admin-preview"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold transition hover:text-accent-dark"
        >
          <ArrowLeft size={16} />
          Về tổng quan quản trị
        </Link>
      </div>
    </div>
  );
}

export default AdminModulePreviewPage;
