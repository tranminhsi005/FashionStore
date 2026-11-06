import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

import { layGioHang } from "../services/cartService";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { daDangNhap, dangKhoiTao } = useAuth();

  const [gioHang, setGioHang] = useState(null);

  const [dangTaiGioHang, setDangTaiGioHang] = useState(false);

  const [loiTaiGioHang, setLoiTaiGioHang] = useState("");

  // =============================================
  // LẤY GIỎ HÀNG TỪ BACKEND
  // =============================================

  const taiGioHang = useCallback(
    async function () {
      // Chưa đăng nhập thì không tải giỏ hàng
      if (!daDangNhap) {
        setGioHang(null);

        setLoiTaiGioHang("");

        return null;
      }

      setDangTaiGioHang(true);

      setLoiTaiGioHang("");

      try {
        const ketQua = await layGioHang();

        setGioHang(ketQua);

        return ketQua;
      } catch (error) {
        const thongBao =
          error.response?.data?.message ||
          error.response?.data?.detail ||
          error.message ||
          "Không thể tải giỏ hàng.";

        setLoiTaiGioHang(thongBao);

        throw error;
      } finally {
        setDangTaiGioHang(false);
      }
    },
    [daDangNhap],
  );

  // =============================================
  // TỰ ĐỘNG TẢI GIỎ HÀNG KHI ĐĂNG NHẬP
  // =============================================

  useEffect(
    function () {
      // Chờ AuthContext khôi phục phiên đăng nhập
      if (dangKhoiTao) {
        return;
      }

      if (daDangNhap) {
        taiGioHang().catch(function () {
          // Lỗi đã được lưu trong loiTaiGioHang
        });
      } else {
        // Đăng xuất thì xóa dữ liệu giỏ hàng trên giao diện
        setGioHang(null);

        setLoiTaiGioHang("");

        setDangTaiGioHang(false);
      }
    },
    [daDangNhap, dangKhoiTao, taiGioHang],
  );

  // =============================================
  // CẬP NHẬT GIỎ HÀNG TỪ KẾT QUẢ API
  // =============================================

  function capNhatGioHang(duLieuMoi) {
    if (!duLieuMoi) {
      return;
    }

    setGioHang(duLieuMoi);

    setLoiTaiGioHang("");
  }

  // =============================================
  // TỔNG SỐ LƯỢNG SẢN PHẨM
  // =============================================

  const tongSoLuong = gioHang?.tongSoLuong || 0;

  // =============================================
  // GIÁ TRỊ CHIA SẺ CHO CÁC COMPONENT
  // =============================================

  const giaTri = useMemo(
    function () {
      return {
        gioHang: gioHang,

        tongSoLuong: tongSoLuong,

        dangTaiGioHang: dangTaiGioHang,

        loiTaiGioHang: loiTaiGioHang,

        taiGioHang: taiGioHang,

        capNhatGioHang: capNhatGioHang,
      };
    },
    [gioHang, tongSoLuong, dangTaiGioHang, loiTaiGioHang, taiGioHang],
  );

  return <CartContext.Provider value={giaTri}>{children}</CartContext.Provider>;
}

// =============================================
// CUSTOM HOOK
// =============================================

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart phải được sử dụng bên trong CartProvider.");
  }

  return context;
}
