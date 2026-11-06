import axiosClient from "../api/axiosClient";

// Chuẩn hóa response của Backend
function layDuLieuGioHang(response) {
  return response.data?.data ?? response.data;
}

// =============================================
// 1. LẤY GIỎ HÀNG
// GET /gio-hang
// =============================================

export async function layGioHang() {
  const response = await axiosClient.get("/gio-hang");

  return layDuLieuGioHang(response);
}

// =============================================
// 2. THÊM SẢN PHẨM VÀO GIỎ HÀNG
// POST /gio-hang/items
// =============================================

export async function themVaoGioHang(bienTheSanPhamId, soLuong = 1) {
  const response = await axiosClient.post("/gio-hang/items", {
    bienTheSanPhamId: bienTheSanPhamId,
    soLuong: soLuong,
  });

  return layDuLieuGioHang(response);
}

// =============================================
// 3. CẬP NHẬT SỐ LƯỢNG
// PUT /gio-hang/items/{id}
// =============================================

export async function capNhatSoLuong(chiTietGioHangId, soLuong) {
  const response = await axiosClient.put(
    `/gio-hang/items/${chiTietGioHangId}`,
    {
      soLuong: soLuong,
    },
  );

  return layDuLieuGioHang(response);
}

// =============================================
// 4. XÓA MỘT SẢN PHẨM
// DELETE /gio-hang/items/{id}
// =============================================

export async function xoaSanPhamKhoiGioHang(chiTietGioHangId) {
  const response = await axiosClient.delete(
    `/gio-hang/items/${chiTietGioHangId}`,
  );

  return layDuLieuGioHang(response);
}

// =============================================
// 5. XÓA TOÀN BỘ GIỎ HÀNG
// DELETE /gio-hang
// =============================================

export async function xoaTatCaGioHang() {
  const response = await axiosClient.delete("/gio-hang");

  return layDuLieuGioHang(response);
}
