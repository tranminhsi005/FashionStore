import axiosClient from "../api/axiosClient";

// =====================================================
// 1. DANH SÁCH TỒN KHO
// GET /admin/kho
// =====================================================

export async function layDanhSachTonKhoAdmin(thamSo = {}) {
  const params = {
    trang: thamSo.trang || 1,
    kichThuocTrang: thamSo.kichThuocTrang || 20,
  };

  if (thamSo.tuKhoa && thamSo.tuKhoa.trim()) {
    params.tuKhoa = thamSo.tuKhoa.trim();
  }

  if (typeof thamSo.conHang === "boolean") {
    params.conHang = thamSo.conHang;
  }

  const response = await axiosClient.get("/admin/kho", {
    params: params,
  });

  return response.data?.data ?? response.data;
}

// =====================================================
// 2. CHI TIẾT TỒN KHO
// GET /admin/kho/bien-the/{bienTheId}
// =====================================================

export async function layChiTietTonKhoAdmin(bienTheId) {
  const response = await axiosClient.get(`/admin/kho/bien-the/${bienTheId}`);

  return response.data?.data ?? response.data;
}

// =====================================================
// 3. LỊCH SỬ TỒN KHO
// GET /admin/kho/bien-the/{bienTheId}/lich-su
// =====================================================

export async function layLichSuTonKhoAdmin(bienTheId, thamSo = {}) {
  const response = await axiosClient.get(
    `/admin/kho/bien-the/${bienTheId}/lich-su`,
    {
      params: {
        trang: thamSo.trang || 1,
        kichThuocTrang: thamSo.kichThuocTrang || 10,
      },
    },
  );

  return response.data?.data ?? response.data;
}

// =====================================================
// 4. NHẬP KHO
// POST /admin/kho/bien-the/{bienTheId}/nhap
// =====================================================

export async function nhapKhoAdmin(bienTheId, thongTin) {
  const response = await axiosClient.post(
    `/admin/kho/bien-the/${bienTheId}/nhap`,
    {
      soLuong: thongTin.soLuong,
      ghiChu: thongTin.ghiChu || null,
    },
  );

  return response.data?.data ?? response.data;
}

// =====================================================
// 5. XUẤT KHO
// POST /admin/kho/bien-the/{bienTheId}/xuat
// =====================================================

export async function xuatKhoAdmin(bienTheId, thongTin) {
  const response = await axiosClient.post(
    `/admin/kho/bien-the/${bienTheId}/xuat`,
    {
      soLuong: thongTin.soLuong,
      ghiChu: thongTin.ghiChu || null,
    },
  );

  return response.data?.data ?? response.data;
}

// =====================================================
// 6. ĐIỀU CHỈNH TỒN KHO
// PUT /admin/kho/bien-the/{bienTheId}/dieu-chinh
// =====================================================

export async function dieuChinhTonKhoAdmin(bienTheId, thongTin) {
  const response = await axiosClient.put(
    `/admin/kho/bien-the/${bienTheId}/dieu-chinh`,
    {
      soLuongMoi: thongTin.soLuongMoi,
      ghiChu: thongTin.ghiChu,
    },
  );

  return response.data?.data ?? response.data;
}
