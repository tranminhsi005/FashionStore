import { adminGet, adminPost, adminPut, adminDelete } from "./adminService";

// =============================================
// 1. LẤY DANH SÁCH ẢNH
// GET /admin/san-pham/{sanPhamId}/anh
// =============================================

export async function layDanhSachAnhAdmin(sanPhamId) {
  return await adminGet(`/admin/san-pham/${sanPhamId}/anh`);
}

// =============================================
// 2. UPLOAD ẢNH
// POST /admin/san-pham/{sanPhamId}/anh
// Content-Type: multipart/form-data
// =============================================

export async function uploadAnhSanPhamAdmin(sanPhamId, thongTin) {
  const formData = new FormData();

  formData.append("File", thongTin.file);

  formData.append("MoTaAnh", thongTin.moTaAnh || "");

  formData.append("LaAnhChinh", thongTin.laAnhChinh ? "true" : "false");

  formData.append("ThuTuHienThi", String(thongTin.thuTuHienThi ?? 0));

  return await adminPost(`/admin/san-pham/${sanPhamId}/anh`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// =============================================
// 3. ĐẶT ẢNH CHÍNH
// PUT /admin/anh-san-pham/{anhId}/anh-chinh
// =============================================

export async function datAnhChinhAdmin(anhId) {
  return await adminPut(`/admin/anh-san-pham/${anhId}/anh-chinh`, {});
}

// =============================================
// 4. XÓA ẢNH
// DELETE /admin/anh-san-pham/{anhId}
// =============================================

export async function xoaAnhSanPhamAdmin(anhId) {
  return await adminDelete(`/admin/anh-san-pham/${anhId}`);
}
