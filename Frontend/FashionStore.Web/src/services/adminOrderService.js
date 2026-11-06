import axiosClient from "../api/axiosClient";

// Lấy dữ liệu từ response
function layDuLieu(response) {
  return response.data?.data ?? response.data;
}

// =====================================================
// 1. DANH SÁCH ĐƠN HÀNG ADMIN
// GET /admin/don-hang
// =====================================================

export async function layDanhSachDonHangAdmin(thamSo = {}) {
  const response = await axiosClient.get("/admin/don-hang", {
    params: {
      trang: thamSo.trang || 1,
      kichThuocTrang: thamSo.kichThuocTrang || 10,
      trangThai: thamSo.trangThai || undefined,
      tuKhoa: thamSo.tuKhoa?.trim() || undefined,
    },
  });

  return layDuLieu(response);
}

// =====================================================
// 2. CHI TIẾT ĐƠN HÀNG ADMIN
// GET /admin/don-hang/{id}
// =====================================================

export async function layChiTietDonHangAdmin(id) {
  const response = await axiosClient.get(`/admin/don-hang/${id}`);

  return layDuLieu(response);
}

// =====================================================
// 3. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
// PUT /admin/don-hang/{id}/trang-thai
// =====================================================

export async function capNhatTrangThaiDonHangAdmin(id, thongTin) {
  const response = await axiosClient.put(`/admin/don-hang/${id}/trang-thai`, {
    trangThaiMoi: thongTin.trangThaiMoi,
    ghiChu: thongTin.ghiChu || null,
  });

  return layDuLieu(response);
}

// =====================================================
// 4. CẬP NHẬT VẬN CHUYỂN
// PUT /admin/don-hang/{id}/van-chuyen
// =====================================================

export async function capNhatVanChuyenAdmin(id, thongTin) {
  const response = await axiosClient.put(`/admin/don-hang/${id}/van-chuyen`, {
    trangThaiMoi: thongTin.trangThaiMoi,
    donViVanChuyen: thongTin.donViVanChuyen || null,
    maVanDon: thongTin.maVanDon || null,
    ghiChu: thongTin.ghiChu || null,
  });

  return layDuLieu(response);
}

// =====================================================
// 5. ADMIN HỦY ĐƠN HÀNG
// PUT /admin/don-hang/{id}/huy
// =====================================================

export async function adminHuyDonHang(id, lyDoHuy) {
  const response = await axiosClient.put(`/admin/don-hang/${id}/huy`, {
    lyDoHuy: lyDoHuy,
  });

  return layDuLieu(response);
}

// =====================================================
// 6. XÁC NHẬN ĐÃ GIAO VÀ THU ĐỦ TIỀN COD
// PUT /admin/don-hang/{id}/xac-nhan-da-giao
// =====================================================

export async function xacNhanDaGiaoCODAdmin(id, thongTin) {
  const response = await axiosClient.put(
    `/admin/don-hang/${id}/xac-nhan-da-giao`,
    {
      daThuDuTien: thongTin.daThuDuTien,
      ghiChu: thongTin.ghiChu || null,
    },
  );

  return layDuLieu(response);
}
