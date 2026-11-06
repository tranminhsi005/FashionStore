import axiosClient from "../api/axiosClient";

// =============================================
// DANH SÁCH SẢN PHẨM
// =============================================

export async function layDanhSachSanPham(params = {}) {
  const response = await axiosClient.get("/san-pham", {
    params: params,
  });

  return response.data.data;
}

// =============================================
// SẢN PHẨM NỔI BẬT
// =============================================

export async function laySanPhamNoiBat(soLuong = 8) {
  const response = await axiosClient.get("/san-pham/noi-bat", {
    params: {
      soLuong: soLuong,
    },
  });

  return response.data.data;
}

// =============================================
// SẢN PHẨM MỚI NHẤT
// =============================================

export async function laySanPhamMoiNhat(soLuong = 8) {
  const response = await axiosClient.get("/san-pham/moi-nhat", {
    params: {
      soLuong: soLuong,
    },
  });

  return response.data.data;
}

// =============================================
// CHI TIẾT SẢN PHẨM THEO SLUG
// =============================================

export async function layChiTietSanPham(slug) {
  const response = await axiosClient.get(
    `/san-pham/${encodeURIComponent(slug)}`,
  );

  return response.data.data;
}

// =============================================
// DANH SÁCH DANH MỤC
// =============================================

export async function layDanhSachDanhMuc() {
  const response = await axiosClient.get("/danh-muc");

  return response.data.data;
}

// =============================================
// DANH SÁCH THƯƠNG HIỆU
// =============================================

export async function layDanhSachThuongHieu() {
  const response = await axiosClient.get("/thuong-hieu");

  return response.data.data;
}

// =============================================
// DANH SÁCH KÍCH CỠ
// =============================================

export async function layDanhSachKichCo() {
  const response = await axiosClient.get("/kich-co");

  return response.data.data;
}

// =============================================
// DANH SÁCH MÀU SẮC
// =============================================

export async function layDanhSachMauSac() {
  const response = await axiosClient.get("/mau-sac");

  return response.data.data;
}
