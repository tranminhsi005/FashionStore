import { Link } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

function dinhDangNgay(ngay) {
  if (!ngay) {
    return "Chưa xác định";
  }

  return new Date(ngay).toLocaleDateString("vi-VN");
}

export default function AccountPage() {
  const { nguoiDung, dangKhoiTao } = useAuth();

  if (dangKhoiTao) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f7f6f2]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
      </main>
    );
  }

  if (!nguoiDung) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-[#f7f6f2]">
        <h1 className="text-2xl font-semibold">
          Không tìm thấy thông tin tài khoản
        </h1>

        <Link
          to="/dang-nhap"
          className="mt-6 bg-black px-7 py-4 text-xs font-semibold uppercase tracking-widest text-white"
        >
          Đăng nhập
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#171717]">
      <div className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8">
        {/* HEADER */}

        <div className="mb-10 border-b border-gray-200 pb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
            My account
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Tài khoản của tôi
          </h1>

          <p className="mt-4 text-sm text-gray-500">
            Quản lý thông tin và các hoạt động mua sắm của bạn.
          </p>
        </div>

        {/* THÔNG TIN CÁ NHÂN */}

        <section className="border border-gray-200 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Personal information
              </p>

              <h2 className="mt-3 text-2xl font-semibold">{nguoiDung.hoTen}</h2>
            </div>

            <span className="border border-green-200 bg-green-50 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-green-700">
              Tài khoản hoạt động
            </span>
          </div>

          <div className="grid grid-cols-1 gap-7 pt-7 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-400">Họ và tên</p>

              <p className="mt-2 text-sm font-medium">
                {nguoiDung.hoTen || "Chưa cập nhật"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Email</p>

              <p className="mt-2 break-all text-sm font-medium">
                {nguoiDung.email || "Chưa cập nhật"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Số điện thoại</p>

              <p className="mt-2 text-sm font-medium">
                {nguoiDung.soDienThoai || "Chưa cập nhật"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Ngày tạo tài khoản</p>

              <p className="mt-2 text-sm font-medium">
                {dinhDangNgay(nguoiDung.ngayTao)}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs text-gray-400">Vai trò</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {(nguoiDung.vaiTros || []).map(function (vaiTro) {
                  return (
                    <span
                      key={vaiTro}
                      className="border border-gray-200 px-3 py-2 text-xs"
                    >
                      {vaiTro}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* QUẢN LÝ TÀI KHOẢN */}

        <section className="mt-8">
          <h2 className="mb-5 text-xl font-semibold">Quản lý mua sắm</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              to="/don-hang"
              className="group border border-gray-200 bg-white p-7 transition-colors hover:border-black"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Orders
              </p>

              <h3 className="mt-4 text-xl font-semibold">Đơn hàng của tôi</h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Theo dõi trạng thái, xem chi tiết và quản lý các đơn hàng.
              </p>

              <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-widest underline underline-offset-4 group-hover:text-gray-500">
                Xem đơn hàng →
              </span>
            </Link>

            <Link
              to="/dia-chi"
              className="group border border-gray-200 bg-white p-7 transition-colors hover:border-black"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Addresses
              </p>

              <h3 className="mt-4 text-xl font-semibold">Địa chỉ giao hàng</h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Thêm, sửa, xóa và chọn địa chỉ nhận hàng mặc định.
              </p>

              <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-widest underline underline-offset-4 group-hover:text-gray-500">
                Quản lý địa chỉ →
              </span>
            </Link>
          </div>
        </section>

        {/* GHI CHÚ VỀ CHỨC NĂNG CHƯA CÓ API */}

        <div className="mt-8 border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold">Cập nhật hồ sơ và bảo mật</h2>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            Chức năng chỉnh sửa họ tên, số điện thoại và đổi mật khẩu chưa được
            kết nối vì backend hiện chưa cung cấp các API tương ứng.
          </p>
        </div>
      </div>
    </main>
  );
}
