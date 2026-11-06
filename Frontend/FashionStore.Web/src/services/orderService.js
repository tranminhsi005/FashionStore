import axiosClient from "../api/axiosClient";

// =============================================
// 1. TẠO ĐƠN HÀNG
// POST /don-hang/checkout
// =============================================

export async function taoDonHang(thongTin) {
  const response = await axiosClient.post("/don-hang/checkout", {
    diaChiGiaoHangId: thongTin.diaChiGiaoHangId,
    phuongThucThanhToan: "cod",
    ghiChuKhachHang: thongTin.ghiChuKhachHang || null,
    khoaIdempotent: thongTin.khoaIdempotent,
  });

  return response.data?.data ?? response.data;
}

// =============================================
// 2. LẤY DANH SÁCH ĐƠN HÀNG
// GET /don-hang
// =============================================

export async function layDanhSachDonHang(params = {}) {
  const response = await axiosClient.get("/don-hang", {
    params: {
      trang: params.trang || 1,
      kichThuocTrang: params.kichThuocTrang || 10,
      trangThai: params.trangThai || undefined,
    },
  });

  return response.data?.data ?? response.data;
}

// =============================================
// 3. LẤY CHI TIẾT ĐƠN HÀNG
// GET /don-hang/{id}
// =============================================

export async function layChiTietDonHang(id) {
  const response = await axiosClient.get(`/don-hang/${id}`);

  return response.data?.data ?? response.data;
}

// =============================================
// 4. KHÁCH HÀNG HỦY ĐƠN HÀNG
// PUT /don-hang/{id}/huy
// =============================================

export async function huyDonHang(id, lyDoHuy) {
  const response = await axiosClient.put(`/don-hang/${id}/huy`, {
    lyDoHuy: lyDoHuy,
  });

  return response.data?.data ?? response.data;
}
