import axiosClient, { lamMoiAccessToken } from "../api/axiosClient";

import { datAccessToken, xoaAccessToken } from "../api/tokenStore";

// =====================================================
// ĐĂNG KÝ
// =====================================================

export async function dangKy(thongTin) {
  const response = await axiosClient.post("/auth/dang-ky", {
    hoTen: thongTin.hoTen,
    email: thongTin.email,
    matKhau: thongTin.matKhau,
    soDienThoai: thongTin.soDienThoai || null,
  });

  return response.data.data;
}

// =====================================================
// ĐĂNG NHẬP
// =====================================================

export async function dangNhap(thongTin) {
  const response = await axiosClient.post("/auth/dang-nhap", {
    email: thongTin.email,
    matKhau: thongTin.matKhau,
  });

  const duLieu = response.data.data;

  if (!duLieu || !duLieu.accessToken) {
    throw new Error("Không nhận được access token từ Backend.");
  }

  // Lưu access token vào bộ nhớ
  datAccessToken(duLieu.accessToken);

  return duLieu;
}

// =====================================================
// LÀM MỚI ACCESS TOKEN
// =====================================================

export async function lamMoiToken() {
  return await lamMoiAccessToken();
}

// =====================================================
// ĐĂNG XUẤT
// =====================================================

export async function dangXuat() {
  try {
    await axiosClient.post("/auth/dang-xuat", null, {
      headers: {
        "X-Auth-Action": "1",
      },
    });
  } finally {
    // Dù API đăng xuất lỗi vẫn xóa access token ở Frontend
    xoaAccessToken();
  }
}

// =====================================================
// LẤY THÔNG TIN NGƯỜI DÙNG HIỆN TẠI
// =====================================================

export async function layThongTinCuaToi() {
  const response = await axiosClient.get("/auth/toi");

  return response.data.data;
}
