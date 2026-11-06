import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

export default function GuestRoute() {
  const { nguoiDung, dangKhoiTao } = useAuth();

  if (dangKhoiTao) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  // Đã đăng nhập thì không cần vào trang đăng nhập nữa
  if (nguoiDung) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
