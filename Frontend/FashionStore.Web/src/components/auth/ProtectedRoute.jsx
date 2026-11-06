import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

export default function ProtectedRoute({ requiredRoles = [] }) {
  const { nguoiDung, dangKhoiTao } = useAuth();

  const location = useLocation();

  // Đang kiểm tra phiên đăng nhập
  if (dangKhoiTao) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f6f2]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>

          <p className="mt-4 text-sm text-gray-500">
            Đang kiểm tra phiên đăng nhập...
          </p>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập
  if (!nguoiDung) {
    return (
      <Navigate
        to="/dang-nhap"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // Kiểm tra vai trò nếu route yêu cầu
  if (requiredRoles.length > 0) {
    const vaiTros = nguoiDung.vaiTros || [];

    const coQuyen = requiredRoles.some(function (vaiTro) {
      return vaiTros.includes(vaiTro);
    });

    if (!coQuyen) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
