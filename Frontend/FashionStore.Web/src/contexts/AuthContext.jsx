import { createContext, useContext, useEffect, useMemo, useState } from "react";

import * as authService from "../services/authService";

import { xoaAccessToken, datXuLyHetPhien } from "../api/tokenStore";

// Tạo Context
const AuthContext = createContext(null);

// =====================================================
// AUTH PROVIDER
// =====================================================

export function AuthProvider({ children }) {
  const [nguoiDung, setNguoiDung] = useState(null);

  const [dangKhoiTao, setDangKhoiTao] = useState(true);

  // =================================================
  // KHÔI PHỤC PHIÊN ĐĂNG NHẬP KHI MỞ WEBSITE
  // =================================================

  useEffect(function () {
    let componentConTonTai = true;

    // Khi access token hết hạn và refresh thất bại
    const huyTheoDoiHetPhien = datXuLyHetPhien(function () {
      if (componentConTonTai) {
        setNguoiDung(null);
      }
    });

    async function khoiTaoPhien() {
      try {
        // Thử lấy access token mới từ refresh cookie
        await authService.lamMoiToken();

        // Lấy thông tin người dùng
        const nguoiDungHienTai = await authService.layThongTinCuaToi();

        if (componentConTonTai) {
          setNguoiDung(nguoiDungHienTai);
        }
      } catch (error) {
        // Không có phiên hợp lệ
        xoaAccessToken();

        if (componentConTonTai) {
          setNguoiDung(null);
        }
      } finally {
        if (componentConTonTai) {
          setDangKhoiTao(false);
        }
      }
    }

    khoiTaoPhien();

    return function () {
      componentConTonTai = false;

      huyTheoDoiHetPhien();
    };
  }, []);

  // =================================================
  // ĐĂNG NHẬP
  // =================================================

  async function xuLyDangNhap(email, matKhau) {
    const ketQua = await authService.dangNhap({
      email: email,
      matKhau: matKhau,
    });

    setNguoiDung(ketQua.nguoiDung);

    return ketQua.nguoiDung;
  }

  // =================================================
  // ĐĂNG KÝ
  // =================================================

  async function xuLyDangKy(thongTin) {
    return await authService.dangKy(thongTin);
  }

  // =================================================
  // ĐĂNG XUẤT
  // =================================================

  async function xuLyDangXuat() {
    try {
      await authService.dangXuat();
    } catch (error) {
      // Không giữ trạng thái đăng nhập ở Frontend
      // nếu API đăng xuất gặp lỗi.
    } finally {
      xoaAccessToken();

      setNguoiDung(null);
    }
  }

  // =================================================
  // KIỂM TRA VAI TRÒ
  // =================================================

  function coVaiTro(tenVaiTro) {
    if (!nguoiDung || !nguoiDung.vaiTros) {
      return false;
    }

    return nguoiDung.vaiTros.includes(tenVaiTro);
  }

  // Các giá trị cung cấp cho toàn bộ ứng dụng
  const giaTri = useMemo(
    function () {
      return {
        nguoiDung: nguoiDung,

        dangKhoiTao: dangKhoiTao,

        daDangNhap: nguoiDung !== null,

        dangNhap: xuLyDangNhap,

        dangKy: xuLyDangKy,

        dangXuat: xuLyDangXuat,

        coVaiTro: coVaiTro,
      };
    },
    [nguoiDung, dangKhoiTao],
  );

  return <AuthContext.Provider value={giaTri}>{children}</AuthContext.Provider>;
}

// =====================================================
// CUSTOM HOOK
// =====================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider.");
  }

  return context;
}
